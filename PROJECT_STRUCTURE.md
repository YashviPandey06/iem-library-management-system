# Project Structure & Directory Blueprint
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

---

## 1. Directory Tree Overview

```text
IEM_Library_Management_System_GitHub_Ready/
│
├── frontend/                     # React 18 + TypeScript + Vite web client
│   ├── public/                   # Static assets, favicon, PWA icons, official IEM logos
│   │   ├── favicon.svg
│   │   └── iem-logo.png          # Official Institute of Engineering & Management logo
│   ├── src/
│   │   ├── components/           # Reusable UI & animation components
│   │   │   ├── BookCard.tsx      # Interactive 3D physical book rendering & flip modal
│   │   │   ├── Navbar.tsx        # Institutional header with IEM branding & role status
│   │   │   ├── Footer.tsx        # Academic institutional footer & campus contacts
│   │   │   ├── InfiniteLibrarySectionBackground.tsx # Multi-layer parallax living library animation
│   │   │   └── FloatingBooksBackground.tsx          # 3D floating book simulation
│   │   ├── pages/                # View controllers and route views
│   │   │   ├── LandingPage.tsx   # Institutional portal with catalog & search
│   │   │   ├── LoginPage.tsx     # Animated living library authentication screen
│   │   │   ├── StudentDashboard.tsx # Patron borrowing history & book requests
│   │   │   └── AdminDashboard.tsx   # Librarian circulation & inventory console
│   │   ├── services/             # HTTP REST API client layer
│   │   │   └── api.ts            # Typed fetch wrapper with Bearer token interceptor
│   │   ├── types/                # TypeScript interface and enum declarations
│   │   │   └── index.ts          # Book, Student, Transaction, User models
│   │   ├── App.tsx               # Root routing (React Router DOM v6) & auth provider
│   │   ├── main.tsx              # Application bootstrap
│   │   └── index.css             # Tailwind CSS & custom perspective animation keyframes
│   ├── package.json              # NPM dependencies and scripts
│   ├── tsconfig.json             # TypeScript compiler configuration
│   ├── vite.config.ts            # Vite bundler configuration
│   ├── tailwind.config.js        # Institutional color palette & typography tokens
│   ├── postcss.config.js         # PostCSS plugins
│   └── Dockerfile                # Production multi-stage Nginx container
│
├── backend/                      # Kotlin 1.9.23 + Ktor 2.3.12 RESTful microservice
│   ├── src/
│   │   ├── main/
│   │   │   ├── kotlin/com/librarymanagement/
│   │   │   │   ├── Application.kt           # Ktor server engine bootstrap (Netty)
│   │   │   │   ├── config/
│   │   │   │   │   └── DatabaseConfig.kt    # SQLite JDBC & Exposed ORM connection manager
│   │   │   │   ├── database/
│   │   │   │   │   └── Tables.kt            # Exposed SQL Table schemas (Books, Students, Users...)
│   │   │   │   ├── dto/
│   │   │   │   │   └── Dtos.kt              # Serializable request & response payload schemas
│   │   │   │   ├── exceptions/
│   │   │   │   │   └── Exceptions.kt        # Domain exception hierarchy (Validation, NotFound...)
│   │   │   │   ├── models/
│   │   │   │   │   └── Models.kt            # Domain data classes & enums
│   │   │   │   ├── repositories/
│   │   │   │   │   └── Repositories.kt      # Data access layer for Exposed ORM
│   │   │   │   ├── routes/
│   │   │   │   │   └── ApiRoutes.kt         # REST endpoint controllers & role security guards
│   │   │   │   ├── services/
│   │   │   │   │   └── LibraryService.kt    # Transactional business logic & seed manager
│   │   │   │   └── validation/
│   │   │   │       └── Validation.kt        # Strict input validator functions
│   │   │   └── resources/
│   │   │       └── logback.xml              # SLF4J / Logback configuration
│   │   └── test/
│   │       └── kotlin/com/librarymanagement/
│   │           ├── ApiIntegrationTest.kt    # Full HTTP API test suite using Ktor test engine
│   │           └── LibraryServiceTest.kt    # Service business logic and invariant unit tests
│   ├── build.gradle.kts          # Backend dependencies and plugins
│   └── Dockerfile                # Multi-stage Gradle JRE 17 container
│
├── console/                      # Kotlin interactive CLI client
│   ├── src/main/kotlin/com/librarymanagement/console/
│   │   └── ConsoleApp.kt         # Terminal CLI with menu-driven book & student operations
│   └── build.gradle.kts          # Console module build configuration
│
├── android/                      # Jetpack Compose mobile application
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/librarymanagement/android/
│   │   │   │   ├── MainActivity.kt          # Compose UI host activity
│   │   │   │   ├── data/
│   │   │   │   │   ├── ApiService.kt        # Retrofit HTTP client definition
│   │   │   │   │   └── Models.kt            # Mobile data models
│   │   │   │   ├── ui/theme/
│   │   │   │   │   └── Theme.kt             # Material 3 institutional theme
│   │   │   │   └── viewmodel/
│   │   │   │       └── LibraryViewModel.kt  # State management & coroutine flow
│   │   │   ├── res/                         # Android XML resources and icons
│   │   │   └── AndroidManifest.xml          # Permissions & activity manifest
│   │   └── build.gradle.kts      # App module dependencies
│   ├── build.gradle.kts          # Root Android build configuration
│   └── settings.gradle.kts       # Android module declarations
│
├── database/                     # Database schemas, migrations, and seed scripts
│   ├── schema/
│   │   └── schema.sql            # Clean DDL creating all 5 database tables and indexes
│   ├── migrations/
│   │   └── V1__initial_schema.sql # Standard SQL migration script
│   ├── seeds/
│   │   └── dev_seed.sql          # Sample catalog, students, and BCrypt user records
│   └── README.md                 # Complete database architecture & migration manual
│
├── docs/                         # Comprehensive engineering documentation
│   ├── ARCHITECTURE.md           # System architecture, invariants & Mermaid diagrams
│   ├── API_DOCUMENTATION.md      # Complete REST API specification with JSON examples
│   ├── DATABASE_DOCUMENTATION.md # Detailed schema documentation & ER diagrams
│   ├── AUTHENTICATION.md         # BCrypt hashing, Bearer tokens & role authorization
│   ├── DEPLOYMENT.md             # Multi-target deployment manual (Vercel, Render, VPS)
│   ├── GITHUB_UPLOAD_GUIDE.md    # Step-by-step guide for recipient to push to GitHub
│   └── USER_GUIDE.md             # Walkthrough of student and librarian workflows
│
├── scripts/                      # Cross-platform startup and build utilities
│   ├── start-all.bat             # Windows one-click launcher (Backend + Web + Browser)
│   ├── start-backend.bat         # Windows backend server launcher
│   ├── start-frontend.bat        # Windows React development server launcher
│   ├── start-console.bat         # Windows console client launcher
│   ├── start-all.ps1             # PowerShell automated launcher
│   ├── start-all.sh              # Unix/macOS launcher
│   ├── start-backend.sh          # Unix/macOS backend launcher
│   ├── start-frontend.sh         # Unix/macOS frontend launcher
│   └── start-console.sh          # Unix/macOS console launcher
│
├── gradle/wrapper/               # Portable Gradle wrapper distribution
│   ├── gradle-wrapper.jar
│   └── gradle-wrapper.properties # Configured to official Gradle 8.8 binary release
│
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Comprehensive exclusion rules for Git
├── build.gradle.kts              # Multi-project root Gradle build configuration
├── settings.gradle.kts           # Gradle root project and module settings
├── gradlew                       # Linux / macOS Gradle executable
├── gradlew.bat                   # Windows Gradle executable
├── docker-compose.yml            # Docker multi-container composition
├── LICENSE                       # Institutional ownership and licensing terms
├── CONTRIBUTING.md               # Guidelines for developers and code maintenance
├── CHANGELOG.md                  # Detailed version record and changelog
└── README.md                     # GitHub-ready master project documentation
```
