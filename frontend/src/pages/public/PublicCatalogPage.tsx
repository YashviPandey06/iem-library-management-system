import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  Sun,
  Moon,
  ArrowLeft,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import { api } from '../../api/client';
import { Book } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { useTheme } from '../../context/ThemeContext';
import { PhysicalBookItem } from '../../components/PhysicalBookItem';
import { InfiniteLibrarySectionBackground } from '../../components/background/InfiniteLibrarySectionBackground';

export const PublicCatalogPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'list'>('3d');
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books catalog', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }
    try {
      setLoading(true);
      const results = await api.searchBooks(searchQuery.trim());
      setBooks(results);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books
    .filter((b) => {
      if (availabilityFilter === 'available') return b.availableCopies > 0;
      if (availabilityFilter === 'out_of_stock') return b.availableCopies === 0;
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#0A1410] text-[#FFFDF8] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0E1B15]/95 backdrop-blur-md border-b border-[#C3A66B]/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-subtle">
        <Link to="/" className="flex items-center gap-3.5 group">
          <img
            src="/iem-logo-white.webp"
            alt="Institute of Engineering & Management (IEM), Kolkata"
            className="h-10 sm:h-11 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col border-l border-[#C3A66B]/35 pl-3.5 text-left">
            <span className="font-serif font-bold text-[#FFFDF8] text-sm sm:text-base tracking-tight leading-tight uppercase">
              LIBRARY MANAGEMENT SYSTEM
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#D6C5A3] tracking-normal leading-tight mt-0.5">
              Institute of Engineering & Management, Kolkata
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-xs sm:text-sm font-medium text-[#E0D7C3]">
          <Link to="/" className="hover:text-[#C3A66B] text-[#D6C5A3] transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="text-[#FFFDF8] font-serif font-bold">
            Holdings Catalogue
          </Link>
          <Link to="/about" className="hover:text-[#C3A66B] text-[#D6C5A3] transition-colors">
            About IEM Library
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#1A3328] border border-[#C3A66B]/35 transition-colors"
            title={isDark ? 'Switch to Parchment Day Theme' : 'Switch to Botanical Night Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D6C5A3]" /> : <Moon className="w-4 h-4 text-[#D6C5A3]" />}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#FFFDF8] bg-[#162B21] hover:bg-[#203D2F] transition-colors border border-[#C3A66B]/40"
          >
            Patron / Staff Login
          </Link>
        </div>
      </header>

      {/* Main Content with Infinite Library Background */}
      <InfiniteLibrarySectionBackground variant="catalog" className="flex-1 py-8">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 space-y-6">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#C3A66B]/30">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/" className="text-xs text-[#D6C5A3] hover:text-[#FFFDF8] flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Home
                </Link>
                <span className="text-[#C3A66B]/50 text-xs">/</span>
                <span className="text-xs text-[#FFFDF8] font-semibold">Catalogue</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FFFDF8] tracking-tight">
                Central Library Holdings & Stacks
              </h1>
              <p className="text-xs sm:text-sm text-[#D6C5A3] mt-1 font-light">
                Deterministic real-time availability of verified departmental texts and academic reference works.
              </p>
            </div>

            {/* View Mode Toggle: 3D Stacks vs Flat List */}
            <div className="flex items-center gap-2 bg-[#0E1C16]/90 p-1.5 rounded-xl border border-[#C3A66B]/30 shadow-xs backdrop-blur-md">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === '3d'
                    ? 'bg-[#1E3E33] text-[#FFFDF8] shadow-xs border border-[#C3A66B]/40'
                    : 'text-[#D6C5A3] hover:text-[#FFFDF8]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#C3A66B]" />
                <span>3D Books Stacks</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#1E3E33] text-[#FFFDF8] shadow-xs border border-[#C3A66B]/40'
                    : 'text-[#D6C5A3] hover:text-[#FFFDF8]'
                }`}
              >
                <List className="w-3.5 h-3.5 text-[#C3A66B]" />
                <span>Catalogue Cards</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#102219]/90 rounded-2xl p-4 sm:p-5 border border-[#C3A66B]/30 shadow-card flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between backdrop-blur-md">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D6C5A3]" />
              <input
                type="text"
                placeholder="Search by title, author, or book ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-[#091510] border border-[#C3A66B]/30 text-xs sm:text-sm text-[#FFFDF8] placeholder-[#9E978B] focus:outline-none focus:ring-2 focus:ring-[#C3A66B]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#A65F45] text-white text-xs font-semibold hover:bg-[#8E4F39] transition-colors shadow-xs"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#E0D7C3]">
                <Filter className="w-4 h-4 text-[#C3A66B]" />
                <span>Availability:</span>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                  className="bg-[#091510] border border-[#C3A66B]/30 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-[#FFFDF8] outline-none focus:border-[#C3A66B]"
                >
                  <option value="all">All Volumes ({books.length})</option>
                  <option value="available">On Shelf Only</option>
                  <option value="out_of_stock">All Checked Out</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#E0D7C3]">
                <span>Sort:</span>
                <select
                  value={`${sortField}-${sortAsc ? 'asc' : 'desc'}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortField(field as keyof Book);
                    setSortAsc(order === 'asc');
                  }}
                  className="bg-[#091510] border border-[#C3A66B]/30 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-[#FFFDF8] outline-none focus:border-[#C3A66B]"
                >
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="author-asc">Author (A-Z)</option>
                  <option value="publicationYear-desc">Year (Newest)</option>
                  <option value="publicationYear-asc">Year (Oldest)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="bg-[#102219]/80 rounded-2xl py-16 text-center text-[#D6C5A3] border border-[#C3A66B]/30 backdrop-blur-md">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C3A66B]" />
              <p className="text-xs font-semibold">Consulting Central Archive Database...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-[#102219]/80 rounded-2xl py-16 text-center text-[#D6C5A3] border border-[#C3A66B]/30 backdrop-blur-md">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#C3A66B]" />
              <h3 className="font-serif text-base font-bold text-[#FFFDF8]">No matching titles found</h3>
              <p className="text-xs text-[#D6C5A3] mt-1">Try another keyword or reset the filter settings.</p>
            </div>
          ) : viewMode === '3d' ? (
            /* 3D Physical Books Display */
            <div className="p-6 sm:p-10 rounded-3xl bg-[#0E1D16]/80 border border-[#C3A66B]/30 shadow-card backdrop-blur-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10 justify-items-center">
                {filteredBooks.map((book, idx) => (
                  <PhysicalBookItem
                    key={book.bookId}
                    book={book}
                    index={idx}
                    onInspect={(b) => setViewingBook(b)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Flat Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="bg-[#102219]/80 rounded-2xl p-6 border border-[#C3A66B]/30 shadow-xs hover:border-[#C3A66B] transition-all flex flex-col justify-between group backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="font-mono text-xs font-bold text-[#FFFDF8] bg-[#A65F45] px-2.5 py-0.5 rounded border border-[#C3A66B]/40">
                        {book.bookId}
                      </span>
                      <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                        {book.availableCopies > 0 ? `${book.availableCopies} available` : 'All Issued'}
                      </Badge>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#FFFDF8] group-hover:text-[#C3A66B] transition-colors leading-snug">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#D6C5A3] mt-1.5 font-light">by {book.author}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#C3A66B]/20 flex items-center justify-between text-xs">
                    <span className="text-[#D6C5A3] font-mono">
                      Year: {book.publicationYear}
                    </span>
                    <button
                      onClick={() => setViewingBook(book)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#C3A66B]/40 hover:bg-[#1E3E33] text-[#FFFDF8] hover:text-[#C3A66B] transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C3A66B]" />
                      Inspect Volume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </InfiniteLibrarySectionBackground>

      {/* Book Detail Modal */}
      {viewingBook && (
        <Modal
          isOpen={!!viewingBook}
          onClose={() => setViewingBook(null)}
          title="Physical Archive Volume Inspection"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-3.5 border-b border-[#E2DAC7] dark:border-[#334D40]">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#A65F45] bg-[#F5F0E5] dark:bg-[#192A23] px-2.5 py-0.5 rounded border border-[#E2DAC7] dark:border-[#334D40]">
                  {viewingBook.bookId}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#263D32] dark:text-[#FFFDF8] mt-2 leading-snug">{viewingBook.title}</h4>
                <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] font-light mt-0.5">Author(s): {viewingBook.author}</p>
              </div>
              <Badge variant={viewingBook.availableCopies > 0 ? 'success' : 'danger'}>
                {viewingBook.availableCopies > 0 ? 'In Stock' : 'All Issued'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40]">
                <span className="text-[#77736B] dark:text-[#D6C5A3] block mb-1">Publication Year</span>
                <span className="text-sm font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] font-mono">{viewingBook.publicationYear}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40]">
                <span className="text-[#77736B] dark:text-[#D6C5A3] block mb-1">Total Holdings</span>
                <span className="text-sm font-serif font-bold text-[#263D32] dark:text-[#FFFDF8]">{viewingBook.totalCopies} copies</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#E8F0EA] dark:bg-[#1C3626] border border-[#C4D9C8] dark:border-[#2A523A]">
                <span className="text-[#1E4D2B] dark:text-[#88D08D] block mb-1 font-semibold">On Shelf</span>
                <span className="text-sm font-serif font-bold text-[#1E4D2B] dark:text-[#88D08D]">{viewingBook.availableCopies} available</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF5EB] dark:bg-[#2E2818] border border-[#E5D7B7] dark:border-[#4D4226]">
                <span className="text-[#A65F45] dark:text-[#D6C5A3] block mb-1 font-semibold">Circulating</span>
                <span className="text-sm font-serif font-bold text-[#A65F45] dark:text-[#D6C5A3]">{viewingBook.totalCopies - viewingBook.availableCopies} issued</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E2DAC7] dark:border-[#334D40] text-xs text-[#77736B] dark:text-[#F5F0E5]">
              <span>Checkout is processed at the IEM circulation desk.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingBook(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#E2DAC7] hover:bg-[#F5F0E5] dark:border-[#334D40] dark:hover:bg-[#192A23] text-[#55524B] dark:text-[#F5F0E5]"
                >
                  Close
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-semibold shadow-xs"
                >
                  Sign In to Borrow
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#C3A66B]/30 bg-[#070E0B] py-8 px-4 sm:px-8 text-center text-xs text-[#D6C5A3]">
        &copy; {new Date().getFullYear()} Institute of Engineering & Management (IEM), Kolkata. All rights reserved.
      </footer>
    </div>
  );
};
