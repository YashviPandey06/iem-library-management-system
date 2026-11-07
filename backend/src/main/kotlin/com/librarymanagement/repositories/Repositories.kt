package com.librarymanagement.repositories

import com.librarymanagement.config.DatabaseConfig.query
import com.librarymanagement.database.BooksTable
import com.librarymanagement.database.StudentsTable
import com.librarymanagement.database.TransactionsTable
import com.librarymanagement.database.UsersTable
import com.librarymanagement.database.UserSessionsTable
import com.librarymanagement.models.Book
import com.librarymanagement.models.IssueTransaction
import com.librarymanagement.models.Student
import com.librarymanagement.models.TransactionStatus
import com.librarymanagement.models.UserRecord
import com.librarymanagement.models.UserRole
import com.librarymanagement.models.UserSession
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

class BookRepository {

    private fun ResultRow.toBook(): Book = Book(
        id = this[BooksTable.id],
        bookId = this[BooksTable.bookId],
        title = this[BooksTable.title],
        author = this[BooksTable.author],
        publicationYear = this[BooksTable.publicationYear],
        totalCopies = this[BooksTable.totalCopies],
        availableCopies = this[BooksTable.availableCopies],
        createdAt = this[BooksTable.createdAt],
        updatedAt = this[BooksTable.updatedAt]
    )

    suspend fun findAll(): List<Book> = query {
        BooksTable.selectAll()
            .orderBy(BooksTable.id to SortOrder.ASC)
            .map { it.toBook() }
    }

    suspend fun findByBookId(bookId: String): Book? = query {
        BooksTable.selectAll()
            .where { BooksTable.bookId.lowerCase() eq bookId.trim().lowercase() }
            .singleOrNull()
            ?.toBook()
    }

    suspend fun search(queryText: String): List<Book> = query {
        val q = "%${queryText.trim().lowercase()}%"
        BooksTable.selectAll()
            .where { (BooksTable.bookId.lowerCase() like q) or (BooksTable.title.lowerCase() like q) or (BooksTable.author.lowerCase() like q) }
            .orderBy(BooksTable.title to SortOrder.ASC)
            .map { it.toBook() }
    }

    suspend fun create(book: Book): Book = query {
        val now = Instant.now().toString()
        val generatedId = BooksTable.insert {
            it[bookId] = book.bookId.trim()
            it[title] = book.title.trim()
            it[author] = book.author.trim()
            it[publicationYear] = book.publicationYear
            it[totalCopies] = book.totalCopies
            it[availableCopies] = book.availableCopies
            it[createdAt] = now
            it[updatedAt] = now
        } get BooksTable.id

        book.copy(id = generatedId, createdAt = now, updatedAt = now)
    }

    suspend fun update(book: Book): Boolean = query {
        val now = Instant.now().toString()
        val count = BooksTable.update({ BooksTable.bookId.lowerCase() eq book.bookId.trim().lowercase() }) {
            it[title] = book.title.trim()
            it[author] = book.author.trim()
            it[publicationYear] = book.publicationYear
            it[totalCopies] = book.totalCopies
            it[availableCopies] = book.availableCopies
            it[updatedAt] = now
        }
        count > 0
    }

    suspend fun updateAvailableCopies(bookId: String, newAvailableCopies: Int): Boolean = query {
        val now = Instant.now().toString()
        val count = BooksTable.update({ BooksTable.bookId.lowerCase() eq bookId.trim().lowercase() }) {
            it[availableCopies] = newAvailableCopies
            it[updatedAt] = now
        }
        count > 0
    }

    suspend fun delete(bookId: String): Boolean = query {
        val count = BooksTable.deleteWhere { BooksTable.bookId.lowerCase() eq bookId.trim().lowercase() }
        count > 0
    }

    suspend fun deleteAll(): Unit = query {
        BooksTable.deleteAll()
    }
}

class StudentRepository {

    private fun ResultRow.toStudent(): Student = Student(
        id = this[StudentsTable.id],
        studentId = this[StudentsTable.studentId],
        name = this[StudentsTable.name],
        email = this[StudentsTable.email],
        createdAt = this[StudentsTable.createdAt]
    )

    suspend fun findAll(): List<Student> = query {
        StudentsTable.selectAll()
            .orderBy(StudentsTable.name to SortOrder.ASC)
            .map { it.toStudent() }
    }

    suspend fun findByStudentId(studentId: String): Student? = query {
        StudentsTable.selectAll()
            .where { StudentsTable.studentId.lowerCase() eq studentId.trim().lowercase() }
            .singleOrNull()
            ?.toStudent()
    }

    suspend fun search(queryText: String): List<Student> = query {
        val q = "%${queryText.trim().lowercase()}%"
        StudentsTable.selectAll()
            .where { (StudentsTable.studentId.lowerCase() like q) or (StudentsTable.name.lowerCase() like q) }
            .orderBy(StudentsTable.name to SortOrder.ASC)
            .map { it.toStudent() }
    }

