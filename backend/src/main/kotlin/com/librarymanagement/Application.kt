package com.librarymanagement

import com.librarymanagement.config.DatabaseConfig
import com.librarymanagement.dto.ApiResponse
import com.librarymanagement.exceptions.*
import com.librarymanagement.routes.libraryRoutes
import com.librarymanagement.services.LibraryService
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.slf4j.LoggerFactory

fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    val host = System.getenv("HOST") ?: "0.0.0.0"

    val logger = LoggerFactory.getLogger("Application")
    logger.info("Starting Library Management Server (Institute of Engineering & Management, Kolkata) on $host:$port...")

    embeddedServer(Netty, port = port, host = host, module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    val logger = LoggerFactory.getLogger("LibraryApplication")

    // Initialize SQLite Database
    val dbPath = System.getProperty("database.path") ?: environment.config.propertyOrNull("database.path")?.getString() ?: "library.db"
    DatabaseConfig.init(dbPath)

    val libraryService = LibraryService()

    // Ensure initial demo catalogue and demonstration accounts exist
    runBlocking {
        logger.info("Verifying initial library catalogue and demo accounts...")
        libraryService.seedData()
    }

    // JSON serialization
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
            encodeDefaults = true
        })
    }

    // CORS configuration for React frontend & mobile
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        anyHost()
    }

    // Centralized exception handling
    install(StatusPages) {
        exception<AuthenticationException> { call, cause ->
            call.respond(
                HttpStatusCode.Unauthorized,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Authentication required.",
                    errors = listOf(cause.message ?: "Invalid or missing credentials.")
                )
            )
        }

        exception<AuthorizationException> { call, cause ->
            call.respond(
                HttpStatusCode.Forbidden,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Access forbidden.",
                    errors = listOf(cause.message ?: "Insufficient privileges for this operation.")
                )
            )
        }

        exception<ValidationException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message,
                    errors = cause.errors
                )
            )
        }

        exception<DuplicateIdException> { call, cause ->
            call.respond(
                HttpStatusCode.Conflict,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Duplicate ID error",
                    errors = listOf(cause.message ?: "Resource with this ID already exists.")
                )
            )
        }

        exception<NotFoundException> { call, cause ->
            call.respond(
                HttpStatusCode.NotFound,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Resource not found",
                    errors = listOf(cause.message ?: "Target entity does not exist.")
                )
            )
        }

        exception<InventoryException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Inventory error",
                    errors = listOf(cause.message ?: "Inventory constraint violated.")
                )
            )
        }

        exception<InvalidOperationException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Invalid operation",
                    errors = listOf(cause.message ?: "Operation violates system integrity.")
                )
            )
        }

        exception<IllegalArgumentException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiResponse<Unit>(
                    success = false,
                    message = cause.message ?: "Invalid request argument",
                    errors = listOf(cause.message ?: "Bad request.")
                )
            )
        }

        exception<Throwable> { call, cause ->
            logger.error("Unhandled server exception", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                ApiResponse<Unit>(
                    success = false,
                    message = "Internal server error: ${cause.localizedMessage}",
                    errors = listOf("Unexpected runtime failure. Please consult server diagnostics.")
                )
            )
        }
    }

    // Register REST API Routes
    routing {
        libraryRoutes(libraryService)

        // OpenAPI 3.0 Documentation Endpoint
        get("/openapi.json") {
            val stream = Application::class.java.classLoader.getResourceAsStream("openapi.json")
            if (stream != null) {
                val json = stream.bufferedReader().use { it.readText() }
                call.respondText(json, ContentType.Application.Json)
            } else {
                call.respond(HttpStatusCode.NotFound, ApiResponse<Unit>(success = false, message = "OpenAPI spec not found."))
            }
        }
    }
}
