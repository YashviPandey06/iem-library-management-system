# Project Changelog & Release Record
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

All notable engineering developments and architectural milestones for this application are documented in this file.

---

## [Current Release] - Complete Full-Stack Implementation

### 1. Brand Identity & Visual System
- **Official Institutional Branding**: Unified application identity around **Institute of Engineering & Management (IEM), Kolkata**.
- **Living Library Experience**: Implemented a sophisticated, multi-layered digital library atmosphere with interactive 3D perspective book cards, floating books, and parallax canvas elements.
- **Academic Palette**: Styled using institutional warm ivory (`#F5F0E5`), deep evergreen (`#192A23`), and terracotta accents.
- **Official IEM Logo**: Integrated genuine vector/high-resolution institutional emblem across public navigation bar, authentication screen, dashboards, and footers.

### 2. Frontend Web Application (React 18 + Vite)
- **Public Book Catalog**: Real-time searchable book inventory with filter controls, availability badges, and interactive 3D modal views.
- **Animated Authentication Portal**: Immersive login interface featuring floating books and role-based redirect.
- **Student Patron Dashboard**: Personalized patron console with active book loans, borrowing history, and account overview.
- **Librarian Administration Console**: Real-time circulation analytics, book creation/editing modals, issue/return processing, and student registry audit.
- **Responsive Layout**: Designed for mobile (390px), tablet (1024px), and desktop (1440px+) viewports.

### 3. Backend Microservice (Kotlin + Ktor)
- **Netty HTTP Engine**: Lightweight asynchronous server running on port 8080.
- **Role-Based Access Control**: Strict separation between `LIBRARIAN` and `STUDENT` roles using SHA-256 bearer session tokens.
- **Cryptographic Security**: Salted 12-round BCrypt password hashing (`$2a$12$...`).
- **Physical Inventory Conservation Invariant**: Atomic transactions guaranteeing `0 <= availableCopies <= totalCopies` with coroutine Mutex isolation.
- **Automated Seeding**: Default development accounts (`librarian@iemcal.ac.in` and `alex@iemcal.ac.in`) and textbook catalog populated on startup.

### 4. Persistence & Database (SQLite + Exposed ORM)
- **Exposed ORM Integration**: Type-safe table definitions for `books`, `students`, `transactions`, `users`, and `user_sessions`.
- **Zero-Config Storage**: Single-file SQLite database with automatic schema creation and missing column synchronization.
- **Standalone SQL Suite**: Standalone DDL (`schema.sql`), migration (`V1__initial_schema.sql`), and sample data (`dev_seed.sql`).

### 5. Multi-Client Ecosystem
- **Kotlin Console Client**: Command-line interactive terminal client (`console/`) with menu-driven book management and student registration.
- **Jetpack Compose Android Application**: Native mobile app module (`android/`) with Material 3 styling and Retrofit API client.

### 6. Packaging & Developer Tooling
- **One-Click Launch Scripts**: Portable Windows `.bat` and Unix `.sh` scripts.
- **Multi-Stage Containerization**: Production Dockerfiles for backend and frontend with `docker-compose.yml`.
- **Comprehensive Documentation**: Complete architecture diagrams, API specifications, and database manuals.
