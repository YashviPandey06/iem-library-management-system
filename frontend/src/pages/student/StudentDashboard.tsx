import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookMarked, Calendar, RefreshCw, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { StudentDashboardSummary } from '../../types';
import { Badge } from '../../components/Badge';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStudentDashboard();
      setSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch student dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DAC7] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#D6C5A3] uppercase tracking-wider block mb-1">
            IEM Central Library • Patron Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] tracking-tight">
            Welcome back, {user?.name ?? 'Scholar'}.
          </h1>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#F5F0E5] mt-1 font-light">
            Track active book issues, view borrowing history, and discover reference materials in the IEM catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudentData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#E2DAC7] dark:border-[#334D40] bg-[#FFFDF8] dark:bg-[#263D32] text-[#55524B] dark:text-[#F5F0E5] hover:text-[#A65F45] dark:hover:text-[#FFFDF8] hover:bg-[#F5F0E5] transition-colors shadow-xs disabled:opacity-50"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/student/catalog"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#F7EFEA] border border-[#E8C5B8] text-[#8E4F39] dark:bg-[#382119] dark:border-[#5C3326] dark:text-[#F0A892] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#A65F45] dark:text-[#F0A892]" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Student KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-5 border border-[#E2DAC7] dark:border-[#334D40] shadow-subtle border-l-4 border-l-[#A65F45]">
          <span className="text-xs font-semibold text-[#77736B] dark:text-[#D6C5A3] uppercase tracking-wider block mb-1">
            Currently Borrowed
          </span>
          <div className="text-3xl font-serif font-bold text-[#A65F45] dark:text-[#FFFDF8] tracking-tight">
            {summary?.activeLoans.length ?? 0}
          </div>
          <p className="text-[11px] text-[#77736B] dark:text-[#D6C5A3] mt-2 font-light">Active volumes in possession</p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-5 border border-[#E2DAC7] dark:border-[#334D40] shadow-subtle border-l-4 border-l-[#D6C5A3]">
          <span className="text-xs font-semibold text-[#77736B] dark:text-[#D6C5A3] uppercase tracking-wider block mb-1">
            Total Borrowings
          </span>
          <div className="text-3xl font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] tracking-tight">
            {summary?.totalBorrowedCount ?? 0}
          </div>
          <p className="text-[11px] text-[#77736B] dark:text-[#D6C5A3] mt-2 font-light">Lifetime borrowings history</p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-5 border border-[#E2DAC7] dark:border-[#334D40] shadow-subtle border-l-4 border-l-[#1E4D2B]">
          <span className="text-xs font-semibold text-[#77736B] dark:text-[#D6C5A3] uppercase tracking-wider block mb-1">
            Books Returned
          </span>
          <div className="text-3xl font-serif font-bold text-[#1E4D2B] dark:text-[#88D08D] tracking-tight">
            {summary?.returnedCount ?? 0}
          </div>
          <p className="text-[11px] text-[#77736B] dark:text-[#D6C5A3] mt-2 font-light">Completed return check-ins</p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-5 border border-[#E2DAC7] dark:border-[#334D40] shadow-subtle border-l-4 border-l-[#263D32]">
          <span className="text-xs font-semibold text-[#77736B] dark:text-[#D6C5A3] uppercase tracking-wider block mb-1">
            Patron Status
          </span>
          <div className="text-base font-bold text-[#263D32] dark:text-[#FFFDF8] flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-5 h-5 text-[#1E4D2B] dark:text-[#88D08D]" />
            <span>Good Standing</span>
          </div>
          <p className="text-[11px] text-[#77736B] dark:text-[#D6C5A3] mt-2 font-light">No overdue fees or holds</p>
        </div>
      </div>

      {/* Active Borrowings Section */}
      <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-6 border border-[#E2DAC7] dark:border-[#334D40] shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DAC7] dark:border-[#334D40]">
          <div>
            <h2 className="text-base font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] tracking-tight flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#A65F45]" />
              Your Active Borrowed Books ({summary?.activeLoans.length ?? 0})
            </h2>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] mt-0.5 font-light">
              Volumes checked out under your student ID ({user?.userId}).
            </p>
          </div>
          <Link
            to="/student/my-books"
            className="text-xs text-[#A65F45] dark:text-[#D6C5A3] hover:underline font-semibold transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[#77736B] dark:text-[#F5F0E5] text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A65F45]" />
            Loading active loan records...
          </div>
        ) : !summary || summary.activeLoans.length === 0 ? (
          <div className="py-12 text-center text-[#77736B] dark:text-[#F5F0E5] space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-[#D6C5A3] dark:text-[#405F50]" />
            <p className="text-sm font-semibold text-[#292B27] dark:text-[#FFFDF8]">No active book loans</p>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] max-w-sm mx-auto font-light">
              You currently do not have any books checked out. Explore the library catalog and visit the circulation desk to borrow a volume.
            </p>
            <Link
              to="/student/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-bold text-xs shadow-xs mt-2 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              Explore Books Catalog
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E2DAC7] dark:divide-[#334D40]">
            {summary.activeLoans.map((loan) => (
              <div
                key={loan.transactionId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold text-[#A65F45] bg-[#F5F0E5] dark:bg-[#192A23] px-2 py-0.5 rounded border border-[#E2DAC7] dark:border-[#334D40]">
                      {loan.bookId}
                    </span>
                    <Badge variant="warning">ISSUED</Badge>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#292B27] dark:text-[#FFFDF8]">{loan.bookTitle}</h3>
                  <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] flex items-center gap-2 mt-1 font-light">
                    <Calendar className="w-3.5 h-3.5 text-[#77736B]" />
                    <span>Issued Date: {loan.issueDate}</span>
                    <span>•</span>
                    <span className="text-[#1E4D2B] dark:text-[#88D08D] font-medium">Standard 14-day loan</span>
                  </p>
                </div>

                <div className="text-xs text-[#77736B] dark:text-[#D6C5A3] text-left sm:text-right">
                  <span className="text-[10px] uppercase font-semibold text-[#77736B] block">Transaction Reference</span>
                  <span className="font-mono text-xs text-[#292B27] dark:text-[#FFFDF8] font-medium">{loan.transactionId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Circulation Notice */}
      <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#192A23] border border-[#E2DAC7] dark:border-[#334D40] flex items-start gap-3 text-xs text-[#55524B] dark:text-[#F5F0E5]">
        <Clock className="w-4 h-4 text-[#A65F45] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#263D32] dark:text-[#FFFDF8] block mb-0.5">Returning Books at IEM Central Library</span>
          <span className="font-light">
            To return any borrowed volume, please bring the physical book to the circulation desk at Management House or Ashram Campus. The librarian will inspect the volume and immediately update your record.
          </span>
        </div>
      </div>
    </div>
  );
};
