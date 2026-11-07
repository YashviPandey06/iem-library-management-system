package com.librarymanagement.android.data

import kotlinx.serialization.Serializable

@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String? = null,
    val errors: List<String>? = null
)

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
    val status: String,
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
data class BookCreateRequest(
    val bookId: String,
    val title: String,
    val author: String,
    val publicationYear: Int,
    val totalCopies: Int
)

@Serializable
data class IssueBookRequest(
    val bookId: String,
    val studentId: String
)

@Serializable
data class ReturnBookRequest(
    val bookId: String,
    val studentId: String
)
