package com.librarymanagement.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.librarymanagement.android.data.ApiClient
import com.librarymanagement.android.data.Book
import com.librarymanagement.android.data.IssueTransaction
import com.librarymanagement.android.ui.theme.IEMLibraryTheme
import com.librarymanagement.android.ui.theme.EmeraldAvailable
import com.librarymanagement.android.ui.theme.PrimaryIndigo
import com.librarymanagement.android.viewmodel.LibraryViewModel
import com.librarymanagement.android.viewmodel.UiState

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            IEMLibraryTheme {
                MainAppScreen()
            }
        }
    }
}

enum class NavigationScreen(val title: String) {
    DASHBOARD("Dashboard"),
    BOOKS("Books Catalog"),
    ADD_BOOK("Add Book"),
    CIRCULATION("Issue / Return"),
    ACTIVE_ISSUES("Active Issues")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen(vm: LibraryViewModel = viewModel()) {
    var currentScreen by remember { mutableStateOf(NavigationScreen.DASHBOARD) }
    var showServerConfigDialog by remember { mutableStateOf(false) }
    var serverUrlInput by remember { mutableStateOf(ApiClient.baseUrl) }

    val feedback by vm.actionFeedback.collectAsState()
    val error by vm.actionError.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "IEM Library Library System",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = currentScreen.title,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { vm.refreshAll() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                    IconButton(onClick = { showServerConfigDialog = true }) {
                        Icon(Icons.Default.Settings, contentDescription = "Server Settings")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.DASHBOARD,
                    onClick = { currentScreen = NavigationScreen.DASHBOARD },
                    icon = { Icon(Icons.Default.Dashboard, contentDescription = null) },
                    label = { Text("Overview") }
                )
                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.BOOKS,
                    onClick = { currentScreen = NavigationScreen.BOOKS },
                    icon = { Icon(Icons.Default.MenuBook, contentDescription = null) },
                    label = { Text("Books") }
                )
                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.ADD_BOOK,
                    onClick = { currentScreen = NavigationScreen.ADD_BOOK },
                    icon = { Icon(Icons.Default.AddCircle, contentDescription = null) },
                    label = { Text("Add") }
                )
                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.CIRCULATION,
                    onClick = { currentScreen = NavigationScreen.CIRCULATION },
                    icon = { Icon(Icons.Default.SwapHoriz, contentDescription = null) },
                    label = { Text("Circulation") }
                )
                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.ACTIVE_ISSUES,
                    onClick = { currentScreen = NavigationScreen.ACTIVE_ISSUES },
                    icon = { Icon(Icons.Default.Assignment, contentDescription = null) },
                    label = { Text("Issued") }
                )
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Banner notifications
                feedback?.let { msg ->
                    Surface(
                        color = Color(0xFFD1FAE5),
                        modifier = Modifier.fillMaxWidth().padding(8.dp),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldAvailable)
                            Spacer(Modifier.width(8.dp))
                            Text(msg, color = Color(0xFF065F46), fontSize = 13.sp)
                        }
                    }
                }
                error?.let { err ->
                    Surface(
                        color = Color(0xFFFEE2E2),
                        modifier = Modifier.fillMaxWidth().padding(8.dp),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Color.Red)
                            Spacer(Modifier.width(8.dp))
                            Text(err, color = Color(0xFF991B1B), fontSize = 13.sp)
                        }
                    }
                }

                // Screen switcher
                when (currentScreen) {
                    NavigationScreen.DASHBOARD -> DashboardContent(vm) { currentScreen = it }
                    NavigationScreen.BOOKS -> BooksCatalogContent(vm)
                    NavigationScreen.ADD_BOOK -> AddBookContent(vm) { currentScreen = NavigationScreen.BOOKS }
                    NavigationScreen.CIRCULATION -> CirculationContent(vm)
                    NavigationScreen.ACTIVE_ISSUES -> ActiveIssuesContent(vm)
                }
            }

            // Server configuration dialog
            if (showServerConfigDialog) {
                AlertDialog(
                    onDismissRequest = { showServerConfigDialog = false },
                    title = { Text("Backend Server URL") },
                    text = {
                        Column {
                            Text(
                                "Default emulator IP: http://10.0.2.2:8080/api/\n" +
                                "Physical device: use your PC's local LAN IP (e.g. http://192.168.1.X:8080/api/)",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(Modifier.height(8.dp))
                            OutlinedTextField(
                                value = serverUrlInput,
                                onValueChange = { serverUrlInput = it },
                                label = { Text("API Base URL") },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    },
                    confirmButton = {
                        Button(onClick = {
                            ApiClient.baseUrl = serverUrlInput
                            showServerConfigDialog = false
                            vm.refreshAll()
                        }) {
                            Text("Save & Connect")
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = { showServerConfigDialog = false }) {
                            Text("Cancel")
                        }
                    }
                )
            }
        }
    }
}

