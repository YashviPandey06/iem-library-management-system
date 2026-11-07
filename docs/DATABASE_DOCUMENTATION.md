# Database Architecture & Entity Relationship Specification
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

---

## 1. Entity-Relationship Model (ER Diagram)

```mermaid
erDiagram
    BOOKS ||--o{ TRANSACTIONS : "issued in"
    STUDENTS ||--o{ TRANSACTIONS : "borrowed by"
    USERS ||--o{ USER_SESSIONS : "authenticates"
    STUDENTS ||--o| USERS : "links to"

    BOOKS {
        int id PK "Auto Increment"
        string book_id UK "Accession Code (e.g. B101)"
        string title "Book Title"
        string author "Authors"
        int publication_year "Year of Publication"
        int total_copies "Total Physical Inventory"
        int available_copies "Available on Shelf"
        string created_at "ISO-8601 Timestamp"
        string updated_at "ISO-8601 Timestamp"
    }

    STUDENTS {
        int id PK "Auto Increment"
        string student_id UK "Roll/Card Number (e.g. S101)"
        string name "Student Full Name"
        string email "Institutional Email"
        string created_at "ISO-8601 Timestamp"
    }

    TRANSACTIONS {
        int id PK "Auto Increment"
        string transaction_id UK "Transaction Code"
        string book_id FK "References books.book_id"
        string student_id FK "References students.student_id"
        string issue_date "Date Issued (YYYY-MM-DD)"
        string return_date "Date Returned (YYYY-MM-DD)"
        string status "ISSUED or RETURNED"
        string created_at "ISO-8601 Timestamp"
    }

    USERS {
        int id PK "Auto Increment"
        string user_id UK "User Login ID"
        string name "Full Name"
        string email UK "Login Email"
        string password_hash "BCrypt Salted Hash"
        string role "LIBRARIAN or STUDENT"
        string created_at "ISO-8601 Timestamp"
        string updated_at "ISO-8601 Timestamp"
    }

    USER_SESSIONS {
        int id PK "Auto Increment"
        string token UK "Cryptographic Bearer Token"
        string user_id FK "References users.user_id"
        string role "Cached User Role"
        string created_at "ISO-8601 Timestamp"
        string expires_at "ISO-8601 Timestamp"
    }
```

---

## 2. Table Specifications

### 2.1. `books`
- **Purpose**: Physical inventory and publication catalog.
- **Indexes**:
  - `PRIMARY KEY (id)`
  - `UNIQUE (book_id)`
  - `INDEX idx_books_title (title)`
  - `INDEX idx_books_author (author)`
- **Constraints**:
  - `CHECK (total_copies >= 0)`
  - `CHECK (available_copies >= 0 AND available_copies <= total_copies)`

### 2.2. `students`
- **Purpose**: Official institutional student patron registry.
- **Indexes**:
  - `PRIMARY KEY (id)`
  - `UNIQUE (student_id)`
  - `INDEX idx_students_email (email)`

### 2.3. `transactions`
- **Purpose**: Circulation audit ledger recording book borrowings and returns.
- **Foreign Keys**:
  - `book_id` -> `books(book_id)` ON DELETE RESTRICT
  - `student_id` -> `students(student_id)` ON DELETE RESTRICT
- **Indexes**:
  - `PRIMARY KEY (id)`
  - `UNIQUE (transaction_id)`
  - `INDEX idx_transactions_book_id (book_id)`
  - `INDEX idx_transactions_student_id (student_id)`
  - `INDEX idx_transactions_status (status)`

### 2.4. `users`
- **Purpose**: Authentication registry for all system actors.
- **Indexes**:
  - `PRIMARY KEY (id)`
  - `UNIQUE (user_id)`
  - `UNIQUE (email)`
  - `INDEX idx_users_role (role)`

### 2.5. `user_sessions`
- **Purpose**: Ephemeral bearer authentication tokens.
- **Foreign Keys**:
  - `user_id` -> `users(user_id)` ON DELETE CASCADE
- **Indexes**:
  - `PRIMARY KEY (id)`
  - `UNIQUE (token)`
  - `INDEX idx_user_sessions_user_id (user_id)`

---

## 3. ORM Mapping & Thread Safety

The application utilizes **JetBrains Exposed ORM** with DAO & DSL patterns:
- Tables are defined in `backend/src/main/kotlin/com/librarymanagement/database/Tables.kt`.
- All database write transactions are executed inside `newSuspendedTransaction(Dispatchers.IO)`.
- Concurrent issue operations are guarded by a Kotlin Coroutine `Mutex` to guarantee serialization and prevent race conditions on book availability counts.
