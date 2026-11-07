package com.librarymanagement.console

import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration
import java.util.Scanner

data class BookDto(
    val bookId: String,
    val title: String,
    val author: String,
    val publicationYear: Int,
    val totalCopies: Int,
    val availableCopies: Int
)

data class IssueDto(
    val transactionId: String,
    val bookId: String,
    val bookTitle: String,
    val studentId: String,
    val studentName: String?,
    val issueDate: String,
    val status: String
)

class LibraryConsoleClient(private val baseUrl: String = "http://localhost:8080/api") {
    private val client: HttpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build()

    private fun extractJsonString(json: String, key: String): String? {
        val pattern = "\"$key\"\\s*:\\s*\"([^\"]*)\"".toRegex()
        return pattern.find(json)?.groupValues?.get(1)
    }

    private fun extractJsonInt(json: String, key: String): Int? {
        val pattern = "\"$key\"\\s*:\\s*(-?\\d+)".toRegex()
        return pattern.find(json)?.groupValues?.get(1)?.toIntOrNull()
    }

    private fun extractObjects(json: String): List<String> {
        val results = mutableListOf<String>()
        var depth = 0
        var startIdx = -1
        var inString = false
        var escape = false

        for (i in json.indices) {
            val c = json[i]
            if (escape) {
                escape = false
                continue
            }
            if (c == '\\') {
                escape = true
                continue
            }
            if (c == '"') {
                inString = !inString
                continue
            }
            if (!inString) {
                if (c == '{') {
                    if (depth == 0) startIdx = i
                    depth++
                } else if (c == '}') {
                    depth--
                    if (depth == 0 && startIdx != -1) {
                        results.add(json.substring(startIdx, i + 1))
                        startIdx = -1
                    }
                }
            }
        }
        return results
    }

    fun getAllBooks(): List<BookDto> {
        val req = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/books"))
            .GET()
            .build()
        val res = client.send(req, HttpResponse.BodyHandlers.ofString())
        if (res.statusCode() != 200) {
            throw RuntimeException("Server error (${res.statusCode()}): ${res.body()}")
        }
        return parseBooks(res.body())
    }

    fun searchBooks(query: String): List<BookDto> {
        val encoded = java.net.URLEncoder.encode(query, "UTF-8")
        val req = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/books/search?q=$encoded"))
            .GET()
            .build()
        val res = client.send(req, HttpResponse.BodyHandlers.ofString())
        if (res.statusCode() != 200) {
            throw RuntimeException("Server error (${res.statusCode()}): ${res.body()}")
        }
        return parseBooks(res.body())
    }

    fun addBook(bookId: String, title: String, author: String, year: Int, copies: Int): String {
        val escapedTitle = title.replace("\"", "\\\"")
        val escapedAuthor = author.replace("\"", "\\\"")
        val payload = """
            {
              "bookId": "$bookId",
              "title": "$escapedTitle",
              "author": "$escapedAuthor",
              "publicationYear": $year,
              "totalCopies": $copies
            }
        """.trimIndent()

        val req = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/books"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build()

        val res = client.send(req, HttpResponse.BodyHandlers.ofString())
        if (res.statusCode() in 200..299) {
            return extractJsonString(res.body(), "message") ?: "Book registered successfully."
        } else {
            val msg = extractJsonString(res.body(), "message") ?: res.body()
            throw RuntimeException(msg)
        }
    }

    fun issueBook(bookId: String, studentId: String): String {
        val payload = """{"bookId": "$bookId", "studentId": "$studentId"}"""
        val req = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/issues"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build()

        val res = client.send(req, HttpResponse.BodyHandlers.ofString())
        if (res.statusCode() in 200..299) {
            return extractJsonString(res.body(), "message") ?: "Book issued successfully."
        } else {
            val msg = extractJsonString(res.body(), "message") ?: res.body()
            throw RuntimeException(msg)
        }
    }

    fun returnBook(bookId: String, studentId: String): String {
        val payload = """{"bookId": "$bookId", "studentId": "$studentId"}"""
        val req = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/returns"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build()

        val res = client.send(req, HttpResponse.BodyHandlers.ofString())
        if (res.statusCode() in 200..299) {
            return extractJsonString(res.body(), "message") ?: "Book returned successfully."
        } else {
            val msg = extractJsonString(res.body(), "message") ?: res.body()
            throw RuntimeException(msg)
        }
    }

