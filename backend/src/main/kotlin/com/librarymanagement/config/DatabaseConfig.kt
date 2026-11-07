package com.librarymanagement.config

import com.librarymanagement.database.BooksTable
import com.librarymanagement.database.StudentsTable
import com.librarymanagement.database.TransactionsTable
import com.librarymanagement.database.UsersTable
import com.librarymanagement.database.UserSessionsTable
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

object DatabaseConfig {

    private lateinit var database: Database

    fun init(dbFilePath: String = "library.db") {
        val file = File(dbFilePath)
        val parent = file.parentFile
        if (parent != null && !parent.exists()) {
            parent.mkdirs()
        }

        database = Database.connect(
            url = "jdbc:sqlite:$dbFilePath",
            driver = "org.sqlite.JDBC"
        )

        transaction(database) {
            SchemaUtils.createMissingTablesAndColumns(
                BooksTable,
                StudentsTable,
                TransactionsTable,
                UsersTable,
                UserSessionsTable
            )
        }
    }

    suspend fun <T> query(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO, database) { block() }
}
