import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  ArrowUpRight,
  Filter,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  BookOpen,
  User
} from 'lucide-react';
import { api } from '../api/client';
import { Book } from '../types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchParam);

  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortAsc, setSortAsc] = useState(true);

  // View modal state
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  // Edit modal state
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editTotalCopies, setEditTotalCopies] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete modal state
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: Book[];
      if (searchQuery.trim()) {
        data = await api.searchBooks(searchQuery.trim());
      } else {
        data = await api.getBooks();
      }
      setBooks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch books catalog from backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const openViewModal = (book: Book) => {
    setViewingBook(book);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditYear(book.publicationYear.toString());
    setEditTotalCopies(book.totalCopies.toString());
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    if (!editTitle.trim() || !editAuthor.trim()) {
      setEditError('Title and author cannot be empty.');
      return;
    }
    const year = parseInt(editYear, 10);
    const copies = parseInt(editTotalCopies, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(year) || year < 1000 || year > currentYear + 1) {
      setEditError(`Publication year must be between 1000 and ${currentYear + 1}.`);
      return;
    }
    if (isNaN(copies) || copies < 0) {
      setEditError('Total copies cannot be negative.');
      return;
    }
    const issuedCopies = editingBook.totalCopies - editingBook.availableCopies;
    if (copies < issuedCopies) {
      setEditError(`Cannot reduce total copies below currently issued count (${issuedCopies}).`);
      return;
    }

    try {
      setIsSubmittingEdit(true);
      setEditError(null);
      await api.updateBook(editingBook.bookId, {
        title: editTitle.trim(),
        author: editAuthor.trim(),
        publicationYear: year,
        totalCopies: copies,
      });
      setSuccessMsg(`Book "${editTitle.trim()}" updated successfully.`);
      setEditingBook(null);
      fetchBooks();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setEditError(err.message);
      } else {
        setEditError('Failed to update book.');
      }
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      setIsDeleting(true);
      await api.deleteBook(deletingBook.bookId);
      setSuccessMsg(`Book "${deletingBook.title}" removed from catalog.`);
      setDeletingBook(null);
      fetchBooks();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete book.');
      }
      setDeletingBook(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredBooks = books.filter((b) => {
    if (availabilityFilter === 'available') return b.availableCopies > 0;
    if (availabilityFilter === 'out_of_stock') return b.availableCopies === 0;
    return true;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA === undefined || valB === undefined) return 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? ((valA as number) - (valB as number)) : ((valB as number) - (valA as number));
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Central Library • Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Books Catalog & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Structured repository of all registered titles with real-time shelf stock and circulation controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBooks}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-xs disabled:opacity-50"
            title="Reload books catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/books/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-[#C3A66B]" />
            <span>Add New Book</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 text-rose-800 dark:text-rose-400 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filter toolbar */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Title, Author, or Book ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-medium text-xs sm:text-sm transition-colors shadow-2xs"
          >
            Search
          </button>
          {searchParam && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-3 py-2 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] text-slate-600 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-white text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Filter:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#B96F50]"
            >
              <option value="all">All Titles ({books.length})</option>
              <option value="available">Available in Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Structured Books Table for Desktop */}
      <div className="hidden md:block bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EAE5D8] dark:bg-[#192A23] text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
              <tr>
                <th
                  onClick={() => handleSort('bookId')}
                  className="px-5 py-3.5 cursor-pointer hover:text-[#B96F50] dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Book ID
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('title')}
                  className="px-5 py-3.5 cursor-pointer hover:text-[#B96F50] dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Title
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('author')}
                  className="px-5 py-3.5 cursor-pointer hover:text-[#B96F50] dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Author
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('publicationYear')}
                  className="px-5 py-3.5 cursor-pointer hover:text-[#B96F50] dark:hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Year
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('availableCopies')}
                  className="px-5 py-3.5 cursor-pointer hover:text-[#B96F50] dark:hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Available / Total
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
                    Querying SQLite catalog...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No books found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {searchParam
                        ? `No books match "${searchParam}". Try another search.`
                        : 'No books have been registered yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.bookId} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-xs text-[#B96F50] dark:text-[#C3A66B]">
                      {book.bookId}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {book.title}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {book.author}
                    </td>
                    <td className="px-5 py-3.5 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
                      {book.publicationYear}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`font-bold ${book.availableCopies > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        {book.availableCopies}
                      </span>
                      <span className="text-slate-400 text-xs"> / {book.totalCopies}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                        {book.availableCopies > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {book.availableCopies > 0 && (
                          <Link
                            to={`/admin/issue?bookId=${encodeURIComponent(book.bookId)}`}
                            className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                            title="Quick Issue"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => openViewModal(book)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                          title="View Book Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-[#C3A66B] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                          title="Edit Book"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingBook(book)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Book Cards for Mobile & Tablet (< md) */}
      <div className="md:hidden grid grid-cols-1 gap-3.5">
        {loading ? (
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
            Loading catalog...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-semibold">No books found</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.bookId} className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                    {book.bookId}
                  </span>
                  <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                    {book.availableCopies > 0 ? `${book.availableCopies} in stock` : 'Out of Stock'}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{book.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {book.author} • {book.publicationYear}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total: {book.totalCopies} copies
                </span>
                <div className="flex items-center gap-1">
                  {book.availableCopies > 0 && (
                    <Link
                      to={`/admin/issue?bookId=${encodeURIComponent(book.bookId)}`}
                      className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                      title="Issue"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => openViewModal(book)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(book)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingBook(book)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. View Book Details Modal */}
      {viewingBook && (
        <Modal
          isOpen={!!viewingBook}
          onClose={() => setViewingBook(null)}
          title="Book Record Details"
        >
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD6C6] dark:border-[#334D40]">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#B96F50] dark:text-[#C3A66B] uppercase bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                  {viewingBook.bookId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{viewingBook.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{viewingBook.author}</p>
              </div>
              <Badge variant={viewingBook.availableCopies > 0 ? 'success' : 'danger'}>
                {viewingBook.availableCopies > 0 ? 'Available for Loan' : 'All Copies Borrowed'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Publication Year</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{viewingBook.publicationYear}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Total Inventory</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{viewingBook.totalCopies} copies</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <span className="text-emerald-800 dark:text-emerald-400 font-semibold block mb-1">Available on Shelf</span>
                <span className="text-sm font-bold text-emerald-950 dark:text-white">{viewingBook.availableCopies} copies</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <span className="text-amber-800 dark:text-amber-400 font-semibold block mb-1">Currently Circulating</span>
                <span className="text-sm font-bold text-amber-950 dark:text-white">{viewingBook.totalCopies - viewingBook.availableCopies} copies</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DDD6C6] dark:border-[#334D40]">
              <button
                type="button"
                onClick={() => setViewingBook(null)}
                className="px-4 py-2 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              {viewingBook.availableCopies > 0 && (
                <Link
                  to={`/admin/issue?bookId=${encodeURIComponent(viewingBook.bookId)}`}
                  className="px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C3A66B]" />
                  Proceed to Issue
                </Link>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Edit Book Modal */}
      {editingBook && (
        <Modal
          isOpen={!!editingBook}
          onClose={() => setEditingBook(null)}
          title={`Edit Book: ${editingBook.bookId}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 font-sans">
            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-medium">
                {editError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Author Name *
              </label>
              <input
                type="text"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Pub. Year *
                </label>
                <input
                  type="number"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Total Copies *
                </label>
                <input
                  type="number"
                  value={editTotalCopies}
                  onChange={(e) => setEditTotalCopies(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DDD6C6] dark:border-[#334D40]">
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="px-4 py-2 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEdit}
                className="px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Delete Book Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Book Record"
        message={`Are you sure you want to remove "${deletingBook?.title}" (${deletingBook?.bookId})? This action cannot be undone if there are active loans.`}
        confirmLabel="Delete Book"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
