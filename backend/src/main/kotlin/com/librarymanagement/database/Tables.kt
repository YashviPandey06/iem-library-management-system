package com.librarymanagement.database

import org.jetbrains.exposed.sql.Table

object BooksTable : Table("books") {
    val id = integer("id").autoIncrement()
    val bookId = varchar("book_id", 64).uniqueIndex()
    val title = varchar("title", 255)
    val author = varchar("author", 255)
    val publicationYear = integer("publication_year")
    val totalCopies = integer("total_copies")
    val availableCopies = integer("available_copies")
    val createdAt = varchar("created_at", 64)
    val updatedAt = varchar("updated_at", 64)

    override val primaryKey = PrimaryKey(id)
}

object StudentsTable : Table("students") {
    val id = integer("id").autoIncrement()
    val studentId = varchar("student_id", 64).uniqueIndex()
    val name = varchar("name", 255)
    val email = varchar("email", 255).nullable()
    val createdAt = varchar("created_at", 64)

    override val primaryKey = PrimaryKey(id)
}

object TransactionsTable : Table("transactions") {
    val id = integer("id").autoIncrement()
    val transactionId = varchar("transaction_id", 64).uniqueIndex()
    val bookId = varchar("book_id", 64).index()
    val studentId = varchar("student_id", 64).index()
    val issueDate = varchar("issue_date", 64)
    val returnDate = varchar("return_date", 64).nullable()
    val status = varchar("status", 32)
    val createdAt = varchar("created_at", 64)

    override val primaryKey = PrimaryKey(id)
}

object UsersTable : Table("users") {
    val id = integer("id").autoIncrement()
    val userId = varchar("user_id", 64).uniqueIndex()
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val role = varchar("role", 32) // "LIBRARIAN", "STUDENT"
    val createdAt = varchar("created_at", 64)
    val updatedAt = varchar("updated_at", 64)

    override val primaryKey = PrimaryKey(id)
}

object UserSessionsTable : Table("user_sessions") {
    val id = integer("id").autoIncrement()
    val token = varchar("token", 128).uniqueIndex()
    val userId = varchar("user_id", 64).index()
    val role = varchar("role", 32)
    val createdAt = varchar("created_at", 64)
    val expiresAt = varchar("expires_at", 64)

    override val primaryKey = PrimaryKey(id)
}