@Composable
fun DashboardContent(vm: LibraryViewModel, onNavigate: (NavigationScreen) -> Unit) {
    val statsState by vm.statsState.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                "System Overview",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                "Real-time database metrics across all interfaces.",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        item {
            when (val s = statsState) {
                is UiState.Loading -> CircularProgressIndicator()
                is UiState.Error -> Text("Offline: ${s.message}", color = Color.Red, fontSize = 13.sp)
                is UiState.Success -> {
                    val stats = s.data
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        StatBox("Catalog Titles", stats.totalBooks.toString(), PrimaryIndigo, Modifier.weight(1f))
                        StatBox("Available Copies", stats.totalAvailableCopies.toString(), EmeraldAvailable, Modifier.weight(1f))
                    }
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        StatBox("Active Loans", stats.totalIssuedCopies.toString(), Color(0xFFD97706), Modifier.weight(1f))
                        StatBox("Students", stats.totalStudents.toString(), Color(0xFF0284C7), Modifier.weight(1f))
                    }
                }
            }
        }

        item {
            Text("Quick Actions", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(Modifier.height(8.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = { onNavigate(NavigationScreen.ADD_BOOK) },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Add Book")
                }
                Button(
                    onClick = { onNavigate(NavigationScreen.CIRCULATION) },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Issue / Return")
                }
            }
        }
    }
}