    fun getActiveIssues(): List<IssueDto> {
        val req = HttpRequest.newBuilder()
            .uri(URI.create("$baseUrl/issues/active"))
            .GET()
            .build()
        val res = client.send(req, HttpResponse.BodyHandlers.ofString())
        if (res.statusCode() != 200) {
            throw RuntimeException("Server error (${res.statusCode()}): ${res.body()}")
        }
        return parseIssues(res.body())
    }

    private fun parseBooks(body: String): List<BookDto> {
        val books = mutableListOf<BookDto>()
        val objects = extractObjects(body)
        for (obj in objects) {
            val id = extractJsonString(obj, "bookId")
            val title = extractJsonString(obj, "title")
            val author = extractJsonString(obj, "author")
            val year = extractJsonInt(obj, "publicationYear")
            val total = extractJsonInt(obj, "totalCopies")
            val avail = extractJsonInt(obj, "availableCopies")

            if (id != null && title != null && author != null && year != null && total != null && avail != null) {
                books.add(BookDto(id, title, author, year, total, avail))
            }
        }
        return books
    }

    private fun parseIssues(body: String): List<IssueDto> {
        val issues = mutableListOf<IssueDto>()
        val objects = extractObjects(body)
        for (obj in objects) {
            val txId = extractJsonString(obj, "transactionId")
            val bookId = extractJsonString(obj, "bookId")
            val title = extractJsonString(obj, "bookTitle")
            val studentId = extractJsonString(obj, "studentId")
            val studentName = extractJsonString(obj, "studentName")
            val date = extractJsonString(obj, "issueDate")
            val status = extractJsonString(obj, "status") ?: "ISSUED"

            if (txId != null && bookId != null && title != null && studentId != null && date != null) {
                issues.add(IssueDto(txId, bookId, title, studentId, studentName, date, status))
            }
        }
        return issues
    }
}

fun printBooksTable(books: List<BookDto>) {
    if (books.isEmpty()) {
        println("\n+-------------------------------------------------------------+")
        println("|                    No books found in catalog                |")
        println("+-------------------------------------------------------------+")
        return
    }

    val idW = maxOf(8, books.maxOf { it.bookId.length })
    val titleW = maxOf(12, books.maxOf { it.title.length }.coerceAtMost(36))
    val authorW = maxOf(10, books.maxOf { it.author.length }.coerceAtMost(24))
    val yearW = 6
    val availW = 11
    val statusW = 14

    val format = "| %-${idW}s | %-${titleW}s | %-${authorW}s | %-${yearW}s | %-${availW}s | %-${statusW}s |"
    val separator = "+" + "-".repeat(idW + 2) + "+" + "-".repeat(titleW + 2) + "+" + "-".repeat(authorW + 2) + "+" + "-".repeat(yearW + 2) + "+" + "-".repeat(availW + 2) + "+" + "-".repeat(statusW + 2) + "+"

    println("\n$separator")
    println(String.format(format, "Book ID", "Book Title", "Author", "Year", "Available", "Status"))
    println(separator)

    for (b in books) {
        val shortTitle = if (b.title.length > titleW) b.title.substring(0, titleW - 3) + "..." else b.title
        val shortAuthor = if (b.author.length > authorW) b.author.substring(0, authorW - 3) + "..." else b.author
        val status = if (b.availableCopies > 0) "AVAILABLE" else "OUT OF STOCK"
        println(String.format(format, b.bookId, shortTitle, shortAuthor, b.publicationYear.toString(), "${b.availableCopies}/${b.totalCopies}", status))
    }
    println(separator)
    println("Total titles: ${books.size} | Total copies available: ${books.sumOf { it.availableCopies }}\n")
}

fun printIssuesTable(issues: List<IssueDto>) {
    if (issues.isEmpty()) {
        println("\n+-------------------------------------------------------------+")
        println("|              No books are currently issued                  |")
        println("+-------------------------------------------------------------+")
        return
    }

    val format = "| %-10s | %-12s | %-28s | %-12s | %-12s | %-10s |"
    val sep = "+------------+--------------+------------------------------+--------------+--------------+------------+"

    println("\n$sep")
    println(String.format(format, "Tx ID", "Book ID", "Book Title", "Student ID", "Issue Date", "Status"))
    println(sep)

    for (i in issues) {
        val shortTitle = if (i.bookTitle.length > 28) i.bookTitle.substring(0, 25) + "..." else i.bookTitle
        println(String.format(format, i.transactionId, i.bookId, shortTitle, i.studentId, i.issueDate, i.status))
    }
    println(sep)
    println("Total active outstanding loans: ${issues.size}\n")
}