    suspend fun create(student: Student): Student = query {
        val now = Instant.now().toString()
        val generatedId = StudentsTable.insert {
            it[studentId] = student.studentId.trim()
            it[name] = student.name.trim()
            it[email] = student.email?.trim()
            it[createdAt] = now
        } get StudentsTable.id

        student.copy(id = generatedId, createdAt = now)
    }

    suspend fun update(student: Student): Boolean = query {
        val count = StudentsTable.update({ StudentsTable.studentId.lowerCase() eq student.studentId.trim().lowercase() }) {
            it[name] = student.name.trim()
            it[email] = student.email?.trim()
        }
        count > 0
    }

    suspend fun delete(studentId: String): Boolean = query {
        val count = StudentsTable.deleteWhere { StudentsTable.studentId.lowerCase() eq studentId.trim().lowercase() }
        count > 0
    }

    suspend fun deleteAll(): Unit = query {
        StudentsTable.deleteAll()
    }
}

class TransactionRepository {

    private fun ResultRow.toTransaction(bookTitle: String = "", studentName: String? = null): IssueTransaction = IssueTransaction(
        id = this[TransactionsTable.id],
        transactionId = this[TransactionsTable.transactionId],
        bookId = this[TransactionsTable.bookId],
        bookTitle = bookTitle,
        studentId = this[TransactionsTable.studentId],
        studentName = studentName,
        issueDate = this[TransactionsTable.issueDate],
        returnDate = this[TransactionsTable.returnDate],
        status = TransactionStatus.valueOf(this[TransactionsTable.status]),
        createdAt = this[TransactionsTable.createdAt]
    )

    private fun transactionJoin() = TransactionsTable.join(
        BooksTable,
        JoinType.INNER,
        onColumn = TransactionsTable.bookId,
        otherColumn = BooksTable.bookId
    ).join(
        StudentsTable,
        JoinType.LEFT,
        onColumn = TransactionsTable.studentId,
        otherColumn = StudentsTable.studentId
    )

    suspend fun findAll(): List<IssueTransaction> = query {
        transactionJoin()
            .selectAll()
            .orderBy(TransactionsTable.id to SortOrder.DESC)
            .map {
                it.toTransaction(
                    bookTitle = it[BooksTable.title],
                    studentName = it.getOrNull(StudentsTable.name)
                )
            }
    }

    suspend fun findByStatus(status: TransactionStatus): List<IssueTransaction> = query {
        transactionJoin()
            .selectAll()
            .where { TransactionsTable.status eq status.name }
            .orderBy(TransactionsTable.id to SortOrder.DESC)
            .map {
                it.toTransaction(
                    bookTitle = it[BooksTable.title],
                    studentName = it.getOrNull(StudentsTable.name)
                )
            }
    }

    suspend fun findActiveByBookAndStudent(bookId: String, studentId: String): IssueTransaction? = query {
        transactionJoin()
            .selectAll()
            .where {
                (TransactionsTable.bookId.lowerCase() eq bookId.trim().lowercase()) and
                (TransactionsTable.studentId.lowerCase() eq studentId.trim().lowercase()) and
                (TransactionsTable.status eq TransactionStatus.ISSUED.name)
            }
            .orderBy(TransactionsTable.id to SortOrder.DESC)
            .limit(1)
            .singleOrNull()
            ?.let {
                it.toTransaction(
                    bookTitle = it[BooksTable.title],
                    studentName = it.getOrNull(StudentsTable.name)
                )
            }
    }

    suspend fun findActiveByBook(bookId: String): List<IssueTransaction> = query {
        transactionJoin()
            .selectAll()
            .where {
                (TransactionsTable.bookId.lowerCase() eq bookId.trim().lowercase()) and
                (TransactionsTable.status eq TransactionStatus.ISSUED.name)
            }
            .map {
                it.toTransaction(
                    bookTitle = it[BooksTable.title],
                    studentName = it.getOrNull(StudentsTable.name)
                )
            }
    }

    suspend fun findActiveByStudent(studentId: String): List<IssueTransaction> = query {
        transactionJoin()
            .selectAll()
            .where {
                (TransactionsTable.studentId.lowerCase() eq studentId.trim().lowercase()) and
                (TransactionsTable.status eq TransactionStatus.ISSUED.name)
            }
            .orderBy(TransactionsTable.id to SortOrder.DESC)
            .map {
                it.toTransaction(
                    bookTitle = it[BooksTable.title],
                    studentName = it.getOrNull(StudentsTable.name)
                )
            }
    }

    suspend fun findAllByStudent(studentId: String): List<IssueTransaction> = query {
        transactionJoin()
            .selectAll()
            .where { TransactionsTable.studentId.lowerCase() eq studentId.trim().lowercase() }
            .orderBy(TransactionsTable.id to SortOrder.DESC)
            .map {
                it.toTransaction(
                    bookTitle = it[BooksTable.title],
                    studentName = it.getOrNull(StudentsTable.name)
                )
            }
    }

