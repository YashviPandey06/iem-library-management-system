import React from 'react';
import { ShieldCheck, LogOut, BookOpen, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/Badge';

export const StudentProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
          Institute of Engineering & Management, Kolkata
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
          Patron Profile & Institutional Card
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Review your verified academic library membership credentials, borrowing privileges, and circulation guidelines.
        </p>
      </div>

      {/* Official Patron ID Card */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl p-6 sm:p-8 border border-[#DDD6C6] dark:border-[#334D40] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#B96F50] text-white font-extrabold text-2xl flex items-center justify-center shadow-md border border-[#9C5538]">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                <Badge variant="info">IEM Enrolled Student</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Patron Card ID: <strong className="text-[#B96F50] dark:text-white">{user?.userId}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all self-start sm:self-auto shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Full Legal Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm block">{user?.name}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Official Institutional Email</span>
            <span className="font-mono text-slate-900 dark:text-white text-sm block">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Registered Affiliation</span>
            <span className="font-semibold text-[#B96F50] dark:text-amber-400 text-sm block flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#C3A66B]" />
              IEM Central Library (Sector V, Salt Lake)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider">Borrowing Privilege Standing</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Good Standing • Zero Overdue Dues
            </span>
          </div>
        </div>
      </div>

      {/* Circulation Guidelines */}
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-2xl p-6 sm:p-8 border border-[#DDD6C6] dark:border-[#334D40] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#B96F50] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#C3A66B]" />
          IEM Academic Library Circulation Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Standard 14-Day Loan Period</span>
            <p className="text-slate-500 dark:text-slate-400">All registered course textbooks, conference proceedings, and references can be borrowed for up to 14 calendar days.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#EAE5D8] dark:bg-[#192A23] border border-slate-200 dark:border-white/5 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Physical Inspection on Return</span>
            <p className="text-slate-500 dark:text-slate-400">Returns must be verified at the circulation counter to instantly update your digital account in the SQLite repository.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
