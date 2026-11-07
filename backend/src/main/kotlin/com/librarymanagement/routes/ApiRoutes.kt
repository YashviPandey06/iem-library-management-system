package com.librarymanagement.routes

import com.librarymanagement.dto.*
import com.librarymanagement.exceptions.AuthenticationException
import com.librarymanagement.exceptions.AuthorizationException
import com.librarymanagement.models.UserDto
import com.librarymanagement.models.UserRole
import com.librarymanagement.services.LibraryService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.Instant

private suspend fun extractUser(call: ApplicationCall, libraryService: LibraryService): UserDto? {
    val authHeader = call.request.header(HttpHeaders.Authorization) ?: return null
    return libraryService.validateToken(authHeader)
}

private suspend fun requireUser(call: ApplicationCall, libraryService: LibraryService): UserDto {
    return extractUser(call, libraryService)
        ?: throw AuthenticationException("Session expired or missing authorization token. Please log in.")
}

private suspend fun requireLibrarian(call: ApplicationCall, libraryService: LibraryService): UserDto {
    val user = requireUser(call, libraryService)
    if (user.role != UserRole.LIBRARIAN) {
        throw AuthorizationException("Access denied: Administrative librarian privileges required.")
    }
    return user
}

fun Route.libraryRoutes(libraryService: LibraryService) {

    route("/api") {

        // Health check
        get("/health") {
            call.respond(
                HttpStatusCode.OK,
                HealthResponse(
                    status = "HEALTHY",
                    service = "Library Management System - Institute of Engineering & Management, Kolkata",
                    timestamp = Instant.now().toString()
                )
            )
        }

        // --- Authentication API ---
        route("/auth") {
            post("/login") {
                val req = call.receive<LoginRequest>()
                val res = libraryService.login(req)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(
                        success = true,
                        data = res,
                        message = "Welcome back, ${res.user.name}."
                    )
                )
            }

            post("/register") {
                val req = call.receive<RegisterRequest>()
                val res = libraryService.register(req)
                call.respond(
                    HttpStatusCode.Created,
                    ApiResponse(
                        success = true,
                        data = res,
                        message = "Registration successful. Welcome to Library Management System."
                    )
                )
            }

            get("/me") {
                val user = requireUser(call, libraryService)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(success = true, data = user)
                )
            }

            post("/logout") {
                val authHeader = call.request.header(HttpHeaders.Authorization)
                if (authHeader != null) {
                    libraryService.logout(authHeader)
                }
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(success = true, data = MessageResponse("Logged out successfully."))
                )
            }
        }

        // --- Student Portal API (Authenticated Student) ---
        route("/student") {
            get("/dashboard") {
                val user = requireUser(call, libraryService)
                val summary = libraryService.getStudentDashboard(user.userId)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(success = true, data = summary)
                )
            }

            get("/borrowings") {
                val user = requireUser(call, libraryService)
                val loans = libraryService.getStudentBorrowings(user.userId)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(success = true, data = loans)
                )
            }

            get("/history") {
                val user = requireUser(call, libraryService)
                val history = libraryService.getStudentHistory(user.userId)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(success = true, data = history)
                )
            }
        }

        // --- Books API (Tasks 1, 2, 3) ---
        route("/books") {
            // Public catalog display & search
            get {
                val books = libraryService.getAllBooks()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = books))
            }

            get("/search") {
                val query = call.request.queryParameters["q"] ?: ""
                val books = libraryService.searchBooks(query)
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = books))
            }

            get("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Missing book ID.")
                val book = libraryService.getBook(id)
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = book))
            }

            // Task 1: Add new book (Privileged)
            post {
                requireLibrarian(call, libraryService)
                val req = call.receive<BookCreateRequest>()
                val book = libraryService.addBook(req)
                call.respond(
                    HttpStatusCode.Created,
                    ApiResponse(
                        success = true,
                        data = book,
                        message = "Book '${book.title}' (${book.bookId}) registered successfully."
                    )
                )
            }

            put("/{id}") {
                requireLibrarian(call, libraryService)
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Missing book ID.")
                val req = call.receive<BookUpdateRequest>()
                val updated = libraryService.updateBook(id, req)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(
                        success = true,
                        data = updated,
                        message = "Book '${updated.bookId}' updated successfully."
                    )
                )
            }

            delete("/{id}") {
                requireLibrarian(call, libraryService)
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Missing book ID.")
                libraryService.deleteBook(id)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(
                        success = true,
                        data = MessageResponse("Book '$id' deleted successfully.")
                    )
                )
            }
        }

        // --- Students API (Privileged) ---
        route("/students") {
            get {
                requireLibrarian(call, libraryService)
                val students = libraryService.getAllStudents()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = students))
            }

            get("/search") {
                requireLibrarian(call, libraryService)
                val query = call.request.queryParameters["q"] ?: ""
                val students = libraryService.searchStudents(query)
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = students))
            }

            get("/{id}") {
                requireLibrarian(call, libraryService)
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Missing student ID.")
                val student = libraryService.getStudent(id)
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = student))
            }

            post {
                requireLibrarian(call, libraryService)
                val req = call.receive<StudentCreateRequest>()
                val student = libraryService.addStudent(req)
                call.respond(
                    HttpStatusCode.Created,
                    ApiResponse(
                        success = true,
                        data = student,
                        message = "Student '${student.name}' (${student.studentId}) registered successfully."
                    )
                )
            }

            put("/{id}") {
                requireLibrarian(call, libraryService)
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Missing student ID.")
                val req = call.receive<StudentUpdateRequest>()
                val updated = libraryService.updateStudent(id, req)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(
                        success = true,
                        data = updated,
                        message = "Student '${updated.studentId}' updated successfully."
                    )
                )
            }
        }

        // --- Issues & Returns API (Tasks 4, 5, 6 - Privileged) ---
        route("/issues") {
            post {
                requireLibrarian(call, libraryService)
                val req = call.receive<IssueBookRequest>()
                val tx = libraryService.issueBook(req.bookId, req.studentId)
                call.respond(
                    HttpStatusCode.Created,
                    ApiResponse(
                        success = true,
                        data = tx,
                        message = "Book '${tx.bookTitle}' issued to student '${tx.studentId}'."
                    )
                )
            }

            get("/active") {
                requireLibrarian(call, libraryService)
                val active = libraryService.getActiveIssues()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = active))
            }

            get {
                requireLibrarian(call, libraryService)
                val active = libraryService.getActiveIssues()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = active))
            }
        }

        route("/returns") {
            post {
                requireLibrarian(call, libraryService)
                val req = call.receive<ReturnBookRequest>()
                val tx = libraryService.returnBook(req.bookId, req.studentId)
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(
                        success = true,
                        data = tx,
                        message = "Book '${tx.bookTitle}' successfully returned by student '${tx.studentId}'."
                    )
                )
            }
        }

        // --- Transaction History ---
        route("/transactions") {
            get {
                requireLibrarian(call, libraryService)
                val all = libraryService.getAllTransactions()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = all))
            }
        }

        // --- Dashboard Analytics ---
        route("/dashboard") {
            get("/stats") {
                // Public / landing statistics
                val stats = libraryService.getDashboardStats()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = stats))
            }

            get("/popular-books") {
                val popular = libraryService.getPopularBooks()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = popular))
            }

            get("/activity") {
                requireLibrarian(call, libraryService)
                val activity = libraryService.getActivity()
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, data = activity))
            }
        }

        // --- Seed & Reset Admin Endpoints ---
        post("/seed") {
            val msg = libraryService.seedData()
            call.respond(
                HttpStatusCode.OK,
                ApiResponse(
                    success = true,
                    data = MessageResponse(msg),
                    message = msg
                )
            )
        }

        post("/reset") {
            requireLibrarian(call, libraryService)
            val msg = libraryService.resetData()
            call.respond(
                HttpStatusCode.OK,
                ApiResponse(
                    success = true,
                    data = MessageResponse(msg),
                    message = msg
                )
            )
        }
    }
}
