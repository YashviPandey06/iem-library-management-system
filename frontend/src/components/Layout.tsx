import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  BookCheck,
  Users,
  History,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Periodic Backend Health Check
  const checkHealth = async () => {
    try {
      const res = await api.checkHealth();
      setIsBackendHealthy(res.status === 'HEALTHY');
    } catch {
      setIsBackendHealthy(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/books', label: 'Holdings Catalogue', icon: BookOpen },
    { to: '/admin/books/add', label: 'Add New Volume', icon: PlusCircle },
    { to: '/admin/issue', label: 'Issue Volume', icon: ArrowUpRight },
    { to: '/admin/return', label: 'Check-In Return', icon: ArrowDownLeft },
    { to: '/admin/active-issues', label: 'Active Circulations', icon: BookCheck },
    { to: '/admin/students', label: 'Patron Registry', icon: Users },
    { to: '/admin/transactions', label: 'Transaction Audit', icon: History },
    { to: '/admin/settings', label: 'System & Database', icon: Settings },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/books?search=${encodeURIComponent(searchQuery.trim())}`);
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
        {/* Brand header with IEM Logo */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#334D40] bg-[#121F19]">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
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

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#263D32] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#263D32]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#263D32] text-[#FFFDF8] font-semibold shadow-xs border-l-4 border-[#D6C5A3]'
                      : 'text-[#F5F0E5]/80 hover:text-[#FFFDF8] hover:bg-[#263D32]/60'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#D6C5A3]" />
                {(!collapsed || mobileMenuOpen) && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* System & Database Connection Status */}
        <div className="p-3 border-t border-[#334D40] bg-[#121F19]">
          <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isBackendHealthy === true
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : isBackendHealthy === false
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex flex-col text-[11px] leading-tight text-left">
                <span className="font-semibold text-[#FFFDF8]">
                  {isBackendHealthy === true ? 'IEM Database Live' : isBackendHealthy === false ? 'Offline' : 'Connecting...'}
                </span>
                <span className="text-[10px] text-[#D6C5A3] font-mono">SQLite (library.db)</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-[#FFFDF8] dark:bg-[#192A23] border-b border-[#E2DAC7] dark:border-[#334D40] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 z-30 transition-colors shadow-subtle">
          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-[#77736B] hover:text-[#292B27] hover:bg-[#E2DAC7]/40 dark:text-[#D6C5A3] dark:hover:text-[#FFFDF8] dark:hover:bg-[#263D32] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Catalog Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <form onSubmit={handleQuickSearch} className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736B]" />
              <input
                type="text"
                placeholder="Search catalog by title, author, or book ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 text-xs md:text-sm bg-[#F5F0E5] dark:bg-[#263D32] border border-[#E2DAC7] dark:border-[#334D40] rounded-xl text-[#292B27] dark:text-[#FFFDF8] placeholder-[#77736B] focus:outline-none focus:border-[#A65F45] focus:ring-1 focus:ring-[#A65F45] transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-[#77736B] bg-[#E2DAC7] dark:bg-[#334D40] hidden sm:inline-block">
                Enter
              </span>
            </form>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#77736B] hover:text-[#292B27] hover:bg-[#E2DAC7]/40 border border-[#E2DAC7] dark:text-[#D6C5A3] dark:hover:text-[#FFFDF8] dark:hover:bg-[#263D32] dark:border-[#334D40] transition-colors"
              title={isDark ? 'Switch to Parchment Day Theme' : 'Switch to Botanical Night Theme'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#D6C5A3]" /> : <Moon className="w-4 h-4 text-[#55524B]" />}
            </button>

            {/* Public catalog quick link */}
            <Link
              to="/catalog"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#263D32] dark:text-[#D6C5A3] bg-[#F5F0E5] dark:bg-[#263D32] hover:bg-[#EAE3D2] dark:hover:bg-[#334D40] border border-[#E2DAC7] dark:border-[#334D40] transition-colors"
            >
              <span>Public Archive</span>
              <ExternalLink className="w-3 h-3 text-[#A65F45]" />
            </Link>

            {/* Librarian Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-[#DDD6C6] dark:border-[#334D40] text-left focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#263D32] text-[#F6F3EA] font-serif font-bold flex items-center justify-center text-xs shadow-xs border border-[#C3A66B]/30">
                  {user?.name?.charAt(0) || 'L'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#292B27] dark:text-[#F6F3EA] leading-tight">
                    {user?.name || 'Chief Librarian'}
                  </span>
                  <span className="text-[10px] text-[#77776D] dark:text-[#C3A66B]">
                    Administrator [{user?.userId}]
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Popup */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[#DDD6C6] dark:border-[#334D40] text-left">
                    <p className="text-xs font-serif font-bold text-[#263D32] dark:text-[#F6F3EA]">{user?.name || 'Chief Librarian'}</p>
                    <p className="text-[11px] text-[#77776D] dark:text-[#C3A66B] font-mono">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#1E4D2B] dark:text-[#88D08D] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Central Library Staff Access
                    </div>
                  </div>
                  <div className="px-2 py-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/admin/books/add');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#52544E] dark:text-[#EAE5D8] hover:bg-[#EAE5D8] dark:hover:bg-[#192A23] rounded-xl transition-colors flex items-center gap-2"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#B96F50]" />
                      Add Book to Inventory
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/admin/issue');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#52544E] dark:text-[#EAE5D8] hover:bg-[#EAE5D8] dark:hover:bg-[#192A23] rounded-xl transition-colors flex items-center gap-2"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#1E4D2B]" />
                      Issue Book to Student
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/admin/settings');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#52544E] dark:text-[#EAE5D8] hover:bg-[#EAE5D8] dark:hover:bg-[#192A23] rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#77776D]" />
                      System & Database Settings
                    </button>
                    <div className="border-t border-[#DDD6C6] dark:border-[#334D40] my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-[#B96F50] hover:bg-[#F9ECE7] dark:hover:bg-[#382119] rounded-xl transition-colors flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
