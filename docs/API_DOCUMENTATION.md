# REST API Specification Reference
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

Base URL: `http://localhost:8080/api`  
Protocol: `HTTP/1.1`  
Data Format: `application/json`

---

## 1. Standard Response Envelope

All API endpoints return responses encapsulated in a standardized JSON envelope:

### Successful Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully.",
  "errors": null
}
```

### Error Response:
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed.",
  "errors": [
    "Available copies cannot exceed total copies."
  ]
}
```

---

## 2. Authentication Header

For protected endpoints, include the session token returned during login:
```http
Authorization: Bearer <session_token>
```

---

## 3. Endpoints Reference

### 3.1. System & Health

#### `GET /api/health`
- **Access**: Public
- **Description**: Returns microservice and database connectivity status.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "status": "HEALTHY",
    "timestamp": "2026-11-07T10:17:16.069Z",
    "database": "CONNECTED",
    "version": "1.0.0"
  },
  "message": null,
  "errors": null
}
```

---

### 3.2. Authentication

#### `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates a user (librarian or student) using their email or User ID.
- **Request Body**:
```json
{
  "identifier": "librarian@iemcal.ac.in",
  "password": "admin123",
  "rememberMe": false
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "token": "106d0055d2c5407b8f93a54f592fab9a37a968c38f72485188584e7e27a29d7d",
    "user": {
      "id": 1,
      "userId": "LIB001",
      "name": "Eleanor Vance (Chief Librarian)",
      "email": "librarian@iemcal.ac.in",
      "role": "LIBRARIAN",
      "createdAt": "2026-11-07T10:17:16.069Z"
    }
  },
  "message": "Welcome back, Eleanor Vance (Chief Librarian).",
  "errors": null
}
```
- **Error Responses**: `401 Unauthorized` (Invalid credentials).

#### `GET /api/auth/me`
- **Access**: Authenticated (Bearer Token)
- **Description**: Returns the active session's profile information.
- **Response `200 OK`**: User profile matching `login` data.

#### `POST /api/auth/logout`
- **Access**: Authenticated (Bearer Token)
- **Description**: Invalidates the current session token in `user_sessions`.
- **Response `200 OK`**: `{ "success": true, "message": "Successfully logged out." }`

---

### 3.3. Books Catalog

#### `GET /api/books`
- **Access**: Public
- **Description**: Returns all books in the catalog.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookId": "B101",
      "title": "Introduction to Algorithms",
      "author": "Thomas H. Cormen et al.",
      "publicationYear": 2022,
      "totalCopies": 5,
      "availableCopies": 4,
      "createdAt": "2026-11-07T09:26:20.539Z",
      "updatedAt": "2026-11-07T09:26:20.539Z"
    }
  ]
}
```

#### `GET /api/books/{id}`
- **Access**: Public
- **Description**: Fetch single book by accession ID (`bookId`).

#### `GET /api/books/search?q={query}`
- **Access**: Public
- **Description**: Search books by title, author, or book ID.

#### `POST /api/books`
- **Access**: Role `LIBRARIAN`
- **Description**: Creates a new book in the inventory.
- **Request Body**:
```json
{
  "bookId": "B108",
  "title": "Compilers: Principles, Techniques, and Tools",
  "author": "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
  "publicationYear": 2006,
  "totalCopies": 4
}
```
- **Response `201 Created`**: Returns created Book object.

#### `PUT /api/books/{id}`
- **Access**: Role `LIBRARIAN`
- **Description**: Updates an existing book's details or inventory counts.

#### `DELETE /api/books/{id}`
- **Access**: Role `LIBRARIAN`
- **Description**: Deletes a book record. Fails with `400 Bad Request` if any copies are currently issued.

---

### 3.4. Student Portal

#### `GET /api/student/dashboard`
- **Access**: Role `STUDENT` or `LIBRARIAN`
- **Description**: Returns personalized student patron summary, active borrowings, and history.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "student": {
      "id": 1,
      "studentId": "S101",
      "name": "Alex Rivera",
      "email": "alex@iemcal.ac.in"
    },
    "activeLoans": [
      {
        "transactionId": "TX-7D142817",
        "bookId": "B101",
        "bookTitle": "Introduction to Algorithms",
        "issueDate": "2026-11-07",
        "returnDate": null,
        "status": "ISSUED"
      }
    ],
    "totalBorrowedCount": 1,
    "returnedCount": 0,
    "history": [ ... ]
  }
}
```

---

### 3.5. Circulation & Transactions

#### `POST /api/transactions/issue`
- **Access**: Role `LIBRARIAN`
- **Description**: Issues a book copy to a student patron.
- **Request Body**:
```json
{
  "bookId": "B102",
  "studentId": "S101"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "transactionId": "TX-8A3F12CD",
    "bookId": "B102",
    "bookTitle": "Clean Architecture",
    "studentId": "S101",
    "studentName": "Alex Rivera",
    "issueDate": "2026-11-07",
    "returnDate": null,
    "status": "ISSUED"
  },
  "message": "Book 'Clean Architecture' successfully issued to Alex Rivera."
}
```

#### `POST /api/transactions/return`
- **Access**: Role `LIBRARIAN`
- **Description**: Returns an issued book copy.
- **Request Body**:
```json
{
  "bookId": "B102",
  "studentId": "S101"
}
```
- **Response `200 OK`**: Returns updated transaction with status `RETURNED`.

#### `GET /api/transactions/active`
- **Access**: Role `LIBRARIAN`
- **Description**: Lists all active borrowings across the institution.

---

### 3.6. Librarian Analytics & Management

#### `GET /api/dashboard/stats`
- **Access**: Role `LIBRARIAN`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalBooks": 7,
    "totalAvailableCopies": 27,
    "totalIssuedCopies": 3,
    "totalStudents": 5,
    "totalReturnedCount": 1
  }
}
```

#### `POST /api/seed`
- **Access**: Role `LIBRARIAN`
- **Description**: Re-seeds default demonstration catalog books and accounts.
