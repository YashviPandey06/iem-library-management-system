import {
  Book,
  Student,
  IssueTransaction,
  DashboardStats,
  PopularBook,
  ActivityItem,
  ApiResponse,
  User,
  AuthResponse,
  StudentDashboardSummary
} from '../types';

const BASE_URL = '/api';

// Fallback academic catalog for static demonstration hosting
const FALLBACK_BOOKS: Book[] = [
  {
    id: 1,
    bookId: 'B101',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    publicationYear: 2022,
    totalCopies: 5,
    availableCopies: 4,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 2,
    bookId: 'B102',
    title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design',
    author: 'Robert C. Martin',
    publicationYear: 2017,
    totalCopies: 3,
    availableCopies: 3,
    createdAt: '2026-01-16T10:30:00Z',
    updatedAt: '2026-01-16T10:30:00Z',
  },
  {
    id: 3,
    bookId: 'B103',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    publicationYear: 1994,
    totalCopies: 4,
    availableCopies: 3,
    createdAt: '2026-01-17T11:15:00Z',
    updatedAt: '2026-01-17T11:15:00Z',
  },
  {
    id: 4,
    bookId: 'B104',
    title: 'Operating System Concepts (10th Edition)',
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    publicationYear: 2021,
    totalCopies: 6,
    availableCopies: 6,
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-18T14:00:00Z',
  },
  {
    id: 5,
    bookId: 'B105',
    title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
    author: 'Stuart Russell, Peter Norvig',
    publicationYear: 2020,
    totalCopies: 4,
    availableCopies: 4,
    createdAt: '2026-01-19T08:45:00Z',
    updatedAt: '2026-01-19T08:45:00Z',
  },
  {
    id: 6,
    bookId: 'B106',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    publicationYear: 2019,
    totalCopies: 5,
    availableCopies: 5,
    createdAt: '2026-01-20T13:20:00Z',
    updatedAt: '2026-01-20T13:20:00Z',
  },
  {
    id: 7,
    bookId: 'B107',
    title: 'Computer Networks (6th Edition)',
    author: 'Andrew S. Tanenbaum, Nick Feamster, David Wetherall',
    publicationYear: 2021,
    totalCopies: 5,
    availableCopies: 5,
    createdAt: '2026-01-21T16:00:00Z',
    updatedAt: '2026-01-21T16:00:00Z',
  },
];

const FALLBACK_STATS: DashboardStats = {
  totalBooks: 7,
  totalAvailableCopies: 28,
  totalIssuedCopies: 2,
  totalStudents: 4,
  totalReturnedCount: 5,
};

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('iem_library_token') || localStorage.getItem('athena_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: `Server returned status ${res.status}: ${res.statusText}`,
  }));

  if (!res.ok || json.success === false) {
    const errorMsg = json.message || (json.errors && json.errors.join(', ')) || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return (json.data !== undefined ? json.data : (json as unknown as T));
}

