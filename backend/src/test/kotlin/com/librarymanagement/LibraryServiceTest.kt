package com.librarymanagement

import com.librarymanagement.config.DatabaseConfig
import com.librarymanagement.dto.BookCreateRequest
import com.librarymanagement.dto.BookUpdateRequest
import com.librarymanagement.dto.StudentCreateRequest
import com.librarymanagement.exceptions.DuplicateIdException
import com.librarymanagement.exceptions.InventoryException
import com.librarymanagement.exceptions.InvalidOperationException
import com.librarymanagement.exceptions.NotFoundException
import com.librarymanagement.exceptions.ValidationException
import com.librarymanagement.models.TransactionStatus
import com.librarymanagement.services.LibraryService
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class LibraryServiceTest {

    private lateinit var service: LibraryService

    @BeforeEach
    fun setUp() = runBlocking {
        // Use an isolated temporary SQLite database for clean test execution
        val testDbFile = File.createTempFile("test_library_", ".db")
        testDbFile.deleteOnExit()
        DatabaseConfig.init(testDbFile.absolutePath)
        service = LibraryService()
    }

    // --- Task 1 Tests: Add Books & Validations ---

    @Test
    fun `test add book successfully`() = runBlocking {
        val req = BookCreateRequest(
            bookId = "B101",
            title = "The Mythical Man-Month",
            author = "Fred Brooks",
            publicationYear = 1975,
            totalCopies = 5
        )
        val created = service.addBook(req)
        assertEquals("B101", created.bookId)
        assertEquals("The Mythical Man-Month", created.title)
        assertEquals(5, created.totalCopies)
        assertEquals(5, created.availableCopies)
    }

    @Test
    fun `test add book with duplicate ID fails`() = runBlocking {
        val req1 = BookCreateRequest("B101", "Book One", "Author A", 2020, 3)
        service.addBook(req1)

        val req2 = BookCreateRequest("b101", "Book Duplicate", "Author B", 2021, 2)
        assertThrows<DuplicateIdException> {
            runBlocking { service.addBook(req2) }
        }
    }

    @Test
    fun `test add book with empty title or author fails validation`() {
        assertThrows<ValidationException> {
            runBlocking {
                service.addBook(BookCreateRequest("B102", "", "Author", 2020, 2))
            }
        }
        assertThrows<ValidationException> {
            runBlocking {
                service.addBook(BookCreateRequest("B102", "Title", "", 2020, 2))
            }
        }
    }

    @Test
    fun `test add book with invalid publication year fails`() {
        assertThrows<ValidationException> {
            runBlocking {
                service.addBook(BookCreateRequest("B103", "Old Title", "Author", 500, 2))
            }
        }
        assertThrows<ValidationException> {
            runBlocking {
                service.addBook(BookCreateRequest("B103", "Future Title", "Author", 3050, 2))
            }
        }
    }

    @Test
    fun `test add book with negative copies fails`() {
        assertThrows<ValidationException> {
            runBlocking {
                service.addBook(BookCreateRequest("B104", "Title", "Author", 2020, -1))
            }
        }
    }

    // --- Task 2 & 3 Tests: Display All & Search ---

    @Test
    fun `test get all books and search`() = runBlocking {
        service.addBook(BookCreateRequest("B201", "Kotlin in Action", "Dmitry Jemerov", 2017, 4))
        service.addBook(BookCreateRequest("B202", "Effective Java", "Joshua Bloch", 2018, 3))

        val all = service.getAllBooks()
        assertEquals(2, all.size)

        // Case-insensitive & partial title search
        val kotlinSearch = service.searchBooks("KOTLIN")
        assertEquals(1, kotlinSearch.size)
        assertEquals("B201", kotlinSearch[0].bookId)

        // Partial ID search
        val idSearch = service.searchBooks("202")
        assertEquals(1, idSearch.size)
        assertEquals("B202", idSearch[0].bookId)
    }

    // --- Task 4 Tests: Issue Books ---

    @Test
    fun `test issue book decreases inventory by exactly one and creates record`() = runBlocking {
        service.addBook(BookCreateRequest("B301", "Clean Code", "Robert C. Martin", 2008, 2))
        service.addStudent(StudentCreateRequest("S301", "John Doe", "john@test.com"))

        val tx = service.issueBook("B301", "S301")
        assertEquals("B301", tx.bookId)
        assertEquals("S301", tx.studentId)
        assertEquals(TransactionStatus.ISSUED, tx.status)
        assertNotNull(tx.transactionId)

        val updatedBook = service.getBook("B301")
        assertEquals(1, updatedBook.availableCopies)
        assertEquals(2, updatedBook.totalCopies)
    }

    @Test
    fun `test issuing nonexistent book throws NotFoundException`() {
        runBlocking {
            service.addStudent(StudentCreateRequest("S302", "Jane", "jane@test.com"))
        }
        assertThrows<NotFoundException> {
            runBlocking { service.issueBook("NONEXISTENT", "S302") }
        }
    }

    @Test
    fun `test issuing book with zero available copies throws InventoryException`() = runBlocking {
        service.addBook(BookCreateRequest("B302", "Rare Book", "Author", 2010, 1))
        service.addStudent(StudentCreateRequest("S303", "Student 1", "s1@test.com"))
        service.addStudent(StudentCreateRequest("S304", "Student 2", "s2@test.com"))

        // First issue succeeds
        service.issueBook("B302", "S303")

        // Second issue must fail with InventoryException
        assertThrows<InventoryException> {
            runBlocking { service.issueBook("B302", "S304") }
        }
    }

    // --- Task 5 Tests: Return Books ---

    @Test
    fun `test return book restores inventory by exactly one`() = runBlocking {
        service.addBook(BookCreateRequest("B401", "Refactoring", "Martin Fowler", 2018, 3))
        service.addStudent(StudentCreateRequest("S401", "Alice", "alice@test.com"))

        service.issueBook("B401", "S401")
        val bookAfterIssue = service.getBook("B401")
        assertEquals(2, bookAfterIssue.availableCopies)

        val returnTx = service.returnBook("B401", "S401")
        assertEquals(TransactionStatus.RETURNED, returnTx.status)
        assertNotNull(returnTx.returnDate)

        val bookAfterReturn = service.getBook("B401")
        assertEquals(3, bookAfterReturn.availableCopies)
    }

    @Test
    fun `test returning book without matching issue record throws NotFoundException`() = runBlocking {
        service.addBook(BookCreateRequest("B402", "Book Without Loan", "Author", 2021, 2))
        service.addStudent(StudentCreateRequest("S402", "Student", "st@test.com"))

        assertThrows<NotFoundException> {
            runBlocking { service.returnBook("B402", "S402") }
        }
    }

    @Test
    fun `test duplicate return of already returned book throws NotFoundException`() = runBlocking {
        service.addBook(BookCreateRequest("B403", "Single Loan", "Author", 2020, 1))
        service.addStudent(StudentCreateRequest("S403", "Borrower", "b@test.com"))

        service.issueBook("B403", "S403")
        service.returnBook("B403", "S403")

        // Attempting to return again must fail
        assertThrows<NotFoundException> {
            runBlocking { service.returnBook("B403", "S403") }
        }
    }

    // --- Task 6 Tests: Active Issued Books ---

    @Test
    fun `test active issues only contains outstanding loans`() = runBlocking {
        service.addBook(BookCreateRequest("B501", "Book 1", "Author 1", 2020, 2))
        service.addBook(BookCreateRequest("B502", "Book 2", "Author 2", 2021, 2))
        service.addStudent(StudentCreateRequest("S501", "Student 1", "s1@test.com"))
        service.addStudent(StudentCreateRequest("S502", "Student 2", "s2@test.com"))

        service.issueBook("B501", "S501")
        service.issueBook("B502", "S502")

        var active = service.getActiveIssues()
        assertEquals(2, active.size)

        // Return one book
        service.returnBook("B501", "S501")

        active = service.getActiveIssues()
        assertEquals(1, active.size)
        assertEquals("B502", active[0].bookId)
    }

    // --- Integrity Safeguard Tests ---

    @Test
    fun `test cannot delete book with active outstanding issues`() = runBlocking {
        service.addBook(BookCreateRequest("B601", "Protected Book", "Author", 2020, 2))
        service.addStudent(StudentCreateRequest("S601", "Borrower", "b@test.com"))

        service.issueBook("B601", "S601")

        assertThrows<InvalidOperationException> {
            runBlocking { service.deleteBook("B601") }
        }
    }
}
