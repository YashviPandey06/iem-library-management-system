import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookCheck, Search, RefreshCw, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle2, User, Calendar } from 'lucide-react';
import { api } from '../api/client';
import { IssueTransaction } from '../types';
import { Badge } from '../components/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const IssuedBooksPage: React.FC = () => {
  const [activeIssues, setActiveIssues] = useState<IssueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Quick return dialog state
  const [returningItem, setReturningItem] = useState<IssueTransaction | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  const fetchActive = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getActiveIssues();
      setActiveIssues(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch active issues.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  const handleReturnConfirm = async () => {
    if (!returningItem) return;
    try {
      setIsReturning(true);
      await api.returnBook(returningItem.bookId, returningItem.studentId);
      setSuccessMsg(
        `Book "${returningItem.bookTitle}" successfully returned by Student ${returningItem.studentId}.`
      );
      setReturningItem(null);
      fetchActive();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to return book.');
      }
      setReturningItem(null);
    } finally {
      setIsReturning(false);
    }
  };

  const filtered = activeIssues.filter((tx) => {
    const q = search.toLowerCase();
    return (
      tx.bookId.toLowerCase().includes(q) ||
      tx.bookTitle.toLowerCase().includes(q) ||
      tx.studentId.toLowerCase().includes(q) ||
      (tx.studentName && tx.studentName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
              Assignment Task 6
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Active Issued Books Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time ledger of outstanding borrowings requiring return reconciliation at IEM Central Library.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchActive}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs disabled:opacity-50"
            title="Refresh active issues"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/issue"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-[#C3A66B]" />
            <span>Issue New Book</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by book, title, student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B96F50]"
          />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Showing <span className="text-[#B96F50] dark:text-white font-bold">{filtered.length}</span> of {activeIssues.length} active borrowings
        </div>
      </div>

      {/* Desktop Structured Table */}
      <div className="hidden md:block bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EAE5D8] dark:bg-[#192A23] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-5 py-3.5">Tx ID</th>
                <th className="px-5 py-3.5">Book ID & Title</th>
                <th className="px-5 py-3.5">Student Patron</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
                    Fetching active issue records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <BookCheck className="w-10 h-10 mx-auto mb-3 text-emerald-600 dark:text-emerald-400 opacity-60" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No active issued books</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      All books are currently present on IEM library shelves.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {tx.transactionId}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{tx.bookTitle}</div>
                      <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B]">{tx.bookId}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{tx.studentName || 'Student'}</div>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{tx.studentId}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {tx.issueDate}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant="warning">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setReturningItem(tx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-500/20 transition-all shadow-2xs"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        Return
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-3.5">
        {loading ? (
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
            Loading active borrowings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <BookCheck className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400 opacity-60" />
            No active borrowings found
          </div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.transactionId} className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                    {tx.bookId}
                  </span>
                  <Badge variant="warning">ISSUED</Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{tx.bookTitle}</h3>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#B96F50] dark:text-cyan-400" />
                    {tx.studentName || 'Student'} ({tx.studentId})
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Issued: {tx.issueDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReturningItem(tx)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all shadow-2xs"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Return Book
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      {returningItem && (
        <ConfirmDialog
          isOpen={!!returningItem}
          onClose={() => setReturningItem(null)}
          onConfirm={handleReturnConfirm}
          title="Return Issued Book"
          message={`Confirm return of "${returningItem.bookTitle}" (Book ID: ${returningItem.bookId}) by Student ${returningItem.studentId}? Shelf inventory will be updated immediately.`}
          confirmLabel="Confirm Return"
          variant="warning"
          isLoading={isReturning}
        />
      )}
    </div>
  );
};
