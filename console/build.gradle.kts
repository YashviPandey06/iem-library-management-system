plugins {
    kotlin("jvm")
    application
}

application {
    mainClass.set("com.librarymanagement.console.ConsoleAppKt")
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(21)
}