@Composable
fun StatBox(label: String, value: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(4.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}

@Composable
fun BooksCatalogContent(vm: LibraryViewModel) {
    val booksState by vm.booksState.collectAsState()
    var searchInput by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        OutlinedTextField(
            value = searchInput,
            onValueChange = {
                searchInput = it
                vm.loadBooks(it)
            },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            placeholder = { Text("Task 3: Search book ID or title...") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            shape = RoundedCornerShape(12.dp)
        )

        Spacer(Modifier.height(16.dp))

        when (val state = booksState) {
            is UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            is UiState.Error -> Text("Error: ${state.message}", color = Color.Red)
            is UiState.Success -> {
                if (state.data.isEmpty()) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No books matching query.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(state.data) { book ->
                            BookCard(book)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BookCard(book: Book) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = book.bookId,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryIndigo,
                    fontSize = 12.sp
                )
                Surface(
                    color = if (book.availableCopies > 0) Color(0xFFD1FAE5) else Color(0xFFFEE2E2),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = if (book.availableCopies > 0) "AVAILABLE" else "OUT OF STOCK",
                        color = if (book.availableCopies > 0) Color(0xFF065F46) else Color(0xFF991B1B),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(Modifier.height(6.dp))
            Text(book.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(book.author, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)

            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Year: ${book.publicationYear}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(
                    "Stock: ${book.availableCopies} / ${book.totalCopies}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun AddBookContent(vm: LibraryViewModel, onAdded: () -> Unit) {
    var bookId by remember { mutableStateOf("") }
    var title by remember { mutableStateOf("") }
    var author by remember { mutableStateOf("") }
    var year by remember { mutableStateOf("") }
    var copies by remember { mutableStateOf("1") }

    val isSubmitting by vm.isSubmitting.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text("Task 1: Add New Book", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text("Validates uniqueness, inputs, and updates catalog.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        item {
            OutlinedTextField(
                value = bookId,
                onValueChange = { bookId = it },
                label = { Text("Book ID * (e.g. B101)") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Book Title *") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            OutlinedTextField(
                value = author,
                onValueChange = { author = it },
                label = { Text("Author Name *") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            OutlinedTextField(
                value = year,
                onValueChange = { year = it },
                label = { Text("Publication Year * (e.g. 2023)") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            OutlinedTextField(
                value = copies,
                onValueChange = { copies = it },
                label = { Text("Number of Copies *") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            Spacer(Modifier.height(8.dp))
            Button(
                onClick = {
                    val y = year.toIntOrNull() ?: 0
                    val c = copies.toIntOrNull() ?: 0
                    vm.addBook(bookId, title, author, y, c) {
                        bookId = ""
                        title = ""
                        author = ""
                        year = ""
                        copies = "1"
                        onAdded()
                    }
                },
                enabled = !isSubmitting,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isSubmitting) CircularProgressIndicator(Modifier.size(20.dp), color = Color.White)
                else Text("Register Book (Task 1)")
            }
        }
    }
}

@Composable
fun CirculationContent(vm: LibraryViewModel) {
    var selectedTab by remember { mutableStateOf(0) }
    var bookId by remember { mutableStateOf("") }
    var studentId by remember { mutableStateOf("") }
    val isSubmitting by vm.isSubmitting.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        TabRow(selectedTabIndex = selectedTab) {
            Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Issue (Task 4)") })
            Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }, text = { Text("Return (Task 5)") })
        }

        Spacer(Modifier.height(16.dp))

        OutlinedTextField(
            value = bookId,
            onValueChange = { bookId = it },
            label = { Text("Book ID (e.g. B101)") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(12.dp))

        OutlinedTextField(
            value = studentId,
            onValueChange = { studentId = it },
            label = { Text("Student ID (e.g. S101)") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(20.dp))

        if (selectedTab == 0) {
            Button(
                onClick = {
                    vm.issueBook(bookId, studentId) {
                        bookId = ""
                        studentId = ""
                    }
                },
                enabled = !isSubmitting,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isSubmitting) CircularProgressIndicator(Modifier.size(20.dp), color = Color.White)
                else Text("Confirm Issue Book")
            }
        } else {
            Button(
                onClick = {
                    vm.returnBook(bookId, studentId) {
                        bookId = ""
                        studentId = ""
                    }
                },
                enabled = !isSubmitting,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isSubmitting) CircularProgressIndicator(Modifier.size(20.dp), color = Color.White)
                else Text("Confirm Return Book")
            }
        }
    }
}

@Composable
fun ActiveIssuesContent(vm: LibraryViewModel) {
    val issuesState by vm.activeIssuesState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Task 6: Currently Issued Books", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text("Displays all active, unreturned borrowings.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(12.dp))

        when (val state = issuesState) {
            is UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            is UiState.Error -> Text("Error: ${state.message}", color = Color.Red)
            is UiState.Success -> {
                if (state.data.isEmpty()) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No active loans at this time.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(state.data) { item ->
                            Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                                Column(Modifier.padding(14.dp)) {
                                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        Text(item.transactionId, fontFamily = FontFamily.Monospace, fontSize = 12.sp, color = PrimaryIndigo)
                                        Text("ISSUED", color = Color(0xFFD97706), fontWeight = FontWeight.Bold, fontSize = 11.sp)
                                    }
                                    Spacer(Modifier.height(4.dp))
                                    Text(item.bookTitle, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                    Text("Book ID: ${item.bookId} | Student ID: ${item.studentId}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text("Issue Date: ${item.issueDate}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
