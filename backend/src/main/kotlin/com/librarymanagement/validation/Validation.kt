package com.librarymanagement.validation

import com.librarymanagement.dto.BookCreateRequest
import com.librarymanagement.dto.BookUpdateRequest
import com.librarymanagement.dto.StudentCreateRequest
import com.librarymanagement.dto.StudentUpdateRequest
import com.librarymanagement.exceptions.ValidationException
import java.time.Year

object Validator {

    fun validateBookCreate(request: BookCreateRequest) {
        val errors = mutableListOf<String>()

        if (request.bookId.trim().isEmpty()) {
            errors.add("Book ID cannot be empty.")
        } else if (request.bookId.trim().length < 2) {
            errors.add("Book ID must be at least 2 characters long.")
        }

        if (request.title.trim().isEmpty()) {
            errors.add("Book title cannot be empty.")
        }

        if (request.author.trim().isEmpty()) {
            errors.add("Author name cannot be empty.")
        }

        val currentYear = Year.now().value
        if (request.publicationYear < 1000 || request.publicationYear > currentYear + 1) {
            errors.add("Publication year must be between 1000 and ${currentYear + 1}.")
        }

        if (request.totalCopies < 0) {
            errors.add("Number of available copies cannot be negative.")
        }

        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }

    fun validateBookUpdate(request: BookUpdateRequest, currentIssuedCount: Int) {
        val errors = mutableListOf<String>()

        if (request.title.trim().isEmpty()) {
            errors.add("Book title cannot be empty.")
        }

        if (request.author.trim().isEmpty()) {
            errors.add("Author name cannot be empty.")
        }

        val currentYear = Year.now().value
        if (request.publicationYear < 1000 || request.publicationYear > currentYear + 1) {
            errors.add("Publication year must be between 1000 and ${currentYear + 1}.")
        }

        if (request.totalCopies < 0) {
            errors.add("Total copies cannot be negative.")
        }

        if (request.totalCopies < currentIssuedCount) {
            errors.add("Total copies ($request.totalCopies) cannot be less than currently issued copies ($currentIssuedCount).")
        }

        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }

    fun validateStudentCreate(request: StudentCreateRequest) {
        val errors = mutableListOf<String>()

        if (request.studentId.trim().isEmpty()) {
            errors.add("Student ID cannot be empty.")
        } else if (request.studentId.trim().length < 2) {
            errors.add("Student ID must be at least 2 characters long.")
        }

        if (request.name.trim().isEmpty()) {
            errors.add("Student name cannot be empty.")
        }

        request.email?.let { email ->
            val trimmedEmail = email.trim()
            if (trimmedEmail.isNotEmpty() && !trimmedEmail.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))) {
                errors.add("Invalid email address format.")
            }
        }

        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }

    fun validateStudentUpdate(request: StudentUpdateRequest) {
        val errors = mutableListOf<String>()

        if (request.name.trim().isEmpty()) {
            errors.add("Student name cannot be empty.")
        }

        request.email?.let { email ->
            val trimmedEmail = email.trim()
            if (trimmedEmail.isNotEmpty() && !trimmedEmail.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))) {
                errors.add("Invalid email address format.")
            }
        }

        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }

    fun validateIssueRequest(bookId: String, studentId: String) {
        val errors = mutableListOf<String>()
        if (bookId.trim().isEmpty()) {
            errors.add("Book ID cannot be empty.")
        }
        if (studentId.trim().isEmpty()) {
            errors.add("Student ID cannot be empty.")
        }
        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }

    fun validateReturnRequest(bookId: String, studentId: String) {
        val errors = mutableListOf<String>()
        if (bookId.trim().isEmpty()) {
            errors.add("Book ID cannot be empty.")
        }
        if (studentId.trim().isEmpty()) {
            errors.add("Student ID cannot be empty.")
        }
        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }
}
