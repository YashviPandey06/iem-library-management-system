-- =====================================================================
-- IEM LIBRARY MANAGEMENT SYSTEM - DATABASE SCHEMA (DDL)
-- Institution: Institute of Engineering & Management, Kolkata
-- Target Database: SQLite 3.x (Compatible with PostgreSQL / MySQL)
-- ORM: JetBrains Exposed (Kotlin JVM)
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- Table: books
-- Core academic book catalog and inventory tracking
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publication_year INTEGER NOT NULL,
    total_copies INTEGER NOT NULL CHECK (total_copies >= 0),
    available_copies INTEGER NOT NULL CHECK (available_copies >= 0 AND available_copies <= total_copies),
    created_at VARCHAR(64) NOT NULL,
    updated_at VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_books_book_id ON books(book_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- ---------------------------------------------------------------------
-- Table: students
-- Student patron registry
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- ---------------------------------------------------------------------
-- Table: transactions
-- Book checkout, issue, and return audit logs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id VARCHAR(64) NOT NULL UNIQUE,
    book_id VARCHAR(64) NOT NULL,
    student_id VARCHAR(64) NOT NULL,
    issue_date VARCHAR(64) NOT NULL,
    return_date VARCHAR(64),
    status VARCHAR(32) NOT NULL CHECK (status IN ('ISSUED', 'RETURNED')),
    created_at VARCHAR(64) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE RESTRICT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_transactions_book_id ON transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_id ON transactions(transaction_id);

-- ---------------------------------------------------------------------
-- Table: users
-- Unified user authentication registry (Librarians & Student Patrons)
-- Password hashes use BCrypt algorithm ($...)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('LIBRARIAN', 'STUDENT')),
    created_at VARCHAR(64) NOT NULL,
    updated_at VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ---------------------------------------------------------------------
-- Table: user_sessions
-- Active cryptographic bearer session tokens for stateless REST calls
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token VARCHAR(128) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL,
    created_at VARCHAR(64) NOT NULL,
    expires_at VARCHAR(64) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
