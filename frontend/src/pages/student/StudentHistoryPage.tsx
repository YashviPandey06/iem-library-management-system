import React, { useState, useEffect } from 'react';
import { History, Calendar, RefreshCw, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';
import { IssueTransaction } from '../../types';
import { Badge } from '../../components/Badge';

export const StudentHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<IssueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStudentHistory();
      setHistory(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch borrowing history.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Patron Ledger • Circulation Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Borrowing History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Complete chronological record of all previous book issuances and completed check-ins.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto"
          title="Refresh history"
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

      {/* History Table Container */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl border border-[#DDD6C6] dark:border-[#334D40] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#B96F50] dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-[#C3A66B]" />
            Complete Loan History ({history.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
            Loading transaction history...
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No borrowing records on file</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your borrowing history will appear here once you check out your first book at IEM Central Library.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {history.map((tx) => (
              <div
                key={tx.transactionId}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                      {tx.bookId}
                    </span>
                    <Badge variant={tx.status === 'ISSUED' ? 'warning' : 'success'}>
                      {tx.status}
                    </Badge>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{tx.bookTitle}</h3>
                  <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Issued: {tx.issueDate}
                    </span>
                    {tx.returnDate && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Returned: {tx.returnDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Transaction ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-xs font-medium">{tx.transactionId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
