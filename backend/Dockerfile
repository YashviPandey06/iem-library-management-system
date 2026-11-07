# Multi-stage Dockerfile for Kotlin Ktor Backend
# Build stage
FROM gradle:8.8-jdk17 AS builder
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts gradlew gradlew.bat ./
COPY gradle ./gradle
COPY backend ./backend
COPY console ./console
RUN gradle :backend:installDist --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache sqlite
COPY --from=builder /app/backend/build/install/backend /app
EXPOSE 8080
VOLUME /app/data
ENV PORT=8080
ENV DATABASE_PATH=/app/data/library.db
CMD ["/app/bin/backend"]
