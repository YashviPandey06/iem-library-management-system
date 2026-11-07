import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Calendar, RefreshCw, AlertCircle, BookOpen, Clock, Info } from 'lucide-react';
import { api } from '../../api/client';
import { IssueTransaction } from '../../types';
import { Badge } from '../../components/Badge';

export const StudentMyBooksPage: React.FC = () => {
  const [loans, setLoans] = useState<IssueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStudentBorrowings();
      setLoans(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch active borrowings.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Patron Record • Active Loans
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            My Borrowed Books
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            All active academic volumes currently checked out under your student library account.
          </p>
        </div>

        <button
          onClick={fetchLoans}
          disabled={loading}
          className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto"
          title="Refresh borrowings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Return instructions card */}
      <div className="p-4 rounded-2xl bg-[#EAE5D8] dark:bg-[#B96F50]/20 border border-[#DDD6C6] dark:border-[#B96F50]/40 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
        <Info className="w-4 h-4 text-[#B96F50] dark:text-[#C3A66B] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#B96F50] dark:text-white block mb-0.5">IEM Circulation Policy</span>
          <span>
            Books may be kept for a standard 14-day borrowing cycle. Return physical books to the front desk librarian at Management House or Ashram Campus to reconcile your patron ledger.
          </span>
        </div>
      </div>

      {/* Loans Container */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl border border-[#DDD6C6] dark:border-[#334D40] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#B96F50] dark:text-white tracking-tight flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-[#C3A66B]" />
            Active Loans ({loans.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {loans.length === 0 ? 'No active borrowings' : `${loans.length} volume(s) on loan`}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
            Retrieving your active loan records...
          </div>
        ) : loans.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">No active book loans</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You do not have any borrowed volumes currently checked out.
            </p>
            <Link
              to="/student/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-bold text-xs shadow-xs mt-2 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C3A66B]" />
              Browse Library Catalog
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {loans.map((loan) => (
              <div
                key={loan.transactionId}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                      {loan.bookId}
                    </span>
                    <Badge variant="warning">CURRENTLY ISSUED</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{loan.bookTitle}</h3>
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Issue Date: {loan.issueDate}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Status: On Loan (Good Standing)
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    Transaction ID
                  </span>
                  <span className="font-mono text-xs text-slate-800 dark:text-slate-300 font-medium">
                    {loan.transactionId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
