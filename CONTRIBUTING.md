# Contributing Guidelines & Development Manual
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

---

## 1. Development Prerequisites

Ensure your development workstation meets the following requirements:
- **Operating System**: Windows 10/11, macOS, or Linux.
- **Java Development Kit**: JDK 17 LTS or higher (OpenJDK, Microsoft Build of OpenJDK, or Eclipse Temurin).
- **Node.js**: Node.js 18.x or 20.x LTS.
- **Package Manager**: npm 9+ or pnpm / yarn.
- **IDE**: VS Code (with Kotlin and Tailwind extensions) or IntelliJ IDEA (Ultimate / Community).
- **Git**: 2.30+ for version control.

---

## 2. Setting Up the Development Environment

### 2.1. Initial Checkout & Verification
1. Open the project root in your terminal or IDE:
   ```bash
   cd IEM_Library_Management_System_GitHub_Ready
   ```
2. Verify Java installation:
   ```bash
   java -version
   # Expected: openjdk version "17.0.x" or higher
   ```
3. Verify Node installation:
   ```bash
   node -v
   # Expected: v18.x or v20.x
   ```

### 2.2. Frontend Dependencies
```bash
cd frontend
npm install
```

### 2.3. Backend Build Verification
From the project root:
```bash
# Windows
.\gradlew.bat :backend:build

# Linux / macOS
./gradlew :backend:build
```

---

## 3. Working on the Frontend (React + TypeScript)

The frontend is located in `frontend/` and powered by **Vite**, **React 18**, and **Tailwind CSS**.

### Development Server:
```bash
cd frontend
npm run dev
# Starts local Vite hot-module-replacement server at http://localhost:5173
```

### Key Frontend Guidelines:
- **Brand Identity**: Maintain official Institute of Engineering & Management, Kolkata branding tokens. Do not alter the official logo aspect ratio or reinstate deprecated names.
- **State Management**: Keep API calls consolidated inside `src/services/api.ts`.
- **Type Safety**: Strictly define interfaces in `src/types/index.ts`. Avoid `any`.
- **Styling**: Use utility classes in Tailwind. Do not hardcode arbitrary hex values if theme tokens (`bg-primary`, `text-academic-forest`) exist in `tailwind.config.js`.

### Production Build Verification:
```bash
npm run build
# Runs 'tsc && vite build' ensuring strict TypeScript compilation with 0 errors
```

---

## 4. Working on the Backend (Kotlin + Ktor)

The backend microservice is located in `backend/` and runs on the **Ktor** Netty engine with **Exposed ORM**.

### Running Backend Locally:
```bash
# Windows
.\gradlew.bat :backend:run

# Linux / macOS
./gradlew :backend:run
# Listens on http://localhost:8080
```

### Modifying Domain Models & Tables:
1. When modifying or adding database tables, update `backend/src/main/kotlin/com/librarymanagement/database/Tables.kt`.
2. Add corresponding data models in `backend/src/main/kotlin/com/librarymanagement/models/Models.kt`.
3. Add request and response serialization schemas in `backend/src/main/kotlin/com/librarymanagement/dto/Dtos.kt`.
4. Update `database/schema/schema.sql` to keep standalone SQL definitions in sync.

### Modifying REST Endpoints:
1. Add or modify route declarations in `backend/src/main/kotlin/com/librarymanagement/routes/ApiRoutes.kt`.
2. Always apply role guards:
   - Public: Accessible without Bearer token (e.g. `/api/books`, `/api/auth/login`).
   - Student: Guarded with `extractSession()` verifying `role == "STUDENT"` or `role == "LIBRARIAN"`.
   - Librarian: Strictly guarded verifying `role == "LIBRARIAN"`. Return `HttpStatusCode.Forbidden` for unauthorized patrons.
3. Validate all incoming request bodies using `backend/src/main/kotlin/com/librarymanagement/validation/Validation.kt`.

---

## 5. Testing & Verification Requirements

Every code modification must pass automated checks before submission:

### Running Backend Tests:
```bash
# Windows
.\gradlew.bat :backend:test

# Linux / macOS
./gradlew :backend:test
```
Backend tests cover:
- Unit tests (`LibraryServiceTest.kt`): Physical inventory invariants, borrow limits, duplicate ID prevention.
- Integration tests (`ApiIntegrationTest.kt`): Full HTTP request lifecycle, error responses, authentication workflows.

### Running Frontend Type-Check & Build:
```bash
cd frontend
npm run build
```

---

## 6. Code Style & Commit Conventions

- Use clean, declarative Kotlin idiomatic constructs (`val`, `when`, data classes, coroutines).
- Never commit plaintext passwords, private API secrets, or hardcoded personal machine paths.
- Follow standard semantic commit messages:
  - `feat: add reservation queue for borrowed books`
  - `fix: resolve availableCopies decrement race condition`
  - `docs: update API documentation for student dashboard`
