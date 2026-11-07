export type UserRole = 'LIBRARIAN' | 'STUDENT';

export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Book {
  id: number;
  bookId: string;
  title: string;
  author: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  createdAt?: string;
}

export interface IssueTransaction {
  id: number;
  transactionId: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName?: string;
  issueDate: string;
  returnDate?: string | null;
  status: 'ISSUED' | 'RETURNED';
  createdAt?: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalAvailableCopies: number;
  totalIssuedCopies: number;
  totalStudents: number;
  totalReturnedCount: number;
}

export interface PopularBook {
  bookId: string;
  title: string;
  author: string;
  issueCount: number;
  availableCopies: number;
}

export interface ActivityItem {
  id: string;
  type: 'ISSUE' | 'RETURN' | 'BOOK_ADDED' | 'STUDENT_ADDED';
  title: string;
  description: string;
  timestamp: string;
}

export interface StudentDashboardSummary {
  student: Student;
  activeLoans: IssueTransaction[];
  totalBorrowedCount: number;
  returnedCount: number;
  history: IssueTransaction[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
