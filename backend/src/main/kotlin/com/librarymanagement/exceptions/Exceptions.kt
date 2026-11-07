package com.librarymanagement.exceptions

open class LibraryException(message: String) : RuntimeException(message)

class ValidationException(val errors: List<String>) : 
    LibraryException(errors.joinToString("; ")) {
    constructor(error: String) : this(listOf(error))
}

class DuplicateIdException(message: String) : LibraryException(message)

class NotFoundException(message: String) : LibraryException(message)

class InventoryException(message: String) : LibraryException(message)

class InvalidOperationException(message: String) : LibraryException(message)

class AuthenticationException(message: String) : LibraryException(message)

class AuthorizationException(message: String) : LibraryException(message)
