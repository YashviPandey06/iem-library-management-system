package com.librarymanagement.android.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.librarymanagement.android.data.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}

class LibraryViewModel : ViewModel() {

    private val api = ApiClient.service

    private val _booksState = MutableStateFlow<UiState<List<Book>>>(UiState.Loading)
    val booksState: StateFlow<UiState<List<Book>>> = _booksState.asStateFlow()

    private val _activeIssuesState = MutableStateFlow<UiState<List<IssueTransaction>>>(UiState.Loading)
    val activeIssuesState: StateFlow<UiState<List<IssueTransaction>>> = _activeIssuesState.asStateFlow()

    private val _statsState = MutableStateFlow<UiState<DashboardStats>>(UiState.Loading)
    val statsState: StateFlow<UiState<DashboardStats>> = _statsState.asStateFlow()

    private val _actionFeedback = MutableStateFlow<String?>(null)
    val actionFeedback: StateFlow<String?> = _actionFeedback.asStateFlow()

    private val _actionError = MutableStateFlow<String?>(null)
    val actionError: StateFlow<String?> = _actionError.asStateFlow()

    private val _isSubmitting = MutableStateFlow(false)
    val isSubmitting: StateFlow<Boolean> = _isSubmitting.asStateFlow()

    init {
        refreshAll()
    }

    fun refreshAll() {
        loadBooks()
        loadActiveIssues()
        loadStats()
    }

    fun clearFeedback() {
        _actionFeedback.value = null
        _actionError.value = null
    }

    fun loadBooks(query: String = "") {
        viewModelScope.launch {
            _booksState.value = UiState.Loading
            try {
                val res = if (query.trim().isEmpty()) api.getBooks() else api.searchBooks(query.trim())
                if (res.success && res.data != null) {
                    _booksState.value = UiState.Success(res.data)
                } else {
                    _booksState.value = UiState.Error(res.message ?: "Failed to load books")
                }
            } catch (e: Exception) {
                _booksState.value = UiState.Error(e.localizedMessage ?: "Network error connecting to $ApiClient.baseUrl")
            }
        }
    }

    fun loadActiveIssues() {
        viewModelScope.launch {
            _activeIssuesState.value = UiState.Loading
            try {
                val res = api.getActiveIssues()
                if (res.success && res.data != null) {
                    _activeIssuesState.value = UiState.Success(res.data)
                } else {
                    _activeIssuesState.value = UiState.Error(res.message ?: "Failed to load issues")
                }
            } catch (e: Exception) {
                _activeIssuesState.value = UiState.Error(e.localizedMessage ?: "Network error")
            }
        }
    }

    fun loadStats() {
        viewModelScope.launch {
            try {
                val res = api.getStats()
                if (res.success && res.data != null) {
                    _statsState.value = UiState.Success(res.data)
                }
            } catch (e: Exception) {
                _statsState.value = UiState.Error(e.localizedMessage ?: "Failed to load stats")
            }
        }
    }

    // Task 1: Add Book
    fun addBook(bookId: String, title: String, author: String, year: Int, copies: Int, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _isSubmitting.value = true
            _actionError.value = null
            try {
                val req = BookCreateRequest(bookId.trim(), title.trim(), author.trim(), year, copies)
                val res = api.createBook(req)
                if (res.success) {
                    _actionFeedback.value = "Book '${title.trim()}' added successfully!"
                    refreshAll()
                    onSuccess()
                } else {
                    _actionError.value = res.message ?: (res.errors?.joinToString("; ") ?: "Error creating book")
                }
            } catch (e: Exception) {
                _actionError.value = e.localizedMessage ?: "Network error"
            } finally {
                _isSubmitting.value = false
            }
        }
    }

    // Task 4: Issue Book
    fun issueBook(bookId: String, studentId: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _isSubmitting.value = true
            _actionError.value = null
            try {
                val req = IssueBookRequest(bookId.trim(), studentId.trim())
                val res = api.issueBook(req)
                if (res.success) {
                    _actionFeedback.value = "Book successfully issued to $studentId!"
                    refreshAll()
                    onSuccess()
                } else {
                    _actionError.value = res.message ?: "Failed to issue book"
                }
            } catch (e: Exception) {
                _actionError.value = e.localizedMessage ?: "Network error"
            } finally {
                _isSubmitting.value = false
            }
        }
    }

    // Task 5: Return Book
    fun returnBook(bookId: String, studentId: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _isSubmitting.value = true
            _actionError.value = null
            try {
                val req = ReturnBookRequest(bookId.trim(), studentId.trim())
                val res = api.returnBook(req)
                if (res.success) {
                    _actionFeedback.value = "Book successfully returned! Inventory updated."
                    refreshAll()
                    onSuccess()
                } else {
                    _actionError.value = res.message ?: "Failed to return book"
                }
            } catch (e: Exception) {
                _actionError.value = e.localizedMessage ?: "Network error"
            } finally {
                _isSubmitting.value = false
            }
        }
    }
}
