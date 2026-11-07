import React from 'react';
import { Link } from 'react-router-dom';
import { Server, ShieldCheck, Cpu, Smartphone, ArrowLeft, Sun, Moon, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AboutPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F5F0E5] dark:bg-[#192A23] text-[#292B27] dark:text-[#F5F0E5] flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 dark:bg-[#192A23]/95 backdrop-blur-md border-b border-[#E2DAC7] dark:border-[#334D40] px-4 sm:px-8 py-3 flex items-center justify-between shadow-subtle">
        <Link to="/" className="flex items-center gap-3.5 group">
          <img
            src="/iem-logo.webp"
            alt="Institute of Engineering & Management (IEM), Kolkata"
            className="h-10 sm:h-11 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col border-l border-[#E2DAC7] dark:border-[#334D40] pl-3.5 text-left">
            <span className="font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] text-sm sm:text-base tracking-tight leading-tight uppercase">
              LIBRARY MANAGEMENT SYSTEM
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#77736B] dark:text-[#D6C5A3] tracking-normal leading-tight mt-0.5">
              Institute of Engineering & Management, Kolkata
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-xs sm:text-sm font-medium text-[#55524B] dark:text-[#F5F0E5]">
          <Link to="/" className="hover:text-[#A65F45] dark:hover:text-[#D6C5A3] transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-[#A65F45] dark:hover:text-[#D6C5A3] transition-colors">Holdings Catalogue</Link>
          <Link to="/about" className="text-[#263D32] dark:text-[#FFFDF8] font-serif font-bold">About IEM Library</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#77736B] hover:text-[#263D32] hover:bg-[#E2DAC7]/40 border border-[#E2DAC7] dark:text-[#D6C5A3] dark:hover:text-[#FFFDF8] dark:hover:bg-[#263D32] dark:border-[#334D40] transition-colors"
            title={isDark ? 'Switch to Parchment Day Theme' : 'Switch to Botanical Night Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D6C5A3]" /> : <Moon className="w-4 h-4 text-[#55524B]" />}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#292B27] dark:text-[#FFFDF8] bg-[#F5F0E5] dark:bg-[#263D32] hover:bg-[#EAE3D2] dark:hover:bg-[#334D40] transition-colors border border-[#E2DAC7] dark:border-[#334D40]"
          >
            Patron / Staff Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" className="text-xs text-[#77736B] dark:text-[#D6C5A3] hover:text-[#A65F45] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Home
            </Link>
            <span className="text-[#D6C5A3] dark:text-[#405F50] text-xs">/</span>
            <span className="text-xs text-[#263D32] dark:text-[#FFFDF8] font-semibold">About Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#263D32] dark:text-[#FFFDF8] tracking-tight">
            About Central Library & Library Management System
          </h1>
          <p className="text-xs sm:text-sm text-[#77736B] dark:text-[#F5F0E5] mt-2 leading-relaxed font-light">
            A unified, multi-platform academic library management system engineered for deterministic SQLite transactions, real-time circulation tracking, and specialized role-based workflows for scholars and librarians at the Institute of Engineering & Management, Kolkata.
          </p>
        </div>

        {/* Institution Profile Card */}
        <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-3xl overflow-hidden border border-[#E2DAC7] dark:border-[#334D40] shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 relative min-h-[220px] bg-[#13241D] p-5 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E2DAC7] dark:border-[#334D40]">
              {/* Programmatic Archive Diagram */}
              <div className="w-full h-full rounded-2xl border border-[#C3A66B]/30 bg-[#0E1A15] p-4 flex flex-col justify-between font-mono text-[8.5px] text-[#C3A66B]">
                <div className="flex justify-between border-b border-[#C3A66B]/20 pb-1.5">
                  <span className="font-bold tracking-widest text-[#FFFDF8]">IEM CENTRAL ARCHIVE</span>
                  <span className="text-[#D6C5A3]/60">EST. 1989</span>
                </div>
                <div className="py-3 space-y-2 text-[#E0D7C3]">
                  <div className="flex items-center justify-between">
                    <span>STACKS FLOOR AREA</span>
                    <span className="text-white font-bold">14,500 SQ FT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>READING CARRELS</span>
                    <span className="text-white font-bold">120 SEATS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>PHYSICAL VOLUMES</span>
                    <span className="text-[#C3A66B] font-bold">45,000+ VOLS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DIGITAL TERMINALS</span>
                    <span className="text-white font-bold">32 WORKSTATIONS</span>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-[#C3A66B]/20 flex justify-between text-[7.5px] text-[#D6C5A3]/70">
                  <span>SALT LAKE SECTOR V</span>
                  <span>ACC-GRADE 'A'</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 p-6 sm:p-8 space-y-3 flex flex-col justify-center text-left">
              <div className="flex items-center gap-3">
                <img
                  src="/iem-logo.webp"
                  alt="IEM Official Emblem"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#263D32] dark:text-[#FFFDF8] leading-tight">
                    Institute of Engineering & Management, Kolkata
                  </h2>
                  <span className="text-[10px] text-[#77736B] dark:text-[#D6C5A3]">
                    Salt Lake Electronics Complex, Sector V
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#55524B] dark:text-[#F5F0E5] leading-relaxed font-light">
                Established in 1989, IEM is one of the premier engineering and management institutions in Eastern India. The Central Library caters to undergraduate, postgraduate, and doctoral scholars across diverse technical departments with thousands of physical texts, reference volumes, research journals, and digital stacks.
              </p>

              <div className="flex items-center gap-4 text-xs text-[#55524B] dark:text-[#F5F0E5] pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A65F45]" />
                  Salt Lake Electronics Complex, Sector V, Kolkata — 700091
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-6 border border-[#E2DAC7] dark:border-[#334D40] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] text-[#263D32] dark:text-[#D6C5A3] flex items-center justify-center border border-[#E2DAC7] dark:border-[#334D40]">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#263D32] dark:text-[#FFFDF8]">Kotlin Ktor 2.3 & Netty Engine</h3>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] leading-relaxed font-light">
              Asynchronous non-blocking coroutines runtime delivering sub-millisecond API response times for library circulation and catalog discovery queries.
            </p>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-6 border border-[#E2DAC7] dark:border-[#334D40] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] text-[#1E4D2B] dark:text-[#88D08D] flex items-center justify-center border border-[#E2DAC7] dark:border-[#334D40]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#263D32] dark:text-[#FFFDF8]">ACID SQLite with Coroutine Mutex</h3>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] leading-relaxed font-light">
              JetBrains Exposed ORM providing strictly ordered transactions, preventing race conditions or overselling during peak library lending periods.
            </p>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-6 border border-[#E2DAC7] dark:border-[#334D40] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] text-[#A65F45] dark:text-[#D6C5A3] flex items-center justify-center border border-[#E2DAC7] dark:border-[#334D40]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#263D32] dark:text-[#FFFDF8]">Multi-Tier Interface Ecosystem</h3>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] leading-relaxed font-light">
              Modern React 18 TypeScript web client, Jetpack Compose Android client, and Kotlin console client operating on the exact same underlying dataset.
            </p>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-6 border border-[#E2DAC7] dark:border-[#334D40] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F0E5] dark:bg-[#192A23] text-[#7A602B] dark:text-[#E2C37E] flex items-center justify-center border border-[#E2DAC7] dark:border-[#334D40]">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#263D32] dark:text-[#FFFDF8]">Role-Based Access Control</h3>
            <p className="text-xs text-[#77736B] dark:text-[#F5F0E5] leading-relaxed font-light">
              BCrypt hashed credentials, cryptographic session bearer tokens, and route guards separating the public catalogue from librarian desk controls.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2DAC7] dark:border-[#334D40] bg-[#FFFDF8] dark:bg-[#192A23] py-8 px-4 sm:px-8 text-center text-xs text-[#77736B] dark:text-[#F5F0E5]">
        &copy; {new Date().getFullYear()} Institute of Engineering & Management (IEM), Kolkata. All rights reserved.
      </footer>
    </div>
  );
};
