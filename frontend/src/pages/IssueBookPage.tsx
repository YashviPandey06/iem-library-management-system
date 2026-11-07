import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, AlertCircle, BookOpen, User, ArrowLeft } from 'lucide-react';
import { api } from '../api/client';
import { Book, Student } from '../types';
import { Badge } from '../components/Badge';

export const IssueBookPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bookId, setBookId] = useState(searchParams.get('bookId') || '');
  const [studentId, setStudentId] = useState('');

  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [loading, setLoading] = useState(false);
  const [, setInitLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitLoading(true);
        const [bList, sList] = await Promise.all([
          api.getBooks(),
          api.getStudents(),
        ]);
        setBooks(bList);
        setStudents(sList);

        const initialBookId = searchParams.get('bookId');
        if (initialBookId) {
          const match = bList.find((b) => b.bookId.toLowerCase() === initialBookId.toLowerCase());
          if (match) setSelectedBook(match);
        }
      } catch (err: unknown) {
        console.error('Failed to load initial data', err);
      } finally {
        setInitLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const handleBookChange = (id: string) => {
    setBookId(id);
    const match = books.find((b) => b.bookId.toLowerCase() === id.trim().toLowerCase());
    setSelectedBook(match || null);
  };

  const handleStudentChange = (id: string) => {
    setStudentId(id);
    const match = students.find((s) => s.studentId.toLowerCase() === id.trim().toLowerCase());
    setSelectedStudent(match || null);
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const bId = bookId.trim();
    const sId = studentId.trim();

    if (!bId || !sId) {
      setErrorMsg('Both Book ID and Student ID are required.');
      return;
    }

    try {
      setLoading(true);
      const transaction = await api.issueBook(bId, sId);
      setSuccessMsg(
        `Success! Book "${transaction.bookTitle}" (ID: ${transaction.bookId}) was issued to Student ${transaction.studentId}. Transaction ID: ${transaction.transactionId}`
      );

      // Refresh books catalog
      const updatedBooks = await api.getBooks();
      setBooks(updatedBooks);
      const updatedBook = updatedBooks.find((b) => b.bookId.toLowerCase() === bId.toLowerCase());
      setSelectedBook(updatedBook || null);

      setTimeout(() => {
        navigate('/admin/active-issues');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to process book issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = Boolean(selectedBook && selectedBook.availableCopies <= 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <Link
          to="/admin/books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
        <span className="text-[11px] font-mono font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
          Assignment Task 4
        </span>
      </div>

      <div>
        <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
          IEM Central Library • Circulation Counter
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
          Issue Book to Student
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Verify physical shelf stock, link registered student patron, and record an atomic checkout in SQLite.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Issue Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleIssueSubmit} className="space-y-6">
            {/* Book ID input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Book ID <span className="text-rose-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Select or type code</span>
              </div>
              <input
                type="text"
                list="books-datalist"
                placeholder="e.g. B101"
                value={bookId}
                onChange={(e) => handleBookChange(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] text-slate-900 dark:text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50] transition-all"
                required
              />
              <datalist id="books-datalist">
                {books.map((b) => (
                  <option key={b.bookId} value={b.bookId}>
                    {b.title} ({b.availableCopies} available on shelf)
                  </option>
                ))}
              </datalist>
            </div>

            {/* Student ID input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Student Patron ID <span className="text-rose-600">*</span>
                </label>
                <Link to="/admin/students" className="text-[11px] text-[#B96F50] dark:text-[#C3A66B] font-semibold hover:underline">
                  + Register Student
                </Link>
              </div>
              <input
                type="text"
                list="students-datalist"
                placeholder="e.g. S101"
                value={studentId}
                onChange={(e) => handleStudentChange(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] text-slate-900 dark:text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50] transition-all"
                required
              />
              <datalist id="students-datalist">
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </datalist>
            </div>

            {/* Pre-flight Warnings */}
            {isOutOfStock && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>Cannot issue: All physical copies of this book are currently on loan.</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || isOutOfStock}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4 text-[#C3A66B]" />
                <span>{loading ? 'Executing Issue Transaction...' : 'Confirm Book Checkout'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Validation & Status Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Book Live Preview */}
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B96F50] dark:text-[#C3A66B]" />
              Live Catalog Availability
            </h3>
            {selectedBook ? (
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Title</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedBook.title}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Author</span>
                  <p className="text-slate-600 dark:text-slate-300">{selectedBook.author}</p>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Available Shelf Stock:</span>
                  <span className="font-bold text-sm text-[#B96F50] dark:text-white">
                    {selectedBook.availableCopies} / {selectedBook.totalCopies} copies
                  </span>
                </div>
                <div>
                  <Badge variant={selectedBook.availableCopies > 0 ? 'success' : 'danger'}>
                    {selectedBook.availableCopies > 0 ? 'Ready for Loan' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                Select or type a Book ID to inspect real-time inventory and availability.
              </p>
            )}
          </div>

          {/* Selected Student Live Preview */}
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#C3A66B]" />
              Student Patron Verification
            </h3>
            {selectedStudent ? (
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Full Name</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedStudent.name}</p>
                </div>
                {selectedStudent.email && (
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">Email</span>
                    <p className="text-slate-600 dark:text-slate-300 font-mono text-xs">{selectedStudent.email}</p>
                  </div>
                )}
                <div className="pt-1">
                  <Badge variant="info">Verified IEM Patron</Badge>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                Select or type a Student ID to verify membership and loan eligibility.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
