import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Filter, Eye, RefreshCw, User, Info } from 'lucide-react';
import { api } from '../../api/client';
import { Book } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const StudentCatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let data: Book[];
      if (searchQuery.trim()) {
        data = await api.searchBooks(searchQuery.trim());
      } else {
        data = await api.getBooks();
      }
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books for student', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  const filteredBooks = books.filter((b) => {
    if (availabilityFilter === 'available') return b.availableCopies > 0;
    if (availabilityFilter === 'out_of_stock') return b.availableCopies === 0;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Central Library • Repository Search
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Browse Academic Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Search all registered engineering, management, and foundational science titles across IEM campuses.
          </p>
        </div>

        <button
          onClick={fetchBooks}
          disabled={loading}
          className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto"
          title="Refresh catalog"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Desk Notice */}
      <div className="p-3.5 rounded-xl bg-[#EAE5D8] dark:bg-[#B96F50]/20 border border-[#DDD6C6] dark:border-[#B96F50]/40 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-[#B96F50] dark:text-[#C3A66B]" />
        <span>To borrow any available volume, note the <strong>Book ID</strong> and present your IEM student identity card at the circulation desk.</span>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl p-4 border border-[#DDD6C6] dark:border-[#334D40] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter:</span>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value as any)}
            className="bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-white outline-none focus:border-[#B96F50]"
          >
            <option value="all">All Titles ({books.length})</option>
            <option value="available">Available on Shelf Only</option>
            <option value="out_of_stock">All Copies Issued</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl py-12 text-center text-slate-500 dark:text-slate-400 text-xs border border-[#DDD6C6] dark:border-[#334D40] shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
          Loading library catalog...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl py-12 text-center text-slate-500 dark:text-slate-400 border border-[#DDD6C6] dark:border-[#334D40] shadow-xs">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No books found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try another search term or reset the status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => (
            <div
              key={book.bookId}
              className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl p-5 border border-[#DDD6C6] dark:border-[#334D40] shadow-xs hover:border-[#B96F50] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                    {book.bookId}
                  </span>
                  <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of Stock'}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#B96F50] dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {book.author}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono">
                  Pub. Year: {book.publicationYear}
                </span>
                <button
                  onClick={() => setViewingBook(book)}
                  className="px-3 py-1.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-slate-50 dark:bg-white/5 hover:bg-[#B96F50] hover:text-white text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Details Modal */}
      {viewingBook && (
        <Modal
          isOpen={!!viewingBook}
          onClose={() => setViewingBook(null)}
          title="Catalog Title Details"
        >
          <div className="space-y-4 font-sans">
            <div className="flex items-start justify-between pb-3 border-b border-[#DDD6C6] dark:border-[#334D40]">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#B96F50] dark:text-[#C3A66B] uppercase bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                  {viewingBook.bookId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{viewingBook.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{viewingBook.author}</p>
              </div>
              <Badge variant={viewingBook.availableCopies > 0 ? 'success' : 'danger'}>
                {viewingBook.availableCopies > 0 ? 'Available for Checkout' : 'All Copies Borrowed'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Publication Year</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{viewingBook.publicationYear}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Total Copies</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{viewingBook.totalCopies} copies</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <span className="text-emerald-800 dark:text-emerald-400 font-semibold block mb-1">Available on Shelf</span>
                <span className="text-sm font-bold text-emerald-950 dark:text-white">{viewingBook.availableCopies} units</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <span className="text-amber-800 dark:text-amber-400 font-semibold block mb-1">Circulating</span>
                <span className="text-sm font-bold text-amber-950 dark:text-white">{viewingBook.totalCopies - viewingBook.availableCopies} units</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#DDD6C6] dark:border-[#334D40] text-xs text-slate-600 dark:text-slate-400">
              <span>Present ID <strong className="text-slate-900 dark:text-white">{viewingBook.bookId}</strong> at IEM Circulation Desk.</span>
              <button
                type="button"
                onClick={() => setViewingBook(null)}
                className="px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-bold text-xs shadow-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
