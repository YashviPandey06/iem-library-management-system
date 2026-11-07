import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  BookCheck,
  ChevronRight,
  Clock,
  RefreshCw,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { DashboardStats, PopularBook, ActivityItem } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, popularData, activityData] = await Promise.all([
        api.getStats(),
        api.getPopularBooks(),
        api.getActivity(),
      ]);

      setStats(statsData);
      setPopularBooks(popularData);
      setActivity(activityData);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.message || 'Failed to load library telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalCopies = (stats?.totalAvailableCopies ?? 0) + (stats?.totalIssuedCopies ?? 0);
  const availablePercent = totalCopies > 0 ? Math.round(((stats?.totalAvailableCopies ?? 0) / totalCopies) * 100) : 0;
  const issuedPercent = totalCopies > 0 ? 100 - availablePercent : 0;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2DAC7] dark:border-[#334D40]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F0E5] text-[#263D32] dark:bg-[#192A23] dark:text-[#D6C5A3] border border-[#E2DAC7] dark:border-[#334D40]">
              <Sparkles className="w-3 h-3 text-[#A65F45]" />
              Central Library Operations
            </span>
            <span className="text-xs text-[#77736B] dark:text-[#D6C5A3] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D6C5A3]" />
              {todayFormatted}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] tracking-tight">
            Circulation Operations & Archival Metrics
          </h1>
          <p className="text-xs sm:text-sm text-[#55524B] dark:text-[#F5F0E5] mt-1 font-light">
            Real-time circulation metrics, inventory distribution, and active student borrowings across IEM departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2DAC7] dark:border-[#334D40] bg-[#FFFDF8] dark:bg-[#263D32] text-[#55524B] dark:text-[#F5F0E5] font-medium text-xs sm:text-sm hover:text-[#263D32] dark:hover:text-[#FFFDF8] hover:bg-[#F5F0E5] dark:hover:bg-[#192A23] transition-all shadow-xs disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/issue"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-[#D6C5A3]" />
            <span>Desk Issue</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#F7EFEA] border border-[#E8C5B8] flex items-center gap-3 text-[#8E4F39] dark:bg-[#382119] dark:border-[#5C3326] dark:text-[#F0A892] text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#A65F45] dark:text-[#F0A892]" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Five KPI Cards on Warm Cream/White Surfaces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Catalogued Titles"
          value={stats?.totalBooks ?? '—'}
          subtitle="Unique book titles"
          icon={BookOpen}
          colorClass="text-[#263D32] dark:text-[#D6C5A3]"
          bgClass="bg-[#F5F0E5] dark:bg-[#192A23] border-[#E2DAC7] dark:border-[#334D40]"
        />
        <StatCard
          title="On-Shelf Copies"
          value={stats?.totalAvailableCopies ?? '—'}
          subtitle="Ready to lend"
          icon={Layers}
          colorClass="text-[#1E4D2B] dark:text-[#88D08D]"
          bgClass="bg-[#E8F0EA] dark:bg-[#1C3626] border-[#C4D9C8] dark:border-[#2A523A]"
        />
        <StatCard
          title="Active Loans"
          value={stats?.totalIssuedCopies ?? '—'}
          subtitle="Under student study"
          icon={ArrowUpRight}
          colorClass="text-[#A65F45] dark:text-[#F0A892]"
          bgClass="bg-[#F7EFEA] dark:bg-[#382119] border-[#E8C5B8] dark:border-[#5C3326]"
        />
        <StatCard
          title="Enrolled Patrons"
          value={stats?.totalStudents ?? '—'}
          subtitle="Registered borrowers"
          icon={Users}
          colorClass="text-[#263D32] dark:text-[#FFFDF8]"
          bgClass="bg-[#F5F0E5] dark:bg-[#263D32] border-[#E2DAC7] dark:border-[#334D40]"
        />
        <StatCard
          title="Total Returns"
          value={stats?.totalReturnedCount ?? '—'}
          subtitle="Completed return cycles"
          icon={CheckCircle2}
          colorClass="text-[#7A602B] dark:text-[#E2C37E]"
          bgClass="bg-[#FAF5EB] dark:bg-[#2E2818] border-[#E5D7B7] dark:border-[#4D4226]"
        />
      </div>

      {/* 2. Second Section: Inventory Overview + Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Physical Inventory Overview (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] text-lg tracking-tight">
                  Holdings Inventory Distribution
                </h3>
                <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] mt-0.5 font-light">
                  Real-time shelf availability vs circulating volumes
                </p>
              </div>
              <Badge variant="gold" dot={true}>Live Inventory</Badge>
            </div>

            {/* Visual ratio bar */}
            <div className="my-6">
              <div className="flex items-center justify-between text-xs text-[#55524B] dark:text-[#F5F0E5] mb-2 font-medium">
                <span>Available on Shelf: {availablePercent}%</span>
                <span>Currently Issued: {issuedPercent}%</span>
              </div>
              <div className="h-3.5 w-full bg-[#F5F0E5] dark:bg-[#192A23] rounded-full overflow-hidden flex p-0.5 border border-[#E2DAC7] dark:border-[#334D40]">
                <div
                  style={{ width: `${availablePercent}%` }}
                  className="bg-[#1E4D2B] dark:bg-[#88D08D] rounded-l-full transition-all duration-700"
                  title={`Available: ${stats?.totalAvailableCopies ?? 0} copies (${availablePercent}%)`}
                />
                <div
                  style={{ width: `${issuedPercent}%` }}
                  className="bg-[#A65F45] rounded-r-full transition-all duration-700"
                  title={`Issued: ${stats?.totalIssuedCopies ?? 0} copies (${issuedPercent}%)`}
                />
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F5F0E5] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40]">
                <span className="text-[11px] font-bold text-[#77736B] dark:text-[#D6C5A3] uppercase tracking-wider block mb-1">
                  Total Catalogued
                </span>
                <div className="text-xl font-serif font-bold text-[#263D32] dark:text-[#FFFDF8]">
                  {totalCopies}
                  <span className="text-xs font-normal text-[#77736B] dark:text-[#D6C5A3] ml-1">units</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F0EA] dark:bg-[#1C3626] border border-[#C4D9C8] dark:border-[#2A523A]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#1E4D2B] dark:bg-[#88D08D]" />
                  <span className="text-[11px] font-bold text-[#1E4D2B] dark:text-[#88D08D] uppercase tracking-wider">
                    On Shelf
                  </span>
                </div>
                <div className="text-xl font-serif font-bold text-[#1E4D2B] dark:text-[#88D08D]">
                  {stats?.totalAvailableCopies ?? 0}
                  <span className="text-xs font-normal text-[#1E4D2B]/80 dark:text-[#88D08D]/80 ml-1">({availablePercent}%)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7EFEA] dark:bg-[#382119] border border-[#E8C5B8] dark:border-[#5C3326]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#A65F45]" />
                  <span className="text-[11px] font-bold text-[#8E4F39] dark:text-[#F0A892] uppercase tracking-wider">
                    Circulating
                  </span>
                </div>
                <div className="text-xl font-serif font-bold text-[#8E4F39] dark:text-[#F0A892]">
                  {stats?.totalIssuedCopies ?? 0}
                  <span className="text-xs font-normal text-[#8E4F39]/80 dark:text-[#F0A892]/80 ml-1">({issuedPercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2DAC7] dark:border-[#334D40] flex items-center justify-between text-xs text-[#77736B] dark:text-[#F5F0E5]">
            <span>Guarded with Kotlin Coroutine Mutex concurrency</span>
            <Link to="/admin/books" className="text-[#A65F45] dark:text-[#D6C5A3] hover:underline font-semibold flex items-center gap-1 transition-colors">
              Browse Holdings Catalogue <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Quick Operations Shortcuts (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] text-lg tracking-tight">
                Circulation Desk Workflows
              </h3>
              <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3] font-mono uppercase bg-[#F5F0E5] dark:bg-[#192A23] px-2 py-0.5 rounded border border-[#E2DAC7] dark:border-[#334D40]">
                Tasks 1, 4, 5, 6
              </span>
            </div>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] mb-5 font-light">
              Direct access to circulation desk workflows and patron records.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/books/add"
                className="p-3.5 rounded-2xl border border-[#E2DAC7] dark:border-[#334D40] bg-[#F5F0E5] dark:bg-[#192A23] hover:bg-[#FFFDF8] dark:hover:bg-[#263D32] hover:border-[#A65F45] transition-all flex flex-col items-center text-center group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] text-[#A65F45] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#292B27] dark:text-[#FFFDF8] group-hover:text-[#A65F45] dark:group-hover:text-[#D6C5A3]">
                  Add Volume
                </span>
                <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3] mt-0.5">Task 1: Catalog</span>
              </Link>

              <Link
                to="/admin/issue"
                className="p-3.5 rounded-2xl border border-[#E2DAC7] dark:border-[#334D40] bg-[#F5F0E5] dark:bg-[#192A23] hover:bg-[#FFFDF8] dark:hover:bg-[#263D32] hover:border-[#A65F45] transition-all flex flex-col items-center text-center group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] text-[#D6C5A3] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#292B27] dark:text-[#FFFDF8] group-hover:text-[#A65F45] dark:group-hover:text-[#D6C5A3]">
                  Issue Book
                </span>
                <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3] mt-0.5">Task 4: Loan</span>
              </Link>

              <Link
                to="/admin/return"
                className="p-3.5 rounded-2xl border border-[#E2DAC7] dark:border-[#334D40] bg-[#F5F0E5] dark:bg-[#192A23] hover:bg-[#FFFDF8] dark:hover:bg-[#263D32] hover:border-[#1E4D2B] transition-all flex flex-col items-center text-center group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] text-[#1E4D2B] dark:text-[#88D08D] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#292B27] dark:text-[#FFFDF8] group-hover:text-[#A65F45] dark:group-hover:text-[#D6C5A3]">
                  Return Book
                </span>
                <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3] mt-0.5">Task 5: Check-in</span>
              </Link>

              <Link
                to="/admin/active-issues"
                className="p-3.5 rounded-2xl border border-[#E2DAC7] dark:border-[#334D40] bg-[#F5F0E5] dark:bg-[#192A23] hover:bg-[#FFFDF8] dark:hover:bg-[#263D32] hover:border-[#A65F45] transition-all flex flex-col items-center text-center group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] text-[#263D32] dark:text-[#FFFDF8] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <BookCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#292B27] dark:text-[#FFFDF8] group-hover:text-[#A65F45] dark:group-hover:text-[#D6C5A3]">
                  Active Issues
                </span>
                <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3] mt-0.5">Task 6: Registry</span>
              </Link>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#E2DAC7] dark:border-[#334D40] flex items-center justify-between text-xs text-[#77776D] dark:text-[#F5F0E5]">
            <span>Patron directory ready</span>
            <Link to="/admin/students" className="text-[#A65F45] dark:text-[#D6C5A3] hover:underline font-semibold flex items-center gap-1 transition-colors">
              Patrons Registry <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Third Section: Recent Activity Timeline + Popular Books */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] rounded-3xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2DAC7] dark:border-[#334D40]">
            <div>
              <h3 className="font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] text-lg tracking-tight">
                Circulation Activity
              </h3>
              <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] mt-0.5 font-light">
                Real-time transaction audit trail
              </p>
            </div>
            <Link to="/admin/transactions" className="text-xs text-[#A65F45] dark:text-[#D6C5A3] hover:underline font-semibold transition-colors">
              View All &rarr;
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {activity.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-[#77736B] dark:text-[#D6C5A3]">
                <Clock className="w-8 h-8 mb-2 text-[#D6C5A3] dark:text-[#405F50]" />
                <p className="text-xs font-medium">No recent transactions recorded</p>
                <p className="text-[11px] text-[#77736B] mt-0.5">Issue or return a volume to generate audit events.</p>
              </div>
            ) : (
              activity.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#F5F0E5] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40] hover:border-[#A65F45] transition-all flex items-start gap-3"
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      item.type === 'ISSUE'
                        ? 'bg-[#FAF5EB] dark:bg-[#2E2818] text-[#7A602B] dark:text-[#E2C37E] border border-[#E5D7B7] dark:border-[#4D4226]'
                        : item.type === 'RETURN'
                        ? 'bg-[#E8F0EA] dark:bg-[#1C3626] text-[#1E4D2B] dark:text-[#88D08D] border border-[#C4D9C8] dark:border-[#2A523A]'
                        : 'bg-[#F7EFEA] dark:bg-[#382119] text-[#8E4F39] dark:text-[#F0A892] border border-[#E8C5B8] dark:border-[#5C3326]'
                    }`}
                  >
                    {item.type === 'ISSUE' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#A65F45]" />
                    ) : item.type === 'RETURN' ? (
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    ) : (
                      <PlusCircle className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-serif text-xs font-bold text-[#263D32] dark:text-[#FFFDF8] truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3] font-mono shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#55524B] dark:text-[#F5F0E5] truncate mt-0.5 font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Popular Books in Circulation (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] rounded-3xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2DAC7] dark:border-[#334D40]">
            <div>
              <h3 className="font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] text-lg tracking-tight">
                Most Frequently Borrowed Books
              </h3>
              <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] mt-0.5 font-light">
                Top circulation titles across IEM departments
              </p>
            </div>
            <Link
              to="/admin/books"
              className="text-xs text-[#A65F45] dark:text-[#D6C5A3] hover:underline font-semibold transition-colors"
            >
              All Volumes &rarr;
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E5] dark:bg-[#192A23] text-[#55524B] dark:text-[#F5F0E5] uppercase tracking-wider font-semibold border-b border-[#E2DAC7] dark:border-[#334D40]">
                <tr>
                  <th className="py-2.5 px-3">Call ID</th>
                  <th className="py-2.5 px-3">Title & Author</th>
                  <th className="py-2.5 px-3 text-center">Circulation Count</th>
                  <th className="py-2.5 px-3 text-center">Shelf Stock</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DAC7]/70 dark:divide-[#334D40] text-[#292B27] dark:text-[#FFFDF8]">
                {popularBooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#77776D] dark:text-[#D6C5A3]">
                      No borrow transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  popularBooks.map((book) => (
                    <tr key={book.bookId} className="hover:bg-[#F5F0E5]/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#A65F45] dark:text-[#D6C5A3]">
                        {book.bookId}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-serif font-bold text-[#263D32] dark:text-[#FFFDF8]">{book.title}</div>
                        <div className="text-[11px] text-[#77736B] dark:text-[#F5F0E5] font-light">{book.author}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-[#292B27] dark:text-[#FFFDF8]">
                        {book.issueCount} times
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-[#292B27] dark:text-[#FFFDF8]">{book.availableCopies}</span>
                        <span className="text-[#77736B] text-[10px] ml-1">avail</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'}>
                          {book.availableCopies > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
