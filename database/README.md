# Database Architecture & Management Guide
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

---

## 1. Overview

The IEM Library Management System uses **SQLite 3.x** as its default embedded persistence engine, interfaced via **JetBrains Exposed ORM (0.50.1)** and the official **Xerial SQLite JDBC driver (3.45.3.0)** in Kotlin.

### Key Characteristics:
- **Zero-Configuration Deployment**: Runs out-of-the-box without requiring an external database server daemon.
- **Embedded File Persistence**: Persists all records to a single portable file (`library.db`).
- **Automatic ORM Migration**: On server startup, Exposed ORM automatically checks the schema and invokes `SchemaUtils.createMissingTablesAndColumns()`.
- **Automatic Development Seeding**: On first boot, `LibraryService.seedData()` populates verified academic textbooks, student records, and BCrypt-hashed demonstration user accounts.
- **ACID Compliant**: Complete transactional integrity for book checkouts and returns using `newSuspendedTransaction(Dispatchers.IO)`.

---

## 2. Directory Structure

```text
database/
├── schema/
│   └── schema.sql              # Standalone DDL creating all 5 tables and indexes
├── migrations/
│   └── V1__initial_schema.sql  # Flyway/Liquibase-compatible initial migration script
├── seeds/
│   └── dev_seed.sql            # Sample catalog, students, and demo credentials
└── README.md                   # This documentation
```

---

## 3. Database Schema Specification

### 3.1. `books` Table
Tracks physical inventory, publication details, and circulation quantities.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal synthetic identifier |
| `book_id` | VARCHAR(64) | UNIQUE NOT NULL | Human-readable book accession code (e.g. `B101`) |
| `title` | VARCHAR(255) | NOT NULL | Complete title of the book |
| `author` | VARCHAR(255) | NOT NULL | Authors / editors |
| `publication_year`| INTEGER | NOT NULL | Year of publication (1000 - current year) |
| `total_copies` | INTEGER | NOT NULL (>= 0) | Total physical holdings in the library |
| `available_copies`| INTEGER | NOT NULL (0..total) | Current shelf copies available for issue |
| `created_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC creation timestamp |
| `updated_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC update timestamp |

### 3.2. `students` Table
Student patron registry for membership tracking and issue authorization.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal synthetic identifier |
| `student_id` | VARCHAR(64) | UNIQUE NOT NULL | Institutional roll/card number (e.g. `S101`) |
| `name` | VARCHAR(255) | NOT NULL | Full name of the student |
| `email` | VARCHAR(255) | NULLABLE | Institutional email address |
| `created_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC creation timestamp |

### 3.3. `transactions` Table
Circulation audit ledger recording book issues, returns, and active loans.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal synthetic identifier |
| `transaction_id`| VARCHAR(64) | UNIQUE NOT NULL | Unique transaction code (e.g. `TX-7D142817`) |
| `book_id` | VARCHAR(64) | NOT NULL, INDEX | Foreign key to `books(book_id)` |
| `student_id` | VARCHAR(64) | NOT NULL, INDEX | Foreign key to `students(student_id)` |
| `issue_date` | VARCHAR(64) | NOT NULL | YYYY-MM-DD issue date |
| `return_date`| VARCHAR(64) | NULLABLE | YYYY-MM-DD return date (NULL if still on loan) |
| `status` | VARCHAR(32) | NOT NULL (`ISSUED`, `RETURNED`) | Current loan status |
| `created_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC creation timestamp |

### 3.4. `users` Table
Unified identity and credential store for role-based authentication.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal synthetic identifier |
| `user_id` | VARCHAR(64) | UNIQUE NOT NULL | Login ID (`LIB001`, `S101`, etc.) |
| `name` | VARCHAR(255) | NOT NULL | Display name |
| `email` | VARCHAR(255) | UNIQUE NOT NULL | Email address |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt 12-round salted hash |
| `role` | VARCHAR(32) | NOT NULL (`LIBRARIAN`, `STUDENT`) | Authorization role |
| `created_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC creation timestamp |
| `updated_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC update timestamp |

### 3.5. `user_sessions` Table
Cryptographic bearer session tokens for stateless REST authentication.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal synthetic identifier |
| `token` | VARCHAR(128)| UNIQUE NOT NULL, INDEX | 64-character SHA-256 secure random token |
| `user_id` | VARCHAR(64) | NOT NULL, INDEX | Associated user ID |
| `role` | VARCHAR(32) | NOT NULL | Cached authorization role |
| `created_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC issuance timestamp |
| `expires_at` | VARCHAR(64) | NOT NULL | ISO-8601 UTC expiration timestamp (7-30 days) |

---

## 4. Manual Database Setup & Seeding

While the Kotlin Ktor backend automatically creates and seeds the database, you can also manage the database directly using the standard `sqlite3` CLI tool:

### Create New Database File from DDL:
```bash
sqlite3 library.db < database/schema/schema.sql
```

### Apply Development Seed Data:
```bash
sqlite3 library.db < database/seeds/dev_seed.sql
```

### Verify Tables:
```bash
sqlite3 library.db ".tables"
# Output: books  students  transactions  user_sessions  users
```

---

## 5. Enterprise Production Migration (PostgreSQL / MySQL)

To migrate from SQLite to an enterprise database like PostgreSQL for high-volume multi-node deployments:

1. Update `backend/build.gradle.kts`:
   ```kotlin
   implementation("org.postgresql:postgresql:42.7.3")
   ```
2. Set environment variables in your deployment target:
   ```env
   DATABASE_DRIVER=org.postgresql.Driver
   DATABASE_URL=jdbc:postgresql://postgres.internal:5432/iem_library
   DATABASE_USER=iem_admin
   DATABASE_PASSWORD=your_secure_password
   ```
3. The Exposed ORM models (`Tables.kt`) are dialect-neutral and will automatically negotiate PostgreSQL syntax without modifying any application business logic.

---

## 6. Backup & Restore Procedures

### Hot Backup (Live SQLite):
```bash
sqlite3 library.db ".backup 'backup_20261107_120000.db'"
```

### Restore:
```bash
cp backup_20261107_120000.db library.db
```
