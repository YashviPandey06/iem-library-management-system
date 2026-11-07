import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, BookPlus } from 'lucide-react';
import { api } from '../api/client';

export const AddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [totalCopies, setTotalCopies] = useState('1');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    const trimmedId = bookId.trim();
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedId) {
      errors.bookId = 'Book ID is required.';
    } else if (trimmedId.length < 2) {
      errors.bookId = 'Book ID must be at least 2 characters long.';
    }

    if (!trimmedTitle) {
      errors.title = 'Book title is required.';
    }

    if (!trimmedAuthor) {
      errors.author = 'Author name is required.';
    }

    const year = parseInt(publicationYear, 10);
    const currentYear = new Date().getFullYear();
    if (!publicationYear || isNaN(year)) {
      errors.publicationYear = 'A valid publication year is required.';
    } else if (year < 1000 || year > currentYear + 1) {
      errors.publicationYear = `Publication year must be between 1000 and ${currentYear + 1}.`;
    }

    const copies = parseInt(totalCopies, 10);
    if (!totalCopies || isNaN(copies)) {
      errors.totalCopies = 'Available copies must be a valid number.';
    } else if (copies < 0) {
      errors.totalCopies = 'Number of available copies cannot be negative.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    try {
      setLoading(true);
      const newBook = await api.createBook({
        bookId: bookId.trim(),
        title: title.trim(),
        author: author.trim(),
        publicationYear: parseInt(publicationYear, 10),
        totalCopies: parseInt(totalCopies, 10),
      });

      setSuccessMsg(`Book "${newBook.title}" (ID: ${newBook.bookId}) successfully registered in inventory!`);
      setBookId('');
      setTitle('');
      setAuthor('');
      setPublicationYear('');
      setTotalCopies('1');
      setFieldErrors({});

      setTimeout(() => {
        navigate('/admin/books');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected error occurred while adding the book.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <Link
          to="/admin/books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
        <span className="text-[11px] font-mono font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
          Assignment Task 1
        </span>
      </div>

      <div>
        <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
          IEM Central Library • Acquisition Desk
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
          Register New Book
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Add a unique academic volume to the IEM central library database with validated copy counts.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book ID field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Book ID <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Unique alphanumeric code (e.g. B101, CS202)</span>
            </div>
            <input
              type="text"
              placeholder="e.g. B105"
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value.toUpperCase());
                if (fieldErrors.bookId) setFieldErrors({ ...fieldErrors, bookId: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                fieldErrors.bookId
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-[#DDD6C6] dark:border-[#334D40] focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]'
              }`}
            />
            {fieldErrors.bookId && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{fieldErrors.bookId}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Book Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Clean Code: A Handbook of Agile Software Craftsmanship"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                fieldErrors.title
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-[#DDD6C6] dark:border-[#334D40] focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]'
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{fieldErrors.title}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Author Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Robert C. Martin"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                if (fieldErrors.author) setFieldErrors({ ...fieldErrors, author: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                fieldErrors.author
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-[#DDD6C6] dark:border-[#334D40] focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]'
              }`}
            />
            {fieldErrors.author && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{fieldErrors.author}</p>
            )}
          </div>

          {/* Year & Copies in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Publication Year <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 2008"
                min="1000"
                max={new Date().getFullYear() + 1}
                value={publicationYear}
                onChange={(e) => {
                  setPublicationYear(e.target.value);
                  if (fieldErrors.publicationYear) setFieldErrors({ ...fieldErrors, publicationYear: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                  fieldErrors.publicationYear
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-[#DDD6C6] dark:border-[#334D40] focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]'
                }`}
              />
              {fieldErrors.publicationYear && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{fieldErrors.publicationYear}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Number of Copies <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                min="0"
                value={totalCopies}
                onChange={(e) => {
                  setTotalCopies(e.target.value);
                  if (fieldErrors.totalCopies) setFieldErrors({ ...fieldErrors, totalCopies: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                  fieldErrors.totalCopies
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-[#DDD6C6] dark:border-[#334D40] focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]'
                }`}
              />
              {fieldErrors.totalCopies && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{fieldErrors.totalCopies}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
            <Link
              to="/admin/books"
              className="px-5 py-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              <BookPlus className="w-4 h-4 text-[#C3A66B]" />
              <span>{loading ? 'Registering...' : 'Add Book to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