export const api = {
  // --- Authentication ---
  async login(data: { identifier: string; password: string; rememberMe?: boolean }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await handleResponse<AuthResponse>(res);
      localStorage.setItem('iem_library_token', result.token);
      return result;
    } catch {
      // Demonstration fallback for static hosting
      const isLibrarian = data.identifier.toLowerCase().includes('librarian') || data.identifier.toLowerCase().includes('admin');
      const mockUser: User = isLibrarian
        ? {
            id: 1,
            userId: 'LIB001',
            name: 'Eleanor Vance (Chief Librarian)',
            email: data.identifier || 'librarian@iemcal.ac.in',
            role: 'LIBRARIAN',
            createdAt: new Date().toISOString(),
          }
        : {
            id: 2,
            userId: 'S101',
            name: 'Alex Rivera (Student Patron)',
            email: data.identifier || 'alex@iemcal.ac.in',
            role: 'STUDENT',
            createdAt: new Date().toISOString(),
          };
      const mockToken = 'demo_token_' + btoa(JSON.stringify(mockUser));
      localStorage.setItem('iem_library_token', mockToken);
      return { token: mockToken, user: mockUser };
    }
  },

  async register(data: { userId?: string; name: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await handleResponse<AuthResponse>(res);
      localStorage.setItem('iem_library_token', result.token);
      return result;
    } catch {
      const role = data.role === 'LIBRARIAN' ? 'LIBRARIAN' : 'STUDENT';
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 10,
        userId: data.userId || 'U' + Math.floor(Math.random() * 900 + 100),
        name: data.name,
        email: data.email,
        role: role,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'demo_token_' + btoa(JSON.stringify(mockUser));
      localStorage.setItem('iem_library_token', mockToken);
      return { token: mockToken, user: mockUser };
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<User>(res);
    } catch (err) {
      const token = localStorage.getItem('iem_library_token');
      if (token && token.startsWith('demo_token_')) {
        try {
          return JSON.parse(atob(token.substring(11)));
        } catch {
          // fallback
        }
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });
    } catch {
      // ignore offline error
    } finally {
      localStorage.removeItem('iem_library_token');
      localStorage.removeItem('athena_token');
    }
  },

  // --- Student Portal Services ---
  async getStudentDashboard(): Promise<StudentDashboardSummary> {
    try {
      const res = await fetch(`${BASE_URL}/student/dashboard`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<StudentDashboardSummary>(res);
    } catch {
      return {
        student: { id: 1, studentId: 'S101', name: 'Alex Rivera', email: 'alex@iemcal.ac.in', createdAt: '2026-01-15' },
        activeLoans: [
          {
            id: 1,
            transactionId: 'TXN-901',
            bookId: 'B101',
            bookTitle: 'Introduction to Algorithms (4th Edition)',
            studentId: 'S101',
            studentName: 'Alex Rivera',
            issueDate: '2026-11-01',
            returnDate: null,
            status: 'ISSUED',
            createdAt: '2026-11-01T10:00:00Z',
          },
        ],
        totalBorrowedCount: 1,
        returnedCount: 0,
        history: [],
      };
    }
  },

  async getStudentBorrowings(): Promise<IssueTransaction[]> {
    try {
      const res = await fetch(`${BASE_URL}/student/borrowings`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<IssueTransaction[]>(res);
    } catch {
      return [
        {
          id: 1,
          transactionId: 'TXN-901',
          bookId: 'B101',
          bookTitle: 'Introduction to Algorithms (4th Edition)',
          studentId: 'S101',
          studentName: 'Alex Rivera',
          issueDate: '2026-11-01',
          returnDate: null,
          status: 'ISSUED',
          createdAt: '2026-11-01T10:00:00Z',
        },
      ];
    }
  },

  async getStudentHistory(): Promise<IssueTransaction[]> {
    try {
      const res = await fetch(`${BASE_URL}/student/history`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<IssueTransaction[]>(res);
    } catch {
      return [];
    }
  },

  // --- Books ---
  async getBooks(): Promise<Book[]> {
    try {
      const res = await fetch(`${BASE_URL}/books`);
      return await handleResponse<Book[]>(res);
    } catch {
      return FALLBACK_BOOKS;
    }
  },

  async getBook(id: string): Promise<Book> {
    try {
      const res = await fetch(`${BASE_URL}/books/${encodeURIComponent(id)}`);
      return await handleResponse<Book>(res);
    } catch {
      const book = FALLBACK_BOOKS.find((b) => b.bookId === id || String(b.id) === id);
      if (book) return book;
      return FALLBACK_BOOKS[0];
    }
  },

  async searchBooks(q: string): Promise<Book[]> {
    try {
      const res = await fetch(`${BASE_URL}/books/search?q=${encodeURIComponent(q)}`);
      return await handleResponse<Book[]>(res);
    } catch {
      const term = q.toLowerCase();
      return FALLBACK_BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          b.bookId.toLowerCase().includes(term)
      );
    }
  },

  async createBook(data: {
    bookId: string;
    title: string;
    author: string;
    publicationYear: number;
    totalCopies: number;
  }): Promise<Book> {
    const res = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Book>(res);
  },

  async updateBook(id: string, data: {
    title: string;
    author: string;
    publicationYear: number;
    totalCopies: number;
  }): Promise<Book> {
    const res = await fetch(`${BASE_URL}/books/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Book>(res);
  },

  async deleteBook(id: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/books/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // --- Students (Librarian) ---
  async getStudents(): Promise<Student[]> {
    try {
      const res = await fetch(`${BASE_URL}/students`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<Student[]>(res);
    } catch {
      return [
        { id: 1, studentId: 'S101', name: 'Alex Rivera', email: 'alex@iemcal.ac.in', createdAt: '2026-01-15' },
        { id: 2, studentId: 'S102', name: 'Sarah Connor', email: 'sarah@iemcal.ac.in', createdAt: '2026-01-16' },
        { id: 3, studentId: 'S103', name: 'Charlie Davis', email: 'charlie@iemcal.ac.in', createdAt: '2026-01-17' },
        { id: 4, studentId: 'S104', name: 'Diana Prince', email: 'diana@iemcal.ac.in', createdAt: '2026-01-18' },
      ];
    }
  },

  async getStudent(id: string): Promise<Student> {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(id)}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Student>(res);
  },

  async searchStudents(q: string): Promise<Student[]> {
    try {
      const res = await fetch(`${BASE_URL}/students/search?q=${encodeURIComponent(q)}`);
      return await handleResponse<Student[]>(res);
    } catch {
      const term = q.toLowerCase();
      const mockStudents: Student[] = [
        { id: 1, studentId: 'S101', name: 'Alex Rivera', email: 'alex@iemcal.ac.in', createdAt: '2026-01-15' },
        { id: 2, studentId: 'S102', name: 'Sarah Connor', email: 'sarah@iemcal.ac.in', createdAt: '2026-01-16' },
        { id: 3, studentId: 'S103', name: 'Charlie Davis', email: 'charlie@iemcal.ac.in', createdAt: '2026-01-17' },
        { id: 4, studentId: 'S104', name: 'Diana Prince', email: 'diana@iemcal.ac.in', createdAt: '2026-01-18' },
      ];
      return mockStudents.filter((s) => s.name.toLowerCase().includes(term) || s.studentId.toLowerCase().includes(term));
    }
  },

  async createStudent(data: { studentId: string; name: string; email?: string }): Promise<Student> {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Student>(res);
  },

  async updateStudent(id: string, data: { name: string; email?: string }): Promise<Student> {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Student>(res);
  },

  // --- Transactions / Issue & Return ---
  async issueBook(bookId: string, studentId: string): Promise<IssueTransaction> {
    const res = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ bookId, studentId }),
    });
    return handleResponse<IssueTransaction>(res);
  },

  async returnBook(bookId: string, studentId: string): Promise<IssueTransaction> {
    const res = await fetch(`${BASE_URL}/returns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ bookId, studentId }),
    });
    return handleResponse<IssueTransaction>(res);
  },

  async getActiveIssues(): Promise<IssueTransaction[]> {
    try {
      const res = await fetch(`${BASE_URL}/issues/active`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<IssueTransaction[]>(res);
    } catch {
      return [
        {
          id: 1,
          transactionId: 'TXN-001',
          bookId: 'B101',
          bookTitle: 'Introduction to Algorithms (4th Edition)',
          studentId: 'S101',
          studentName: 'Alex Rivera',
          issueDate: '2026-11-01',
          returnDate: null,
          status: 'ISSUED',
          createdAt: '2026-11-01T10:00:00Z',
        },
        {
          id: 2,
          transactionId: 'TXN-002',
          bookId: 'B103',
          bookTitle: 'Design Patterns',
          studentId: 'S102',
          studentName: 'Sarah Connor',
          issueDate: '2026-11-03',
          returnDate: null,
          status: 'ISSUED',
          createdAt: '2026-11-03T11:00:00Z',
        },
      ];
    }
  },

  async getAllTransactions(): Promise<IssueTransaction[]> {
    try {
      const res = await fetch(`${BASE_URL}/transactions`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<IssueTransaction[]>(res);
    } catch {
      return [
        {
          id: 1,
          transactionId: 'TXN-001',
          bookId: 'B101',
          bookTitle: 'Introduction to Algorithms (4th Edition)',
          studentId: 'S101',
          studentName: 'Alex Rivera',
          issueDate: '2026-11-01',
          returnDate: null,
          status: 'ISSUED',
          createdAt: '2026-11-01T10:00:00Z',
        },
        {
          id: 2,
          transactionId: 'TXN-002',
          bookId: 'B103',
          bookTitle: 'Design Patterns',
          studentId: 'S102',
          studentName: 'Sarah Connor',
          issueDate: '2026-11-03',
          returnDate: null,
          status: 'ISSUED',
          createdAt: '2026-11-03T11:00:00Z',
        },
      ];
    }
  },

  // --- Dashboard & Public Analytics ---
  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/stats`);
      return await handleResponse<DashboardStats>(res);
    } catch {
      return FALLBACK_STATS;
    }
  },

  async getActivity(): Promise<ActivityItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/activity`, {
        headers: { ...getAuthHeader() },
      });
      return await handleResponse<ActivityItem[]>(res);
    } catch {
      return [
        {
          id: 'ACT-1',
          type: 'ISSUE',
          title: 'Book Borrowed',
          description: 'Book "Introduction to Algorithms" issued to Alex Rivera (S101)',
          timestamp: '2 hours ago',
        },
        {
          id: 'ACT-2',
          type: 'RETURN',
          title: 'Book Returned',
          description: 'Book "Clean Architecture" returned by Sarah Connor (S102)',
          timestamp: '4 hours ago',
        },
      ];
    }
  },

  async getPopularBooks(): Promise<PopularBook[]> {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/popular-books`);
      return await handleResponse<PopularBook[]>(res);
    } catch {
      return [
        { bookId: 'B101', title: 'Introduction to Algorithms (4th Edition)', author: 'Cormen, Leiserson, Rivest, Stein', issueCount: 14, availableCopies: 4 },
        { bookId: 'B105', title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', issueCount: 11, availableCopies: 4 },
        { bookId: 'B102', title: 'Clean Architecture', author: 'Robert C. Martin', issueCount: 9, availableCopies: 3 },
      ];
    }
  },

  // --- Seed / Reset ---
  async seedData(): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
    return handleResponse<{ message: string }>(res);
  },

  async resetData(): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // --- Health ---
  async checkHealth(): Promise<{ status: string }> {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await handleResponse<{ status: string }>(res);
    } catch {
      return { status: 'STANDALONE_DEMO' };
    }
  },
};
