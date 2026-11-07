import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, RefreshCw, UserCheck, Mail, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { api } from '../api/client';
import { Student } from '../types';
import { Modal } from '../components/Modal';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add student modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = search.trim() ? await api.searchStudents(search.trim()) : await api.getStudents();
      setStudents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch students.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim() || !newName.trim()) {
      setAddError('Student ID and name are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setAddError(null);
      await api.createStudent({
        studentId: newStudentId.trim().toUpperCase(),
        name: newName.trim(),
        email: newEmail.trim() || undefined,
      });
      setSuccessMsg(`Student "${newName.trim()}" (ID: ${newStudentId.trim().toUpperCase()}) registered successfully.`);
      setIsAddOpen(false);
      setNewStudentId('');
      setNewName('');
      setNewEmail('');
      fetchStudents();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddError(err.message);
      } else {
        setAddError('Failed to register student.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD6C6] dark:border-[#334D40]">
        <div>
          <span className="text-xs font-bold text-[#C3A66B] uppercase tracking-wider block mb-1">
            IEM Central Library • Patron Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#B96F50] dark:text-white tracking-tight">
            Students Registry & Patrons
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Registered library patron directory with loan eligibility verification and official contact records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] bg-[#F6F3EA] dark:bg-[#263D32] text-slate-700 dark:text-slate-300 hover:text-[#B96F50] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-xs disabled:opacity-50"
            title="Refresh students"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setAddError(null);
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-[#C3A66B]" />
            <span>Register New Student</span>
          </button>
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
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#B96F50]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white font-medium text-xs sm:text-sm transition-colors shadow-2xs"
          >
            Search
          </button>
        </form>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Total Registered Patrons: <span className="text-[#B96F50] dark:text-white font-bold">{students.length}</span>
        </div>
      </div>

      {/* Students Table for Desktop */}
      <div className="hidden md:block bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EAE5D8] dark:bg-[#192A23] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Full Legal Name</th>
                <th className="px-5 py-3.5">Institutional Email</th>
                <th className="px-5 py-3.5 text-center">Patron Status</th>
                <th className="px-5 py-3.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B96F50] dark:text-white" />
                    Querying student registry...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No students found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Register a new student patron to enable circulation checkouts.</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-xs text-[#B96F50] dark:text-[#C3A66B]">
                      {student.studentId}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-mono text-xs">
                      {student.email || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Active Patron
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-500 dark:text-slate-400">
                      IEM Salt Lake
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
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            No student records found
          </div>
        ) : (
          students.map((student) => (
            <div key={student.studentId} className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-4 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#B96F50] dark:text-[#C3A66B] bg-[#EAE5D8] dark:bg-white/10 px-2 py-0.5 rounded border border-[#DDD6C6] dark:border-white/10">
                  {student.studentId}
                </span>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</h3>
              {student.email && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Student Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Register New Student Patron"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 font-sans">
            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-medium">
                {addError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Student Patron ID *
              </label>
              <input
                type="text"
                placeholder="e.g. S106 or IEM2024CS042"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white font-mono outline-none focus:border-[#B96F50]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Legal Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sourav Mukherjee"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#B96F50]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Institutional Email (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. sourav@iemcal.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#EAE5D8] dark:bg-[#192A23] border border-[#DDD6C6] dark:border-[#334D40] rounded-xl text-slate-900 dark:text-white font-mono outline-none focus:border-[#B96F50]"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DDD6C6] dark:border-[#334D40]">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B96F50] hover:bg-[#9C5538] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#C3A66B]" />
                <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
