import React, { useState, useEffect } from 'react';
import { History, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { IssueTransaction } from '../types';
import { Badge } from '../components/Badge';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<IssueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'RETURNED'>('ALL');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch transaction logs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((tx) => {
    if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
    const q = search.toLowerCase();
    return (
      tx.transactionId.toLowerCase().includes(q) ||
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
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Central Library • Audit Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Transaction Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Immutable SQLite transaction logs tracking all circulation checkouts, returns, and inventory updates.
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto"
          title="Refresh transaction log"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Tx ID, Book, or Student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B96F50]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#B96F50]"
            >
              <option value="ALL">All Records ({transactions.length})</option>
              <option value="ISSUED">Currently Issued</option>
              <option value="RETURNED">Completed Returns</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EAE5D8] dark:bg-[#192A23] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Book ID & Title</th>
                <th className="px-5 py-3.5">Student Patron</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5">Return Date</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
                    Fetching audit trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <History className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No transaction logs found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit logs will be generated as circulation checkouts occur.</p>
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
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {tx.returnDate || <span className="text-amber-800 dark:text-amber-400 font-medium font-sans">Active Loan</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Badge variant={tx.status === 'ISSUED' ? 'warning' : 'success'}>
                        {tx.status}
                      </Badge>
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
            Loading audit events...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <History className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            No audit events found
          </div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.transactionId} className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                  {tx.bookId}
                </span>
                <Badge variant={tx.status === 'ISSUED' ? 'warning' : 'success'}>
                  {tx.status}
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tx.bookTitle}</h4>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                <p>Patron: <strong className="text-slate-900 dark:text-slate-200">{tx.studentName || tx.studentId}</strong></p>
                <p className="font-mono text-[11px]">Issued: {tx.issueDate}</p>
                {tx.returnDate && <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">Returned: {tx.returnDate}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
