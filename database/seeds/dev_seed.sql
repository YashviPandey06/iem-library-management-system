-- =====================================================================
-- IEM LIBRARY MANAGEMENT SYSTEM - DEVELOPMENT SEED DATA (DML)
-- Institution: Institute of Engineering & Management, Kolkata
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Initial Academic Books Catalog
-- ---------------------------------------------------------------------
INSERT OR IGNORE INTO books (book_id, title, author, publication_year, total_copies, available_copies, created_at, updated_at) VALUES
('B101', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 2022, 5, 4, datetime('now'), datetime('now')),
('B102', 'Clean Architecture: A Craftsman''s Guide to Software Structure and Design', 'Robert C. Martin', 2017, 3, 3, datetime('now'), datetime('now')),
('B103', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 1994, 4, 3, datetime('now'), datetime('now')),
('B104', 'Operating System Concepts (10th Edition)', 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne', 2021, 6, 6, datetime('now'), datetime('now')),
('B105', 'Artificial Intelligence: A Modern Approach (4th Edition)', 'Stuart Russell, Peter Norvig', 2020, 4, 4, datetime('now'), datetime('now')),
('B106', 'Database System Concepts (7th Edition)', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', 2019, 5, 5, datetime('now'), datetime('now')),
('B107', 'Computer Networks (6th Edition)', 'Andrew S. Tanenbaum, Nick Feamster, David Wetherall', 2021, 5, 5, datetime('now'), datetime('now'));

-- ---------------------------------------------------------------------
-- 2. Student Patron Registry
-- ---------------------------------------------------------------------
INSERT OR IGNORE INTO students (student_id, name, email, created_at) VALUES
('S101', 'Alex Rivera', 'alex@iemcal.ac.in', datetime('now')),
('S102', 'Sarah Connor', 'sarah@iemcal.ac.in', datetime('now')),
('S103', 'Charlie Davis', 'charlie@iemcal.ac.in', datetime('now')),
('S104', 'Diana Prince', 'diana@iemcal.ac.in', datetime('now'));

-- ---------------------------------------------------------------------
-- 3. Demonstration User Accounts (BCrypt Hashes)
-- Default Passwords:
-- - librarian@iemcal.ac.in : admin123
-- - alex@iemcal.ac.in      : student123
-- - sarah@iemcal.ac.in     : student123
-- ---------------------------------------------------------------------
INSERT OR IGNORE INTO users (user_id, name, email, password_hash, role, created_at, updated_at) VALUES
('LIB001', 'Eleanor Vance (Chief Librarian)', 'librarian@iemcal.ac.in', '/V1aV8yK98k7u7d5d.s3i5s5iG7W/d4U8rY9rI1pW6V4w6gOi', 'LIBRARIAN', datetime('now'), datetime('now')),
('S101', 'Alex Rivera', 'alex@iemcal.ac.in', '.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p', 'STUDENT', datetime('now'), datetime('now')),
('S102', 'Sarah Connor', 'sarah@iemcal.ac.in', '.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p', 'STUDENT', datetime('now'), datetime('now'));

-- ---------------------------------------------------------------------
-- 4. Initial Active Issue Records
-- ---------------------------------------------------------------------
INSERT OR IGNORE INTO transactions (transaction_id, book_id, student_id, issue_date, return_date, status, created_at) VALUES
('TX-7D142817', 'B101', 'S101', date('now'), NULL, 'ISSUED', datetime('now')),
('TX-C9EF306E', 'B103', 'S101', date('now'), NULL, 'ISSUED', datetime('now'));