fun main() {
    val scanner = Scanner(System.`in`)
    val client = LibraryConsoleClient()

    println("=================================================================")
    println("   IEM LIBRARY MANAGEMENT SYSTEM — KOTLIN CONSOLE")
    println("=================================================================")
    println("Connecting to shared backend: http://localhost:8080/api\n")

    var running = true

    while (running) {
        println("-----------------------------------------------------------------")
        println("                      MAIN MENU (TASK 7)")
        println("-----------------------------------------------------------------")
        println("  1. Add a new book")
        println("  2. Display all books")
        println("  3. Search for a book")
        println("  4. Issue a book")
        println("  5. Return a book")
        println("  6. Display currently issued books")
        println("  7. Exit")
        println("-----------------------------------------------------------------")
        print("Please enter your choice (1-7): ")

        val choice = scanner.nextLine().trim()

        // Kotlin `when` expression requirement
        when (choice) {
            "1" -> {
                println("\n>>> [TASK 1] ADD A NEW BOOK <<<")
                print("Enter Book ID: ")
                val id = scanner.nextLine().trim()

                print("Enter Book Title: ")
                val title = scanner.nextLine().trim()

                print("Enter Author Name: ")
                val author = scanner.nextLine().trim()

                print("Enter Publication Year: ")
                val yearInput = scanner.nextLine().trim()

                print("Enter Number of Available Copies: ")
                val copiesInput = scanner.nextLine().trim()

                try {
                    val year = yearInput.toInt()
                    val copies = copiesInput.toInt()
                    val message = client.addBook(id, title, author, year, copies)
                    println("\n[SUCCESS] $message")
                } catch (e: NumberFormatException) {
                    println("\n[VALIDATION ERROR] Publication year and copies must be valid whole numbers.")
                } catch (e: Exception) {
                    println("\n[ERROR] ${e.message}")
                }
            }

            "2" -> {
                println("\n>>> [TASK 2] ALL REGISTERED BOOKS <<<")
                try {
                    val books = client.getAllBooks()
                    printBooksTable(books)
                } catch (e: Exception) {
                    println("\n[ERROR] Failed to fetch books: ${e.message}")
                    println("Ensure backend is running on http://localhost:8080.")
                }
            }

            "3" -> {
                println("\n>>> [TASK 3] SEARCH FOR A BOOK <<<")
                print("Enter Book ID or Book Title (partial search supported): ")
                val query = scanner.nextLine().trim()
                if (query.isEmpty()) {
                    println("[NOTICE] Search query cannot be empty.")
                } else {
                    try {
                        val results = client.searchBooks(query)
                        println("\nSearch results for \"$query\":")
                        printBooksTable(results)
                    } catch (e: Exception) {
                        println("\n[ERROR] Search failed: ${e.message}")
                    }
                }
            }

            "4" -> {
                println("\n>>> [TASK 4] ISSUE A BOOK <<<")
                print("Enter Book ID to issue: ")
                val bookId = scanner.nextLine().trim()

                print("Enter Student ID: ")
                val studentId = scanner.nextLine().trim()

                try {
                    val result = client.issueBook(bookId, studentId)
                    println("\n[SUCCESS] $result")
                } catch (e: Exception) {
                    println("\n[ERROR] Issue failed: ${e.message}")
                }
            }

            "5" -> {
                println("\n>>> [TASK 5] RETURN A BOOK <<<")
                print("Enter Book ID to return: ")
                val bookId = scanner.nextLine().trim()

                print("Enter Student ID returning the book: ")
                val studentId = scanner.nextLine().trim()

                try {
                    val result = client.returnBook(bookId, studentId)
                    println("\n[SUCCESS] $result")
                } catch (e: Exception) {
                    println("\n[ERROR] Return failed: ${e.message}")
                }
            }

            "6" -> {
                println("\n>>> [TASK 6] DISPLAY CURRENTLY ISSUED BOOKS <<<")
                try {
                    val issues = client.getActiveIssues()
                    printIssuesTable(issues)
                } catch (e: Exception) {
                    println("\n[ERROR] Failed to fetch active issues: ${e.message}")
                }
            }

            "7" -> {
                println("\nExiting Library Management System. Thank you for using IEM Library Management System!")
                running = false
            }

            else -> {
                println("\n[ERROR] Invalid choice '$choice'. Please select an option between 1 and 7.")
            }
        }

        if (running) {
            println("\nPress [Enter] to return to the main menu...")
            scanner.nextLine()
        }
    }
}
