package com.librarymanagement.android.data

import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface LibraryApiService {

    @GET("books")
    suspend fun getBooks(): ApiResponse<List<Book>>

    @GET("books/search")
    suspend fun searchBooks(@Query("q") query: String): ApiResponse<List<Book>>

    @POST("books")
    suspend fun createBook(@Body request: BookCreateRequest): ApiResponse<Book>

    @POST("issues")
    suspend fun issueBook(@Body request: IssueBookRequest): ApiResponse<IssueTransaction>

    @POST("returns")
    suspend fun returnBook(@Body request: ReturnBookRequest): ApiResponse<IssueTransaction>

    @GET("issues/active")
    suspend fun getActiveIssues(): ApiResponse<List<IssueTransaction>>

    @GET("students")
    suspend fun getStudents(): ApiResponse<List<Student>>

    @GET("dashboard/stats")
    suspend fun getStats(): ApiResponse<DashboardStats>
}

object ApiClient {
    // 10.0.2.2 connects from Android emulator to host machine localhost
    var baseUrl: String = "http://10.0.2.2:8080/api/"
        set(value) {
            field = if (!value.endsWith("/")) "$value/" else value
            serviceInstance = createService(field)
        }

    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        encodeDefaults = true
    }

    private fun createService(url: String): LibraryApiService {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .build()

        val contentType = "application/json".toMediaType()

        return Retrofit.Builder()
            .baseUrl(url)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
            .create(LibraryApiService::class.java)
    }

    private var serviceInstance: LibraryApiService = createService(baseUrl)

    val service: LibraryApiService
        get() = serviceInstance
}
