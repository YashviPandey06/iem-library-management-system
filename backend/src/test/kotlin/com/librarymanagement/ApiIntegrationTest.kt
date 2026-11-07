package com.librarymanagement

import com.librarymanagement.config.DatabaseConfig
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ApiIntegrationTest {

    @BeforeEach
    fun setup() {
        val testDbFile = File.createTempFile("test_api_", ".db")
        testDbFile.deleteOnExit()
        System.setProperty("database.path", testDbFile.absolutePath)
        DatabaseConfig.init(testDbFile.absolutePath)
    }

    @Test
    fun `test complete API circulation flow and authentication`() = testApplication {
        application {
            module()
        }

        // 1. Health endpoint
        val healthRes = client.get("/api/health")
        assertEquals(HttpStatusCode.OK, healthRes.status)
        assertTrue(healthRes.bodyAsText().contains("HEALTHY"))

        // 2. Unauthenticated attempt to add book should fail (401)
        val unauthRes = client.post("/api/books") {
            contentType(ContentType.Application.Json)
            setBody("""{"bookId":"FAIL-1","title":"X","author":"Y","publicationYear":2020,"totalCopies":1}""")
        }
        assertEquals(HttpStatusCode.Unauthorized, unauthRes.status)

        // 3. Login as Librarian
        val loginRes = client.post("/api/auth/login") {
            contentType(ContentType.Application.Json)
            setBody("""{"identifier": "librarian@iemcal.ac.in", "password": "admin123"}""")
        }
        assertEquals(HttpStatusCode.OK, loginRes.status)
        val loginJson = Json.parseToJsonElement(loginRes.bodyAsText()).jsonObject
        val token = loginJson["data"]!!.jsonObject["token"]!!.jsonPrimitive.content
        assertTrue(token.isNotEmpty())

        val authHeader = "Bearer $token"

        // 4. Add Book (Task 1) as Librarian
        val createBookRes = client.post("/api/books") {
            header(HttpHeaders.Authorization, authHeader)
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "bookId": "API-101",
                  "title": "Domain-Driven Design",
                  "author": "Eric Evans",
                  "publicationYear": 2003,
                  "totalCopies": 3
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, createBookRes.status)
        assertTrue(createBookRes.bodyAsText().contains("API-101"))

        // 5. Register Student as Librarian
        val createStudentRes = client.post("/api/students") {
            header(HttpHeaders.Authorization, authHeader)
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "studentId": "ST-001",
                  "name": "Grace Hopper",
                  "email": "grace@navy.mil"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, createStudentRes.status)

        // 6. Public Search Book (Task 3)
        val searchRes = client.get("/api/books/search?q=domain")
        assertEquals(HttpStatusCode.OK, searchRes.status)
        val searchBody = searchRes.bodyAsText()
        assertTrue(searchBody.contains("API-101"))
        assertTrue(searchBody.contains("Domain-Driven Design"))

        // 7. Issue Book (Task 4)
        val issueRes = client.post("/api/issues") {
            header(HttpHeaders.Authorization, authHeader)
            contentType(ContentType.Application.Json)
            setBody("""{"bookId": "API-101", "studentId": "ST-001"}""")
        }
        assertEquals(HttpStatusCode.Created, issueRes.status)
        val issueBody = issueRes.bodyAsText()
        assertTrue(issueBody.contains("API-101"))
        assertTrue(issueBody.contains("ST-001"))

        // 8. Active Issues (Task 6)
        val activeRes = client.get("/api/issues/active") {
            header(HttpHeaders.Authorization, authHeader)
        }
        assertEquals(HttpStatusCode.OK, activeRes.status)
        val activeBody = activeRes.bodyAsText()
        assertTrue(activeBody.contains("API-101"))
        assertTrue(activeBody.contains("ISSUED"))

        // 9. Return Book (Task 5)
        val returnRes = client.post("/api/returns") {
            header(HttpHeaders.Authorization, authHeader)
            contentType(ContentType.Application.Json)
            setBody("""{"bookId": "API-101", "studentId": "ST-001"}""")
        }
        assertEquals(HttpStatusCode.OK, returnRes.status)
        val returnBody = returnRes.bodyAsText()
        assertTrue(returnBody.contains("RETURNED"))
    }
}
