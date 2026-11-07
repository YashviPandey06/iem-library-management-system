import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'LIBRARIAN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#192A23] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-[#F6F3EA] dark:bg-[#263D32] rounded-3xl p-8 sm:p-10 max-w-md w-full border border-[#DDD6C6] dark:border-[#334D40] shadow-card">
        <Link to="/" className="inline-block mb-4">
          <img
            src="/iem-logo.webp"
            alt="Institute of Engineering & Management (IEM), Kolkata"
            className="h-12 w-auto object-contain mx-auto"
          />
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-extrabold text-[#172033] dark:text-white tracking-tight">
          Institutional Access Restricted
        </h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {user ? (
            <>
              You are signed in as <span className="font-bold text-[#172033] dark:text-white">{user.name}</span> with role{' '}
              <span className="font-mono text-[#B96F50] dark:text-blue-300 font-bold">[{user.role}]</span>. Your account does not have authorization to access this administrative library section.
            </>
          ) : (
            'You do not have the required permissions to view this resource.'
          )}
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleReturnToDashboard}
            className="w-full py-2.5 px-4 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Return to My Authorized Portal</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full py-2.5 px-4 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium text-xs transition-colors"
          >
            Sign Out of Current Account
          </button>
        </div>
      </div>
    </div>
  );
};
