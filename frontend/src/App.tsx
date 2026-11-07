import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { PublicCatalogPage } from './pages/public/PublicCatalogPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { UnauthorizedPage } from './pages/public/UnauthorizedPage';

// Student Portal
import { StudentLayout } from './components/StudentLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCatalogPage } from './pages/student/StudentCatalogPage';
import { StudentMyBooksPage } from './pages/student/StudentMyBooksPage';
import { StudentHistoryPage } from './pages/student/StudentHistoryPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Librarian Administration Portal
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BooksPage } from './pages/BooksPage';
import { AddBookPage } from './pages/AddBookPage';
import { IssueBookPage } from './pages/IssueBookPage';
import { ReturnBookPage } from './pages/ReturnBookPage';
import { IssuedBooksPage } from './pages/IssuedBooksPage';
import { StudentsPage } from './pages/StudentsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalog" element={<PublicCatalogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Student Portal (Gated for STUDENT role) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="catalog" element={<StudentCatalogPage />} />
            <Route path="my-books" element={<StudentMyBooksPage />} />
            <Route path="history" element={<StudentHistoryPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
          </Route>

          {/* Librarian Administration Portal (Gated for LIBRARIAN role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/add" element={<AddBookPage />} />
            <Route path="issue" element={<IssueBookPage />} />
            <Route path="return" element={<ReturnBookPage />} />
            <Route path="active-issues" element={<IssuedBooksPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Backward compatibility redirects */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/books" element={<Navigate to="/admin/books" replace />} />
          <Route path="/add-book" element={<Navigate to="/admin/books/add" replace />} />
          <Route path="/issue" element={<Navigate to="/admin/issue" replace />} />
          <Route path="/return" element={<Navigate to="/admin/return" replace />} />
          <Route path="/issued" element={<Navigate to="/admin/active-issues" replace />} />
          <Route path="/students" element={<Navigate to="/admin/students" replace />} />
          <Route path="/transactions" element={<Navigate to="/admin/transactions" replace />} />
          <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </HashRouter>
  );
};

export default App;