    suspend fun create(tx: IssueTransaction): IssueTransaction = query {
        val now = Instant.now().toString()
        val generatedId = TransactionsTable.insert {
            it[transactionId] = tx.transactionId
            it[bookId] = tx.bookId.trim()
            it[studentId] = tx.studentId.trim()
            it[issueDate] = tx.issueDate
            it[returnDate] = null
            it[status] = tx.status.name
            it[createdAt] = now
        } get TransactionsTable.id

        tx.copy(id = generatedId, createdAt = now)
    }

    suspend fun markReturned(transactionId: String, returnDate: String): Boolean = query {
        val count = TransactionsTable.update({ TransactionsTable.transactionId eq transactionId }) {
            it[status] = TransactionStatus.RETURNED.name
            it[TransactionsTable.returnDate] = returnDate
        }
        count > 0
    }

    suspend fun deleteAll(): Unit = query {
        TransactionsTable.deleteAll()
    }
}

class UserRepository {

    private fun ResultRow.toUserRecord(): UserRecord = UserRecord(
        id = this[UsersTable.id],
        userId = this[UsersTable.userId],
        name = this[UsersTable.name],
        email = this[UsersTable.email],
        passwordHash = this[UsersTable.passwordHash],
        role = UserRole.valueOf(this[UsersTable.role]),
        createdAt = this[UsersTable.createdAt],
        updatedAt = this[UsersTable.updatedAt]
    )

    suspend fun findByEmailOrUserId(identifier: String): UserRecord? = query {
        val clean = identifier.trim().lowercase()
        UsersTable.selectAll()
            .where { (UsersTable.email.lowerCase() eq clean) or (UsersTable.userId.lowerCase() eq clean) }
            .singleOrNull()
            ?.toUserRecord()
    }

    suspend fun findByUserId(userId: String): UserRecord? = query {
        UsersTable.selectAll()
            .where { UsersTable.userId.lowerCase() eq userId.trim().lowercase() }
            .singleOrNull()
            ?.toUserRecord()
    }

    suspend fun findByEmail(email: String): UserRecord? = query {
        UsersTable.selectAll()
            .where { UsersTable.email.lowerCase() eq email.trim().lowercase() }
            .singleOrNull()
            ?.toUserRecord()
    }

    suspend fun create(user: UserRecord): UserRecord = query {
        val now = Instant.now().toString()
        val generatedId = UsersTable.insert {
            it[userId] = user.userId.trim()
            it[name] = user.name.trim()
            it[email] = user.email.trim().lowercase()
            it[passwordHash] = user.passwordHash
            it[role] = user.role.name
            it[createdAt] = now
            it[updatedAt] = now
        } get UsersTable.id

        user.copy(id = generatedId, createdAt = now, updatedAt = now)
    }

    suspend fun count(): Long = query {
        UsersTable.selectAll().count()
    }

    suspend fun deleteAll(): Unit = query {
        UsersTable.deleteAll()
    }
}

class SessionRepository {

    private fun ResultRow.toSession(): UserSession = UserSession(
        token = this[UserSessionsTable.token],
        userId = this[UserSessionsTable.userId],
        role = UserRole.valueOf(this[UserSessionsTable.role]),
        createdAt = this[UserSessionsTable.createdAt],
        expiresAt = this[UserSessionsTable.expiresAt]
    )

    suspend fun createSession(userId: String, role: UserRole, rememberMe: Boolean = false): UserSession = query {
        val token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "")
        val now = Instant.now()
        val durationDays = if (rememberMe) 30L else 7L
        val expiresAt = now.plus(durationDays, ChronoUnit.DAYS).toString()

        UserSessionsTable.insert {
            it[UserSessionsTable.token] = token
            it[UserSessionsTable.userId] = userId
            it[UserSessionsTable.role] = role.name
            it[createdAt] = now.toString()
            it[UserSessionsTable.expiresAt] = expiresAt
        }

        UserSession(
            token = token,
            userId = userId,
            role = role,
            createdAt = now.toString(),
            expiresAt = expiresAt
        )
    }

    suspend fun findSession(token: String): UserSession? = query {
        val now = Instant.now().toString()
        UserSessionsTable.selectAll()
            .where { (UserSessionsTable.token eq token.trim()) and (UserSessionsTable.expiresAt greater now) }
            .singleOrNull()
            ?.toSession()
    }

    suspend fun deleteSession(token: String): Boolean = query {
        val count = UserSessionsTable.deleteWhere { UserSessionsTable.token eq token.trim() }
        count > 0
    }

    suspend fun deleteAll(): Unit = query {
        UserSessionsTable.deleteAll()
    }
}
