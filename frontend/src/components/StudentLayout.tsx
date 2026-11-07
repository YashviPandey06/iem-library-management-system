import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  History,
  User,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: '/student/dashboard', label: 'Scholar Dashboard', icon: LayoutDashboard },
    { to: '/student/catalog', label: 'Holdings Catalogue', icon: BookOpen },
    { to: '/student/my-books', label: 'Active Loans', icon: BookMarked },
    { to: '/student/history', label: 'Circulation History', icon: History },
    { to: '/student/profile', label: 'Scholar Profile', icon: User },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/student/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F5F0E5] dark:bg-[#192A23] text-[#292B27] dark:text-[#FFFDF8] overflow-hidden font-sans transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#192A23]/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Botanical Forest Green & Muted Sand */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#192A23] text-[#FFFDF8] flex flex-col transition-all duration-300 ease-in-out shadow-xl border-r border-[#334D40] ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with IEM Logo */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#334D40] bg-[#121F19]">
          <Link to="/student/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="/iem-logo-white.webp"
              alt="IEM Official Logo"
              className="h-9 w-auto object-contain shrink-0"
            />
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex flex-col truncate border-l border-[#334D40] pl-2.5 text-left">
                <span className="font-serif font-bold text-[#FFFDF8] text-xs tracking-tight leading-none uppercase">
                  LIBRARY MANAGEMENT SYSTEM
                </span>
                <span className="text-[9px] text-[#D6C5A3] tracking-tight mt-1 truncate">
                  Institute of Engineering & Management
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#263D32] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#263D32]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#263D32] text-[#FFFDF8] font-semibold shadow-xs border-l-4 border-[#D6C5A3]'
                    : 'text-[#F5F0E5]/80 hover:text-[#FFFDF8] hover:bg-[#263D32]/60'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed && !mobileMenuOpen ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#D6C5A3]" />
                {(!collapsed || mobileMenuOpen) && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Student ID & Logout */}
        <div className="p-3 border-t border-[#334D40] bg-[#121F19] space-y-2">
          {(!collapsed || mobileMenuOpen) && (
            <div className="px-3 py-2 rounded-xl bg-[#263D32] border border-[#334D40] text-xs text-left">
              <span className="text-[10px] text-[#D6C5A3] block uppercase tracking-wider font-medium">Patron Card</span>
              <span className="font-mono font-bold text-[#FFFDF8] text-sm">{user?.userId || 'STUDENT'}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[#F5F0E5] hover:text-[#FFFDF8] hover:bg-[#263D32] transition-colors"
              title="Return to Public Catalogue"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D6C5A3]" />
              {(!collapsed || mobileMenuOpen) && <span>Public Site</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#F0A892] hover:text-white hover:bg-[#A65F45]/40 transition-colors"
              title="Sign out of student portal"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {(!collapsed || mobileMenuOpen) && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F0E5] dark:bg-[#192A23]">
        {/* Top Navbar */}
        <header className="h-16 bg-[#FFFDF8] dark:bg-[#192A23] border-b border-[#E2DAC7] dark:border-[#334D40] px-4 md:px-6 flex items-center justify-between z-20 shrink-0 shadow-subtle transition-colors">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#77776D] hover:text-[#292B27] hover:bg-[#E2DAC7]/40 dark:text-[#D6C5A3] dark:hover:text-[#FFFDF8] dark:hover:bg-[#263D32] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleQuickSearch} className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77776D]" />
              <input
                type="text"
                placeholder="Search IEM catalog by title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F5F0E5] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] rounded-xl text-[#292B27] dark:text-[#FFFDF8] placeholder-[#77776D] focus:outline-none focus:border-[#A65F45] focus:ring-1 focus:ring-[#A65F45] transition-all"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#77776D] hover:text-[#292B27] hover:bg-[#E2DAC7]/40 border border-[#E2DAC7] dark:text-[#D6C5A3] dark:hover:text-[#FFFDF8] dark:hover:bg-[#263D32] dark:border-[#334D40] transition-colors"
              title={isDark ? 'Switch to Parchment Day Theme' : 'Switch to Botanical Night Theme'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#D6C5A3]" /> : <Moon className="w-4 h-4 text-[#55524B]" />}
            </button>

            {/* Student Profile Pill */}
            <Link
              to="/student/profile"
              className="flex items-center gap-2.5 pl-3 border-l border-[#E2DAC7] dark:border-[#334D40] hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-[#263D32] text-[#FFFDF8] font-serif font-bold flex items-center justify-center text-xs shadow-xs border border-[#D6C5A3]/30">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#292B27] dark:text-[#FFFDF8] leading-tight">
                  {user?.name || 'Scholar'}
                </span>
                <span className="text-[10px] text-[#77776D] dark:text-[#D6C5A3] font-mono">
                  {user?.userId}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
