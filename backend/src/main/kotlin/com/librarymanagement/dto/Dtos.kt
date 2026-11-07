package com.librarymanagement.dto

import com.librarymanagement.models.UserDto
import kotlinx.serialization.Serializable

@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String? = null,
    val errors: List<String>? = null
)

@Serializable
data class LoginRequest(
    val identifier: String,
    val password: String,
    val rememberMe: Boolean = false
)

@Serializable
data class RegisterRequest(
    val userId: String? = null,
    val name: String,
    val email: String,
    val password: String,
    val role: String? = "STUDENT"
)

@Serializable
data class AuthResponse(
    val token: String,
    val user: UserDto
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
data class BookUpdateRequest(
    val title: String,
    val author: String,
    val publicationYear: Int,
    val totalCopies: Int
)

@Serializable
data class StudentCreateRequest(
    val studentId: String,
    val name: String,
    val email: String? = null
)

@Serializable
data class StudentUpdateRequest(
    val name: String,
    val email: String? = null
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

@Serializable
data class MessageResponse(
    val message: String
)

@Serializable
data class HealthResponse(
    val status: String,
    val service: String,
    val timestamp: String
)
