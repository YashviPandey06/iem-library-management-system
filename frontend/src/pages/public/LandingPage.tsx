import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Search,
  Eye,
  Sun,
  Moon,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { api } from '../../api/client';
import { Book, DashboardStats } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { useTheme } from '../../context/ThemeContext';
import { FloatingBooksUniverse } from '../../components/FloatingBooksUniverse';
import { PhysicalBookItem } from '../../components/PhysicalBookItem';
import { AnimatedStatCounter } from '../../components/AnimatedStatCounter';
import { InfiniteLibrarySectionBackground } from '../../components/background/InfiniteLibrarySectionBackground';

export const LandingPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [statsData, booksData] = await Promise.all([
          api.getStats().catch(() => null),
          api.getBooks().catch(() => []),
        ]);
        if (statsData) setStats(statsData);
        if (booksData.length > 0) setFeaturedBooks(booksData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load landing data', err);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setHasSearched(true);
      const results = await api.searchBooks(searchQuery.trim());
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInspectFloatingBook = (title: string) => {
    const found = featuredBooks.find((b) => b.title.toLowerCase().includes(title.toLowerCase()));
    if (found) {
      setViewingBook(found);
    } else {
      setViewingBook({
        id: 99,
        bookId: 'IEM-SPEC',
        title: title,
        author: 'IEM Central Academic Faculty',
        publicationYear: 2026,
        totalCopies: 6,
        availableCopies: 5,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1410] text-[#FFFDF8] flex flex-col font-sans transition-colors duration-200">
      {/* 0. Botanical Academic Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0E1B15]/95 backdrop-blur-md border-b border-[#C3A66B]/30 px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-subtle">
        {/* Left: Official IEM Logo & System Identity */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
          <img
            src="/iem-logo-white.webp"
            alt="Institute of Engineering & Management (IEM), Kolkata"
            className="h-9 sm:h-11 md:h-12 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col border-l border-[#C3A66B]/35 pl-2.5 sm:pl-3.5 text-left shrink-0">
            <span className="font-serif font-bold text-[#FFFDF8] text-xs sm:text-base lg:text-lg tracking-tight leading-tight uppercase whitespace-nowrap">
              LIBRARY MANAGEMENT SYSTEM
            </span>
            <span className="text-[9px] sm:text-[11px] font-medium text-[#D6C5A3] tracking-normal leading-tight mt-0.5 whitespace-nowrap">
              Institute of Engineering & Management, Kolkata
            </span>
          </div>
        </Link>

        {/* Center: Editorial Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#E0D7C3] shrink-0">
          <Link to="/" className="text-[#FFFDF8] font-semibold hover:text-[#C3A66B] transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="hover:text-[#C3A66B] text-[#D6C5A3] transition-colors">
            Library Catalogue
          </Link>
          <Link to="/about" className="hover:text-[#C3A66B] text-[#D6C5A3] transition-colors">
            About IEM Library
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#1A3328] border border-[#C3A66B]/35 transition-colors"
            title={isDark ? 'Switch to Parchment Day Theme' : 'Switch to Botanical Night Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D6C5A3]" /> : <Moon className="w-4 h-4 text-[#D6C5A3]" />}
          </button>

          <Link
            to="/login"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-[#FFFDF8] bg-[#162B21] hover:bg-[#203D2F] transition-colors border border-[#C3A66B]/40"
          >
            <span className="hidden sm:inline">Student & Faculty </span>Login
          </Link>

          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <span>Explore Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 1. INFINITE LIBRARY HERO: Deep Multi-Layer Atmospheric Environment */}
      <InfiniteLibrarySectionBackground variant="hero" className="border-b border-[#2A453A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Institutional Label, Headline, Description, Buttons */}
            <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
              {/* Institutional Badge */}
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162D23]/90 border border-[#C3A66B]/50 text-xs font-medium text-[#F5F0E5] shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#C3A66B] animate-pulse" />
                  <span className="tracking-wider uppercase text-[11px] font-mono text-[#D6C5A3]">
                    INSTITUTE OF ENGINEERING & MANAGEMENT, KOLKATA
                  </span>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#FFFDF8] tracking-tight leading-[1.15] drop-shadow-sm">
                Where Knowledge <br />
                <span className="italic font-normal text-[#C3A66B]">
                  Comes Alive.
                </span>
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-lg text-[#F5F0E5]/90 leading-relaxed max-w-xl font-light">
                Discover, explore and experience an intelligent academic library built for the next generation of scholars. Physical catalogued volumes, real-time desk tracking, and seamless circulation.
              </p>

              {/* Two Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-semibold text-sm shadow-terracotta transition-all hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Explore Library</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#162D23]/80 hover:bg-[#1E3E33] border border-[#C3A66B] text-[#FFFDF8] font-semibold text-sm transition-all hover:scale-[1.02] backdrop-blur-xs"
                >
                  <span>Student & Faculty Login</span>
                  <ArrowRight className="w-4 h-4 text-[#C3A66B] shrink-0" />
                </Link>
              </div>

              {/* Ambient Live Highlights */}
              <div className="pt-6 border-t border-[#C3A66B]/25 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#E0D7C3]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C3A66B] animate-pulse" />
                  <span>
                    <strong className="text-white font-bold">{stats?.totalBooks ?? '7'}</strong> Rare & Academic Titles
                  </span>
                </div>
                <span className="text-[#C3A66B]/40 hidden sm:inline">✦</span>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#C3A66B]" />
                  <span>
                    <strong className="text-white font-bold">{stats?.totalAvailableCopies ?? '27'}</strong> Physical Copies on Shelf
                  </span>
                </div>
                <span className="text-[#C3A66B]/40 hidden sm:inline">✦</span>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C3A66B]" />
                  <span>Salt Lake Sector V Campus</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The 3D Floating Books Universe with Turning Pages */}
            <div className="lg:col-span-6 flex items-center justify-center w-full relative">
              <FloatingBooksUniverse onBookClick={handleInspectFloatingBook} />
            </div>
          </div>
        </div>
      </InfiniteLibrarySectionBackground>

      {/* 2. SEARCH & STATISTICS ENVIRONMENT: Illuminated Academic Stacks Atmosphere */}
      <InfiniteLibrarySectionBackground variant="stats" className="border-b border-[#2A453A] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Dedicated Search Bar Strip */}
          <div className="max-w-3xl mx-auto w-full">
            <form onSubmit={handleSearch} className="relative shadow-card">
              <Search className="w-5 h-5 absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#D6C5A3]" />
              <input
                type="text"
                placeholder="Search library catalogue by Title, Author, or Book ID (e.g. Cormen, Algorithms, B101)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 sm:pl-14 pr-28 sm:pr-36 py-3.5 sm:py-4 rounded-2xl bg-[#0D1B15]/90 text-[#FFFDF8] placeholder-[#9E978B] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C3A66B] border border-[#C3A66B]/40 transition-all shadow-subtle backdrop-blur-md"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 px-3.5 sm:px-5 py-2 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search Stacks'}
              </button>
            </form>

            {/* Search Results Display Dropdown */}
            {hasSearched && (
              <div className="mt-4 rounded-2xl p-5 text-left border border-[#C3A66B]/40 bg-[#0F221A]/95 text-[#FFFDF8] shadow-elevated backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-[#C3A66B]/30 mb-3">
                  <span className="text-xs font-serif font-bold text-[#FFFDF8]">
                    Search Results for "{searchQuery}" ({searchResults.length} volumes identified)
                  </span>
                  <button
                    type="button"
                    onClick={() => setHasSearched(false)}
                    className="text-xs text-[#C3A66B] hover:underline font-bold"
                  >
                    Close Results
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <p className="text-xs text-[#D6C5A3] py-4 text-center">
                    No matching books found in the central archive. Try keywords such as "Algorithms", "Kotlin", or "Clean".
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {searchResults.map((book) => (
                      <div
                        key={book.bookId}
                        className="p-3.5 rounded-xl bg-[#142A20] border border-[#C3A66B]/30 hover:border-[#C3A66B] transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] font-bold text-[#FFFDF8] bg-[#A65F45] px-1.5 py-0.5 rounded border border-[#C3A66B]/40">
                              {book.bookId}
                            </span>
                            <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                              {book.availableCopies > 0 ? `${book.availableCopies} available` : 'All Issued'}
                            </Badge>
                          </div>
                          <h5 className="font-serif text-sm font-bold text-[#FFFDF8] truncate">{book.title}</h5>
                          <p className="text-xs text-[#D6C5A3] truncate">{book.author} • {book.publicationYear}</p>
                        </div>
                        <button
                          onClick={() => setViewingBook(book)}
                          className="px-3.5 py-2 rounded-xl border border-[#C3A66B]/40 hover:bg-[#1E3E33] text-xs text-[#FFFDF8] shrink-0 flex items-center gap-1.5 font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C3A66B]" />
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Animated Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-center">
            {/* Card 1: Registered Titles */}
            <div className="p-6 rounded-2xl bg-[#12231B]/85 backdrop-blur-md border border-[#C3A66B]/30 shadow-card hover:border-[#C3A66B]/60 transition-all group">
              <span className="text-[11px] font-bold text-[#D6C5A3] uppercase tracking-widest block mb-1.5">
                Registered Titles
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#FFFDF8] tracking-tight group-hover:text-[#C3A66B] transition-colors">
                <AnimatedStatCounter value={stats?.totalBooks ?? 7} />
              </div>
              <span className="text-[11px] text-[#A69E8F] mt-1 block">Catalogued in library</span>
            </div>

            {/* Card 2: Available Volumes */}
            <div className="p-6 rounded-2xl bg-[#12231B]/85 backdrop-blur-md border border-[#C3A66B]/30 shadow-card hover:border-[#C3A66B]/60 transition-all group">
              <span className="text-[11px] font-bold text-[#88D08D] uppercase tracking-widest block mb-1.5">
                Available Volumes
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#88D08D] tracking-tight group-hover:scale-105 transition-transform">
                <AnimatedStatCounter value={stats?.totalAvailableCopies ?? 27} />
              </div>
              <span className="text-[11px] text-[#A69E8F] mt-1 block">Ready to lend on shelf</span>
            </div>

            {/* Card 3: Enrolled Scholars */}
            <div className="p-6 rounded-2xl bg-[#12231B]/85 backdrop-blur-md border border-[#C3A66B]/30 shadow-card hover:border-[#C3A66B]/60 transition-all group">
              <span className="text-[11px] font-bold text-[#C3A66B] uppercase tracking-widest block mb-1.5">
                Enrolled Scholars
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C3A66B] tracking-tight group-hover:scale-105 transition-transform">
                <AnimatedStatCounter value={stats?.totalStudents ?? 5} />
              </div>
              <span className="text-[11px] text-[#A69E8F] mt-1 block">Students & faculty</span>
            </div>

            {/* Card 4: Active Circulations */}
            <div className="p-6 rounded-2xl bg-[#12231B]/85 backdrop-blur-md border border-[#C3A66B]/30 shadow-card hover:border-[#C3A66B]/60 transition-all group">
              <span className="text-[11px] font-bold text-[#F0A892] uppercase tracking-widest block mb-1.5">
                Active Circulations
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#F0A892] tracking-tight group-hover:scale-105 transition-transform">
                <AnimatedStatCounter value={stats?.totalIssuedCopies ?? 3} />
              </div>
              <span className="text-[11px] text-[#A69E8F] mt-1 block">Currently on active loan</span>
            </div>
          </div>
        </div>
      </InfiniteLibrarySectionBackground>

      {/* 3. PHYSICAL 3D BOOK HOLDINGS SECTION: Darker Atmospheric Spotlight Environment */}
      <InfiniteLibrarySectionBackground variant="holdings" className="border-b border-[#2A453A] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-[#C3A66B]/30">
            <div>
              <span className="text-[11px] font-bold text-[#C3A66B] uppercase tracking-widest block mb-1.5">
                Physical Departmental Stacks
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FFFDF8] tracking-tight">
                Curated Academic Holdings
              </h2>
              <p className="text-xs sm:text-sm text-[#D6C5A3] mt-1.5 max-w-xl font-light">
                Foundational texts in computer science, algorithmics, engineering and discrete systems. Hover to examine the 3D binding and gilded leaves.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-xs sm:text-sm font-semibold text-[#C3A66B] hover:underline transition-colors flex items-center gap-1.5"
            >
              <span>View Complete Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3D Physical Book Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-8 sm:gap-6 justify-items-center">
            {featuredBooks.map((book, idx) => (
              <PhysicalBookItem
                key={book.bookId}
                book={book}
                index={idx}
                onInspect={(b) => setViewingBook(b)}
              />
            ))}
          </div>
        </div>
      </InfiniteLibrarySectionBackground>

      {/* 4. PROGRAMMATIC BLUEPRINT SECTION: Campus Infrastructure (No Photos) */}
      <InfiniteLibrarySectionBackground variant="infrastructure" className="border-b border-[#1E3228] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#0F2018]/90 rounded-3xl overflow-hidden border border-[#C3A66B]/30 shadow-card grid grid-cols-1 lg:grid-cols-12 backdrop-blur-md">
            {/* Left Column: High-Precision Architectural Blueprint SVG */}
            <div className="lg:col-span-5 relative p-6 sm:p-8 flex items-center justify-center bg-[#091510] border-b lg:border-b-0 lg:border-r border-[#C3A66B]/30">
              {/* Programmatic Stacks Blueprint Graphic */}
              <div className="w-full max-w-sm rounded-2xl border border-[#C3A66B]/30 bg-[#07110C] p-5 shadow-inner font-mono text-[9px] text-[#C3A66B] space-y-4">
                <div className="flex items-center justify-between border-b border-[#C3A66B]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C3A66B] animate-pulse" />
                    <span className="font-bold tracking-widest uppercase">IEM CENTRAL ARCHIVE MAP</span>
                  </div>
                  <span className="text-[#D6C5A3]/60 text-[8px]">LEVEL 02</span>
                </div>

                {/* SVG Blueprint Diagram */}
                <svg viewBox="0 0 320 200" className="w-full h-auto stroke-[#C3A66B] fill-none" strokeWidth="1.2">
                  <rect x="10" y="10" width="300" height="180" rx="6" strokeDasharray="3 2" />
                  <rect x="25" y="25" width="130" height="70" rx="4" className="stroke-[#A65F45]" fill="#1E3E33" fillOpacity="0.4" />
                  <text x="35" y="45" fill="#D6C5A3" fontSize="8" fontFamily="monospace" stroke="none">READING CARRELS</text>
                  <text x="35" y="60" fill="#9C9588" fontSize="6.5" fontFamily="monospace" stroke="none">Capacity: 120 Scholars</text>

                  <rect x="25" y="110" width="130" height="65" rx="4" className="stroke-[#C3A66B]" fill="#2A453A" fillOpacity="0.4" />
                  <text x="35" y="130" fill="#FFFDF8" fontSize="8" fontFamily="monospace" stroke="none">CIRCULATION DESK</text>
                  <text x="35" y="145" fill="#D6C5A3" fontSize="6.5" fontFamily="monospace" stroke="none">Active RFID & SQLite Sync</text>

                  <g className="stroke-[#D6C5A3]/80">
                    <rect x="175" y="25" width="120" height="20" rx="2" fill="#152B23" />
                    <text x="185" y="38" fill="#FFFDF8" fontSize="7" fontFamily="monospace" stroke="none">BAY 01 · ALGORITHMS</text>

                    <rect x="175" y="55" width="120" height="20" rx="2" fill="#152B23" />
                    <text x="185" y="68" fill="#FFFDF8" fontSize="7" fontFamily="monospace" stroke="none">BAY 02 · SYSTEMS & OS</text>

                    <rect x="175" y="85" width="120" height="20" rx="2" fill="#152B23" />
                    <text x="185" y="98" fill="#FFFDF8" fontSize="7" fontFamily="monospace" stroke="none">BAY 03 · DISCRETE MATH</text>

                    <rect x="175" y="115" width="120" height="20" rx="2" fill="#152B23" />
                    <text x="185" y="128" fill="#FFFDF8" fontSize="7" fontFamily="monospace" stroke="none">BAY 04 · ELECTRONICS</text>

                    <rect x="175" y="145" width="120" height="20" rx="2" fill="#152B23" />
                    <text x="185" y="158" fill="#FFFDF8" fontSize="7" fontFamily="monospace" stroke="none">BAY 05 · RARE VOLUMES</text>
                  </g>
                </svg>

                <div className="pt-2 border-t border-[#C3A66B]/20 flex justify-between text-[7.5px] text-[#D6C5A3]/80">
                  <span>SALT LAKE SECTOR V</span>
                  <span>STATUS: ACCREDITED ‘A’</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Narrative */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center text-left space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C3A66B] uppercase tracking-widest">
                <Building2 className="w-4 h-4 text-[#C3A66B]" />
                <span>Campus Academic Infrastructure</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFFDF8] tracking-tight">
                A Dedicated Sanctuary for Rigorous Engineering Scholarship
              </h3>

              <p className="text-xs sm:text-sm text-[#F5F0E5]/90 leading-relaxed font-light">
                Founded in 1989, the Institute of Engineering & Management (IEM), Kolkata maintains one of the foremost academic library collections in Eastern India. Our multi-storey facility in Salt Lake Sector V accommodates extensive open-stack physical volumes, individual research carrels, quiet reading lounges, and dedicated digital terminals.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#E0D7C3]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A65F45] shrink-0 mt-0.5" />
                  <span>Sector V, Salt Lake Electronics Complex, Kolkata — 700091</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#C3A66B] shrink-0 mt-0.5" />
                  <span>Study & Lending Hours: Mon – Sat, 09:00 to 19:00 IST</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  <span>Read Institutional History & Policy</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </InfiniteLibrarySectionBackground>

      {/* 5. CIRCULATION PROTOCOL WORKFLOW */}
      <InfiniteLibrarySectionBackground variant="workflow" className="border-b border-[#2A453A] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#C3A66B] uppercase tracking-widest block mb-1.5">
              Lending Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FFFDF8] tracking-tight">
              How Circulation Operates at IEM
            </h2>
            <p className="text-xs sm:text-sm text-[#D6C5A3] mt-1.5 font-light">
              Deterministic circulation procedures designed for fairness, accountability, and seamless tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl p-6 text-center bg-[#102219]/80 border border-[#C3A66B]/30 shadow-subtle backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#162D23] text-[#C3A66B] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl border border-[#C3A66B]/40">
                1
              </div>
              <h4 className="font-serif font-bold text-[#FFFDF8] text-base mb-1.5">Discover Titles</h4>
              <p className="text-xs text-[#D6C5A3] leading-relaxed font-light">
                Inspect physical volumes, shelf availability, edition years, and call numbers in the open catalogue.
              </p>
            </div>

            <div className="rounded-2xl p-6 text-center bg-[#102219]/80 border border-[#C3A66B]/30 shadow-subtle backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#1A3A2B] text-[#88D08D] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl border border-[#88D08D]/40">
                2
              </div>
              <h4 className="font-serif font-bold text-[#FFFDF8] text-base mb-1.5">Circulation Desk Issue</h4>
              <p className="text-xs text-[#D6C5A3] leading-relaxed font-light">
                Librarians issue the volume to the student's verified ID with atomic SQLite state updates.
              </p>
            </div>

            <div className="rounded-2xl p-6 text-center bg-[#102219]/80 border border-[#C3A66B]/30 shadow-subtle backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#2D2817] text-[#C3A66B] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl border border-[#C3A66B]/40">
                3
              </div>
              <h4 className="font-serif font-bold text-[#FFFDF8] text-base mb-1.5">Scholar Portal Tracking</h4>
              <p className="text-xs text-[#D6C5A3] leading-relaxed font-light">
                Patrons monitor active loans, review borrowing timestamps, and browse historical loans.
              </p>
            </div>

            <div className="rounded-2xl p-6 text-center bg-[#102219]/80 border border-[#C3A66B]/30 shadow-subtle backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#331E18] text-[#F0A892] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl border border-[#F0A892]/40">
                4
              </div>
              <h4 className="font-serif font-bold text-[#FFFDF8] text-base mb-1.5">Check-In Return</h4>
              <p className="text-xs text-[#D6C5A3] leading-relaxed font-light">
                Books returned at the desk immediately restore available shelf copy counts for fellow peers.
              </p>
            </div>
          </div>
        </div>
      </InfiniteLibrarySectionBackground>

      {/* 6. DISTINCT FOOTER in Refined Evergreen Atmosphere */}
      <InfiniteLibrarySectionBackground variant="footer" className="mt-auto border-t border-[#C3A66B]/30 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-[#D6C5A3]">
          {/* Institutional Branding */}
          <div className="flex items-center gap-3.5">
            <img
              src="/iem-logo-white.webp"
              alt="Institute of Engineering & Management (IEM), Kolkata"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div className="text-left">
              <span className="font-serif font-bold text-[#FFFDF8] text-sm sm:text-base block uppercase">
                LIBRARY MANAGEMENT SYSTEM
              </span>
              <span className="text-[11px] text-[#C3A66B]">
                Institute of Engineering & Management, Kolkata
              </span>
            </div>
          </div>

          {/* Academic Links */}
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/catalog" className="text-[#E0D7C3] hover:text-[#C3A66B] transition-colors">
              Holdings Catalogue
            </Link>
            <Link to="/about" className="text-[#E0D7C3] hover:text-[#C3A66B] transition-colors">
              Library Profile
            </Link>
            <Link to="/login" className="text-[#E0D7C3] hover:text-[#C3A66B] transition-colors">
              Patron Sign In
            </Link>
            <a
              href="https://iem.edu.in"
              target="_blank"
              rel="noreferrer"
              className="text-[#E0D7C3] hover:text-[#C3A66B] transition-colors"
            >
              IEM Official Portal
            </a>
          </div>

          {/* Copyright Statement */}
          <p className="text-[#A69E8F] text-center md:text-right font-light">
            &copy; {new Date().getFullYear()} Institute of Engineering & Management (IEM), Kolkata. <br className="hidden sm:inline" />
            Salt Lake Electronics Complex, Kolkata, India.
          </p>
        </div>
      </InfiniteLibrarySectionBackground>

      {/* Book Inspection Modal */}
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
                {viewingBook.availableCopies > 0 ? 'Available on Shelf' : 'All Issued'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40]">
                <span className="text-[#77736B] dark:text-[#D6C5A3] block mb-1">Publication Year</span>
                <span className="text-sm font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] font-mono">{viewingBook.publicationYear}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40]">
                <span className="text-[#77736B] dark:text-[#D6C5A3] block mb-1">Total Copies Catalogued</span>
                <span className="text-sm font-serif font-bold text-[#263D32] dark:text-[#FFFDF8]">{viewingBook.totalCopies} units</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#E8F0EA] dark:bg-[#1C3626] border border-[#C4D9C8] dark:border-[#2A523A]">
                <span className="text-[#1E4D2B] dark:text-[#88D08D] block mb-1 font-semibold">Copies on Shelf</span>
                <span className="text-sm font-serif font-bold text-[#1E4D2B] dark:text-[#88D08D]">{viewingBook.availableCopies} available</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF5EB] dark:bg-[#2E2818] border border-[#E5D7B7] dark:border-[#4D4226]">
                <span className="text-[#A65F45] dark:text-[#D6C5A3] block mb-1 font-semibold">Active Circulations</span>
                <span className="text-sm font-serif font-bold text-[#A65F45] dark:text-[#D6C5A3]">{viewingBook.totalCopies - viewingBook.availableCopies} on loan</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2DAC7] dark:border-[#334D40]">
              <button
                type="button"
                onClick={() => setViewingBook(null)}
                className="px-4 py-2 rounded-xl border border-[#E2DAC7] text-xs font-semibold text-[#55524B] hover:bg-[#F5F0E5] dark:border-[#334D40] dark:text-[#F5F0E5] dark:hover:bg-[#192A23] transition-colors"
              >
                Close
              </button>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In to Borrow
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
