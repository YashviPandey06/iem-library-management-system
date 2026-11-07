import React, { useState } from 'react';
import { Database, RotateCcw, CheckCircle2, AlertCircle, Server } from 'lucide-react';
import { api } from '../api/client';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Badge } from '../components/Badge';

export const SettingsPage: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset dialog
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.seedData();
      setSuccessMsg(res.message || 'Sample library records populated successfully.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to seed data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.resetData();
      setSuccessMsg(res.message || 'Database reset successfully to empty state.');
      setIsResetConfirmOpen(false);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to reset database.');
      }
      setIsResetConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            Institute of Engineering & Management, Kolkata
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            System & Database Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage SQLite persistence, demo datasets, runtime architecture, and API documentation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" dot={true}>
            Ktor Netty Running
          </Badge>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Database Seeding & Reset Panel */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#B96F50] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#C3A66B]" />
            Database Persistence & Sample Management
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Deterministic and idempotent data management tools for evaluation and testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Populate Evaluation Dataset</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Loads standard reference textbooks, engineering volumes, and registered student accounts into SQLite.
              </p>
            </div>
            <div className="mt-5">
              <button
                onClick={handleSeed}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? 'Populating...' : 'Seed Evaluation Records'}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/20 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-rose-900 dark:text-rose-300 text-sm mb-1">Reset Database to Empty State</h3>
              <p className="text-xs text-rose-800/80 dark:text-rose-400/80 leading-relaxed">
                Clears all book records, student patrons, and circulation transaction logs. Reinitializes clean SQLite schema.
              </p>
            </div>
            <div className="mt-5">
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Architecture Specifications */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#B96F50] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-[#C3A66B]" />
          IEM System Architecture & Runtime Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">Backend Runtime</span>
            <p className="font-bold text-slate-900 dark:text-white">Kotlin 1.9.24 / Ktor 2.3.11</p>
            <p className="text-slate-500 text-[11px]">Asynchronous non-blocking coroutines with Netty engine</p>
          </div>
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">Database Engine</span>
            <p className="font-bold text-slate-900 dark:text-white">SQLite 3 / Exposed ORM</p>
            <p className="text-slate-500 text-[11px]">Persistent file `library.db` with mutex-guarded atomic transactions</p>
          </div>
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">Frontend Architecture</span>
            <p className="font-bold text-slate-900 dark:text-white">React 18 / TypeScript / Tailwind CSS</p>
            <p className="text-slate-500 text-[11px]">Vite dev server with light/dark theme switching</p>
          </div>
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">Host Institution</span>
            <p className="font-bold text-slate-900 dark:text-white">IEM Kolkata</p>
            <p className="text-slate-500 text-[11px]">Institute of Engineering & Management, Salt Lake Sector V</p>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleReset}
        title="Reset Entire Database"
        message="Are you certain you want to reset the database? All books, student patrons, and transactions will be permanently deleted."
        confirmLabel="Reset Database"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
};
