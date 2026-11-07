package com.librarymanagement.services

import com.librarymanagement.dto.*
import com.librarymanagement.exceptions.*
import com.librarymanagement.models.*
import com.librarymanagement.repositories.*
import com.librarymanagement.validation.Validator
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.mindrot.jbcrypt.BCrypt
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

class LibraryService(
    private val bookRepo: BookRepository = BookRepository(),
    private val studentRepo: StudentRepository = StudentRepository(),
    private val transactionRepo: TransactionRepository = TransactionRepository(),
    private val userRepo: UserRepository = UserRepository(),
    private val sessionRepo: SessionRepository = SessionRepository()
) {

    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    private val dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
    private val inventoryMutex = Mutex()

    private fun UserRecord.toDto(): UserDto = UserDto(
        id = this.id,
        userId = this.userId,
        name = this.name,
        email = this.email,
        role = this.role,
        createdAt = this.createdAt
    )

    // --- Authentication & Session Management ---
    suspend fun login(request: LoginRequest): AuthResponse {
        val cleanIdentifier = request.identifier.trim()
        val cleanPassword = request.password.trim()

        if (cleanIdentifier.isEmpty() || cleanPassword.isEmpty()) {
            throw ValidationException("Email/User ID and password are required.")
        }

        val user = userRepo.findByEmailOrUserId(cleanIdentifier)
            ?: throw AuthenticationException("Invalid credentials. Please verify your email or user ID.")

        val passwordValid = try {
            BCrypt.checkpw(cleanPassword, user.passwordHash)
        } catch (e: Exception) {
            false
        }

        if (!passwordValid) {
            throw AuthenticationException("Invalid credentials. Please check your password.")
        }

        val session = sessionRepo.createSession(
            userId = user.userId,
            role = user.role,
            rememberMe = request.rememberMe
        )

        return AuthResponse(
            token = session.token,
            user = user.toDto()
        )
    }

    suspend fun register(request: RegisterRequest): AuthResponse {
        val name = request.name.trim()
        val email = request.email.trim().lowercase()
        val password = request.password.trim()
        val roleStr = request.role?.trim()?.uppercase() ?: "STUDENT"

        if (name.length < 2) throw ValidationException("Full name must be at least 2 characters.")
        if (!email.contains("@") || !email.contains(".")) throw ValidationException("Invalid email format.")
        if (password.length < 6) throw ValidationException("Password must be at least 6 characters.")

        val role = try {
            UserRole.valueOf(roleStr)
        } catch (e: Exception) {
            UserRole.STUDENT
        }

        // Check duplicates
        if (userRepo.findByEmail(email) != null) {
            throw DuplicateIdException("An account with email '$email' is already registered.")
        }

        val userId = if (!request.userId.isNullOrBlank()) {
            request.userId.trim().uppercase()
        } else {
            if (role == UserRole.LIBRARIAN) "LIB" + (100 + (1..899).random()) else "S" + (100 + (1..899).random())
        }

        if (userRepo.findByUserId(userId) != null) {
            throw DuplicateIdException("User ID '$userId' is already taken.")
        }

        val hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12))

        val newUser = userRepo.create(
            UserRecord(
                userId = userId,
                name = name,
                email = email,
                passwordHash = hashedPassword,
                role = role
            )
        )

        // If student, synchronize with StudentsTable
        if (role == UserRole.STUDENT && studentRepo.findByStudentId(userId) == null) {
            studentRepo.create(
                Student(
                    studentId = userId,
                    name = name,
                    email = email
                )
            )
        }

        val session = sessionRepo.createSession(
            userId = newUser.userId,
            role = newUser.role,
            rememberMe = false
        )

        return AuthResponse(
            token = session.token,
            user = newUser.toDto()
        )
    }

    suspend fun validateToken(token: String): UserDto? {
        val cleanToken = token.removePrefix("Bearer ").trim()
        if (cleanToken.isEmpty()) return null

        val session = sessionRepo.findSession(cleanToken) ?: return null
        val user = userRepo.findByUserId(session.userId) ?: return null
        return user.toDto()
    }

    suspend fun logout(token: String): Boolean {
        val cleanToken = token.removePrefix("Bearer ").trim()
        return sessionRepo.deleteSession(cleanToken)
    }

    // --- Student Portal Services ---
    suspend fun getStudentDashboard(studentId: String): StudentDashboardSummary {
        val student = studentRepo.findByStudentId(studentId)
            ?: Student(studentId = studentId, name = "Student Patron", email = null)

        val activeLoans = transactionRepo.findActiveByStudent(studentId)
        val allHistory = transactionRepo.findAllByStudent(studentId)
        val returnedCount = allHistory.count { it.status == TransactionStatus.RETURNED }

        return StudentDashboardSummary(
            student = student,
            activeLoans = activeLoans,
            totalBorrowedCount = allHistory.size,
            returnedCount = returnedCount,
            history = allHistory
        )
    }

    suspend fun getStudentBorrowings(studentId: String): List<IssueTransaction> {
        return transactionRepo.findActiveByStudent(studentId)
    }

    suspend fun getStudentHistory(studentId: String): List<IssueTransaction> {
        return transactionRepo.findAllByStudent(studentId)
    }

    // --- Task 1: Add Books ---
    suspend fun addBook(request: BookCreateRequest): Book {
        Validator.validateBookCreate(request)

        val existing = bookRepo.findByBookId(request.bookId)
        if (existing != null) {
            throw DuplicateIdException("A book with ID '${request.bookId.trim()}' already exists in the catalog.")
        }

        val book = Book(
            bookId = request.bookId.trim(),
            title = request.title.trim(),
            author = request.author.trim(),
            publicationYear = request.publicationYear,
            totalCopies = request.totalCopies,
            availableCopies = request.totalCopies
        )

        return bookRepo.create(book)
    }

    // --- Task 2: Display All Books ---
    suspend fun getAllBooks(): List<Book> {
        return bookRepo.findAll()
    }

    // --- Task 3: Search for Books ---
    suspend fun searchBooks(query: String): List<Book> {
        val q = query.trim()
        if (q.isEmpty()) {
            return getAllBooks()
        }
        return bookRepo.search(q)
    }

    suspend fun getBook(bookId: String): Book {
        return bookRepo.findByBookId(bookId)
            ?: throw NotFoundException("Book with ID '$bookId' not found.")
    }

    suspend fun updateBook(bookId: String, request: BookUpdateRequest): Book {
        val currentBook = getBook(bookId)
        val issuedCount = currentBook.totalCopies - currentBook.availableCopies

        Validator.validateBookUpdate(request, issuedCount)

        val newAvailableCopies = request.totalCopies - issuedCount

        val updated = currentBook.copy(
            title = request.title.trim(),
            author = request.author.trim(),
            publicationYear = request.publicationYear,
            totalCopies = request.totalCopies,
            availableCopies = newAvailableCopies
        )

        bookRepo.update(updated)
        return getBook(bookId)
    }

    suspend fun deleteBook(bookId: String) {
        val book = getBook(bookId)
        val activeIssues = transactionRepo.findActiveByBook(book.bookId)
        if (activeIssues.isNotEmpty()) {
            throw InvalidOperationException(
                "Cannot delete book '${book.title}' (${book.bookId}) because ${activeIssues.size} copy/copies are currently issued to students."
            )
        }
        bookRepo.delete(bookId)
    }

    // --- Students Management ---
    suspend fun addStudent(request: StudentCreateRequest): Student {
        Validator.validateStudentCreate(request)

        val existing = studentRepo.findByStudentId(request.studentId)
        if (existing != null) {
            throw DuplicateIdException("A student with ID '${request.studentId.trim()}' is already registered.")
        }

        val student = Student(
            studentId = request.studentId.trim(),
            name = request.name.trim(),
            email = request.email?.trim()
        )

        return studentRepo.create(student)
    }

    suspend fun getAllStudents(): List<Student> {
        return studentRepo.findAll()
    }

    suspend fun getStudent(studentId: String): Student {
        return studentRepo.findByStudentId(studentId)
            ?: throw NotFoundException("Student with ID '$studentId' not found.")
    }

    suspend fun searchStudents(query: String): List<Student> {
        val q = query.trim()
        if (q.isEmpty()) {
            return getAllStudents()
        }
        return studentRepo.search(q)
    }

    suspend fun updateStudent(studentId: String, request: StudentUpdateRequest): Student {
        val current = getStudent(studentId)
        Validator.validateStudentUpdate(request)

        val updated = current.copy(
            name = request.name.trim(),
            email = request.email?.trim()
        )

        studentRepo.update(updated)
        return getStudent(studentId)
    }

    // --- Task 4: Issue Books ---
    suspend fun issueBook(bookId: String, studentId: String): IssueTransaction = inventoryMutex.withLock {
        val bId = bookId.trim()
        val sId = studentId.trim()

        if (bId.isEmpty()) throw ValidationException("Book ID cannot be empty.")
        if (sId.isEmpty()) throw ValidationException("Student ID cannot be empty.")

        val book = bookRepo.findByBookId(bId)
            ?: throw NotFoundException("Cannot issue book: Book with ID '$bId' does not exist in the catalog.")

        val student = studentRepo.findByStudentId(sId)
            ?: throw NotFoundException("Cannot issue book: Student with ID '$sId' is not registered in the system.")

        if (book.availableCopies <= 0) {
            throw InventoryException("Cannot issue book '${book.title}' (${book.bookId}): No available copies in stock.")
        }

        val activeLoans = transactionRepo.findActiveByBookAndStudent(book.bookId, student.studentId)
        if (activeLoans != null) {
            throw InvalidOperationException("Student '${student.name}' already has an active issue of book '${book.title}'.")
        }

        val newAvailableCopies = book.availableCopies - 1
        val updated = bookRepo.updateAvailableCopies(book.bookId, newAvailableCopies)
        if (!updated) {
            throw InventoryException("Failed to update inventory during issue.")
        }

        val txId = "TX-" + UUID.randomUUID().toString().substring(0, 8).uppercase()
        val todayStr = LocalDate.now().format(dateFormatter)

        val transaction = IssueTransaction(
            transactionId = txId,
            bookId = book.bookId,
            bookTitle = book.title,
            studentId = student.studentId,
            studentName = student.name,
            issueDate = todayStr,
            returnDate = null,
            status = TransactionStatus.ISSUED
        )

        return transactionRepo.create(transaction)
    }

    // --- Task 5: Return Books ---
    suspend fun returnBook(bookId: String, studentId: String): IssueTransaction = inventoryMutex.withLock {
        val bId = bookId.trim()
        val sId = studentId.trim()

        if (bId.isEmpty()) throw ValidationException("Book ID cannot be empty.")
        if (sId.isEmpty()) throw ValidationException("Student ID cannot be empty.")

        val book = bookRepo.findByBookId(bId)
            ?: throw NotFoundException("Cannot return book: Book with ID '$bId' not found.")

        val activeTx = transactionRepo.findActiveByBookAndStudent(book.bookId, sId)
            ?: throw InvalidOperationException(
                "Return rejected: No active issue record found for student '$sId' with book '$bId'."
            )

        val todayStr = LocalDate.now().format(dateFormatter)
        val marked = transactionRepo.markReturned(activeTx.transactionId, todayStr)
        if (!marked) {
            throw InvalidOperationException("Failed to mark transaction as returned.")
        }

        val newAvailableCopies = (book.availableCopies + 1).coerceAtMost(book.totalCopies)
        bookRepo.updateAvailableCopies(book.bookId, newAvailableCopies)

        return activeTx.copy(
            returnDate = todayStr,
            status = TransactionStatus.RETURNED
        )
    }

    // --- Task 6: Display Issued Books ---
    suspend fun getActiveIssues(): List<IssueTransaction> {
        return transactionRepo.findByStatus(TransactionStatus.ISSUED)
    }

    suspend fun getAllTransactions(): List<IssueTransaction> {
        return transactionRepo.findAll()
    }

    // --- Dashboard Analytics ---
    suspend fun getDashboardStats(): DashboardStats {
        val books = bookRepo.findAll()
        val students = studentRepo.findAll()
        val activeIssues = transactionRepo.findByStatus(TransactionStatus.ISSUED)
        val returnedIssues = transactionRepo.findByStatus(TransactionStatus.RETURNED)

        val totalBooks = books.size
        val totalAvailable = books.sumOf { it.availableCopies }
        val totalIssued = activeIssues.size
        val returnedCount = returnedIssues.size

        return DashboardStats(
            totalBooks = totalBooks,
            totalAvailableCopies = totalAvailable,
            totalIssuedCopies = totalIssued,
            totalStudents = students.size,
            totalReturnedCount = returnedCount
        )
    }

    suspend fun getPopularBooks(): List<PopularBook> {
        val books = bookRepo.findAll()
        val allTx = transactionRepo.findAll()

        val borrowCountMap = mutableMapOf<String, Int>()
        for (tx in allTx) {
            val count = borrowCountMap.getOrDefault(tx.bookId.lowercase(), 0)
            borrowCountMap[tx.bookId.lowercase()] = count + 1
        }

        val result = mutableListOf<PopularBook>()
        for (book in books) {
            val count = borrowCountMap.getOrDefault(book.bookId.lowercase(), 0)
            result.add(
                PopularBook(
                    bookId = book.bookId,
                    title = book.title,
                    author = book.author,
                    issueCount = count,
                    availableCopies = book.availableCopies
                )
            )
        }

        return result.sortedByDescending { it.issueCount }
    }

    suspend fun getActivity(): List<ActivityItem> {
        val transactions = transactionRepo.findAll().take(10)
        val activities = mutableListOf<ActivityItem>()

        for (tx in transactions) {
            if (tx.status == TransactionStatus.RETURNED && tx.returnDate != null) {
                activities.add(
                    ActivityItem(
                        id = "ACT-RET-${tx.transactionId}",
                        type = "RETURN",
                        title = "Book Returned",
                        description = "'${tx.bookTitle}' returned by ${tx.studentName ?: tx.studentId}",
                        timestamp = tx.returnDate
                    )
                )
            } else {
                activities.add(
                    ActivityItem(
                        id = "ACT-ISS-${tx.transactionId}",
                        type = "ISSUE",
                        title = "Book Issued",
                        description = "'${tx.bookTitle}' issued to ${tx.studentName ?: tx.studentId}",
                        timestamp = tx.issueDate
                    )
                )
            }
        }
        return activities
    }

    // --- Seeding & Resetting ---
    suspend fun seedData(): String {
        // 1. Seed Books
        val sampleBooks = listOf(
            BookCreateRequest("B101", "Introduction to Algorithms", "Thomas H. Cormen", 2022, 5),
            BookCreateRequest("B102", "Clean Architecture", "Robert C. Martin", 2017, 3),
            BookCreateRequest("B103", "Design Patterns: Elements of Reusable Object-Oriented Software", "Erich Gamma et al.", 1994, 4),
            BookCreateRequest("B104", "The Pragmatic Programmer", "David Thomas & Andrew Hunt", 2019, 6),
            BookCreateRequest("B105", "Kotlin in Action", "Dmitry Jemerov & Svetlana Isakova", 2017, 4),
            BookCreateRequest("B106", "Artificial Intelligence: A Modern Approach", "Stuart Russell & Peter Norvig", 2020, 5)
        )

        for (sb in sampleBooks) {
            if (bookRepo.findByBookId(sb.bookId) == null) {
                addBook(sb)
            }
        }

        // 2. Seed Students in StudentsTable
        val sampleStudents = listOf(
            StudentCreateRequest("S101", "Alex Rivera", "alex@iemcal.ac.in"),
            StudentCreateRequest("S102", "Sarah Connor", "sarah@iemcal.ac.in"),
            StudentCreateRequest("S103", "Charlie Davis", "charlie@iemcal.ac.in"),
            StudentCreateRequest("S104", "Diana Prince", "diana@iemcal.ac.in")
        )

        for (st in sampleStudents) {
            if (studentRepo.findByStudentId(st.studentId) == null) {
                addStudent(st)
            }
        }

        // 3. Seed Demonstration User Accounts with BCrypt
        if (userRepo.findByEmail("librarian@iemcal.ac.in") == null) {
            userRepo.create(
                UserRecord(
                    userId = "LIB001",
                    name = "Eleanor Vance (Chief Librarian)",
                    email = "librarian@iemcal.ac.in",
                    passwordHash = BCrypt.hashpw("admin123", BCrypt.gensalt(12)),
                    role = UserRole.LIBRARIAN
                )
            )
        }

        if (userRepo.findByEmail("alex@iemcal.ac.in") == null) {
            userRepo.create(
                UserRecord(
                    userId = "S101",
                    name = "Alex Rivera",
                    email = "alex@iemcal.ac.in",
                    passwordHash = BCrypt.hashpw("student123", BCrypt.gensalt(12)),
                    role = UserRole.STUDENT
                )
            )
        }

        if (userRepo.findByEmail("sarah@iemcal.ac.in") == null) {
            userRepo.create(
                UserRecord(
                    userId = "S102",
                    name = "Sarah Connor",
                    email = "sarah@iemcal.ac.in",
                    passwordHash = BCrypt.hashpw("student123", BCrypt.gensalt(12)),
                    role = UserRole.STUDENT
                )
            )
        }

        // 4. Seed active issue transactions for Alex Rivera and Sarah Connor
        val currentIssues = getActiveIssues()
        if (currentIssues.isEmpty()) {
            issueBook("B101", "S101")
            issueBook("B102", "S102")
        }

        return "Demonstration dataset seeded successfully (Librarian: librarian@iemcal.ac.in / admin123, Students: alex@iemcal.ac.in & sarah@iemcal.ac.in / student123)."
    }

    suspend fun resetData(): String {
        sessionRepo.deleteAll()
        userRepo.deleteAll()
        transactionRepo.deleteAll()
        bookRepo.deleteAll()
        studentRepo.deleteAll()
        return "Database reset successfully."
    }
}
