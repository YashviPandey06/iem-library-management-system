import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowDownLeft, Search, CheckCircle2, AlertCircle, RefreshCw, BookCheck, ArrowLeft, User } from 'lucide-react';
import { api } from '../api/client';
import { IssueTransaction } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const ReturnBookPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [bookId, setBookId] = useState(searchParams.get('bookId') || '');
  const [studentId, setStudentId] = useState(searchParams.get('studentId') || '');

  const [activeIssues, setActiveIssues] = useState<IssueTransaction[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Return confirmation
  const [confirmingTx, setConfirmingTx] = useState<{ bookId: string; studentId: string; bookTitle: string } | null>(null);

  const fetchActiveIssues = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const list = await api.getActiveIssues();
      setActiveIssues(list);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to load active issue records.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveIssues();
  }, []);

  const handleReturnDirect = (bId: string, sId: string, title: string) => {
    setConfirmingTx({ bookId: bId, studentId: sId, bookTitle: title });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId.trim() || !studentId.trim()) {
      setErrorMsg('Please specify both Book ID and Student ID.');
      return;
    }
    const match = activeIssues.find(
      (tx) =>
        tx.bookId.toLowerCase() === bookId.trim().toLowerCase() &&
        tx.studentId.toLowerCase() === studentId.trim().toLowerCase()
    );
    const title = match ? match.bookTitle : bookId.trim();
    handleReturnDirect(bookId.trim(), studentId.trim(), title);
  };

  const processReturn = async () => {
    if (!confirmingTx) return;
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const res = await api.returnBook(confirmingTx.bookId, confirmingTx.studentId);
      setSuccessMsg(
        `Book "${res.bookTitle}" (ID: ${res.bookId}) successfully returned by Student ${res.studentId}! Physical shelf inventory increased by 1.`
      );
      setConfirmingTx(null);
      setBookId('');
      setStudentId('');
      fetchActiveIssues();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Return failed.');
      }
      setConfirmingTx(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIssues = activeIssues.filter((tx) => {
    const q = searchFilter.toLowerCase();
    return (
      tx.bookId.toLowerCase().includes(q) ||
      tx.bookTitle.toLowerCase().includes(q) ||
      tx.studentId.toLowerCase().includes(q) ||
      (tx.studentName && tx.studentName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <Link
          to="/admin/active-issues"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#B96F50] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Active Issues Registry</span>
        </Link>
        <span className="text-[11px] font-mono font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
          Assignment Task 5
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Central Library • Check-in Counter
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Return Book & Inventory Check-in
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Reconcile outstanding student loans, replenish physical shelf stock, and record audit timestamps.
          </p>
        </div>
        <button
          onClick={fetchActiveIssues}
          disabled={loading}
          className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs self-start sm:self-auto disabled:opacity-50"
          title="Refresh active issues"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
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

      {/* Manual Return Input Panel */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-6 shadow-xs">
        <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ArrowDownLeft className="w-4 h-4 text-[#C3A66B]" />
          Process Return via Direct ID Verification
        </h2>
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Book ID *
            </label>
            <input
              type="text"
              placeholder="e.g. B101"
              value={bookId}
              onChange={(e) => setBookId(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] text-slate-900 dark:text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50] transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Student ID *
            </label>
            <input
              type="text"
              placeholder="e.g. S101"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] text-slate-900 dark:text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-[#B96F50] focus:ring-1 focus:ring-[#B96F50] transition-all"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#C3A66B] hover:bg-[#B09252] text-white font-bold text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50"
            >
              Verify & Complete Return
            </button>
          </div>
        </form>
      </div>

      {/* Active Loans Table & Cards with Quick Return */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookCheck className="w-4 h-4 text-[#C3A66B]" />
            <h3 className="font-bold text-[#B96F50] dark:text-white text-sm sm:text-base">
              Outstanding Active Loans ({activeIssues.length})
            </h3>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by book, student..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B96F50]"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EAE5D8] dark:bg-[#192A23] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-5 py-3.5">Tx ID</th>
                <th className="px-5 py-3.5">Book Title & ID</th>
                <th className="px-5 py-3.5">Student Patron</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
                    Loading active loans...
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                    <BookCheck className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400 opacity-60" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-300">No active loans found</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      All issued books are accounted for on shelf.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((tx) => (
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
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs font-mono">
                      {tx.issueDate}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleReturnDirect(tx.bookId, tx.studentId, tx.bookTitle)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-500/20 transition-all shadow-2xs"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        1-Click Return
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
          {loading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
              Loading loans...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              <BookCheck className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400 opacity-60" />
              No active loans
            </div>
          ) : (
            filteredIssues.map((tx) => (
              <div key={tx.transactionId} className="p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded">
                      {tx.bookId}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {tx.transactionId}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tx.bookTitle}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    {tx.studentName || tx.studentId} • Issued: {tx.issueDate}
                  </p>
                </div>
                <button
                  onClick={() => handleReturnDirect(tx.bookId, tx.studentId, tx.bookTitle)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 shadow-2xs"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  Return Book
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingTx && (
        <ConfirmDialog
          isOpen={!!confirmingTx}
          onClose={() => setConfirmingTx(null)}
          onConfirm={processReturn}
          title="Confirm Book Return"
          message={`Are you sure you want to mark "${confirmingTx.bookTitle}" (${confirmingTx.bookId}) as returned by Student ${confirmingTx.studentId}? Shelf inventory will be incremented by 1.`}
          confirmLabel="Confirm Return"
          variant="warning"
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};
