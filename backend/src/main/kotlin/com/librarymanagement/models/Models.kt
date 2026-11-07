package com.librarymanagement.models

import kotlinx.serialization.Serializable

@Serializable
enum class TransactionStatus {
    ISSUED,
    RETURNED
}

@Serializable
enum class UserRole {
    LIBRARIAN,
    STUDENT
}

@Serializable
data class Book(
    val id: Int = 0,
    val bookId: String,
    val title: String,
    val author: String,
    val publicationYear: Int,
    val totalCopies: Int,
    val availableCopies: Int,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class Student(
    val id: Int = 0,
    val studentId: String,
    val name: String,
    val email: String? = null,
    val createdAt: String? = null
)

@Serializable
data class IssueTransaction(
    val id: Int = 0,
    val transactionId: String,
    val bookId: String,
    val bookTitle: String,
    val studentId: String,
    val studentName: String? = null,
    val issueDate: String,
    val returnDate: String? = null,
    val status: TransactionStatus,
    val createdAt: String? = null
)

@Serializable
data class DashboardStats(
    val totalBooks: Int,
    val totalAvailableCopies: Int,
    val totalIssuedCopies: Int,
    val totalStudents: Int,
    val totalReturnedCount: Int
)

@Serializable
data class PopularBook(
    val bookId: String,
    val title: String,
    val author: String,
    val issueCount: Int,
    val availableCopies: Int
)

@Serializable
data class ActivityItem(
    val id: String,
    val type: String, // ISSUE, RETURN, BOOK_ADDED
    val title: String,
    val description: String,
    val timestamp: String
)

data class UserRecord(
    val id: Int = 0,
    val userId: String,
    val name: String,
    val email: String,
    val passwordHash: String,
    val role: UserRole,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class UserDto(
    val id: Int = 0,
    val userId: String,
    val name: String,
    val email: String,
    val role: UserRole,
    val createdAt: String? = null
)

@Serializable
data class UserSession(
    val token: String,
    val userId: String,
    val role: UserRole,
    val createdAt: String,
    val expiresAt: String
)

@Serializable
data class StudentDashboardSummary(
    val student: Student,
    val activeLoans: List<IssueTransaction>,
    val totalBorrowedCount: Int,
    val returnedCount: Int,
    val history: List<IssueTransaction>
)
