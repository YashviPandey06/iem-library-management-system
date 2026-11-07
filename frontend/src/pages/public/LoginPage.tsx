import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sun,
  Moon,
  Shield,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { DistantFloatingBook } from '../../components/background/DistantFloatingBook';
import { DriftingParchmentPage } from '../../components/background/DriftingParchmentPage';
import { GoldenDustCanvas } from '../../components/GoldenDustCanvas';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<'librarian' | 'student' | null>(null);

  // Input focus tracking for custom styling
  const [focusedField, setFocusedField] = useState<'identifier' | 'password' | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotPasswordNotice(false);

    if (!identifier.trim() || !password.trim()) {
      setError('Please provide both User ID/Email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(identifier.trim(), password.trim(), rememberMe);

      // Brief elegant success animation state before navigating
      setLoginSuccess(user.role === 'LIBRARIAN' ? 'Librarian Administration Terminal' : 'Scholar Circulation Portal');

      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
        } else if (user.role === 'LIBRARIAN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }, 700);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleDemoFill = (id: string, pass: string, role: 'librarian' | 'student') => {
    setIdentifier(id);
    setPassword(pass);
    setSelectedDemoRole(role);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#09140F] text-[#FFFDF8] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none font-sans">
      {/* ==============================================================
          LAYER 1: ATMOSPHERIC LIVING LIBRARY MULTI-RADIAL BACKGROUND
          ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core Multi-Radial Lighting Gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, #183327 0%, #0F231A 45%, #08130E 100%)',
          }}
        />

        {/* Ambient Moving Gold Lighting Aura (Layer 5) */}
        <div
          className="absolute -top-24 -left-24 w-[550px] h-[550px] rounded-full animate-aura-1 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(195, 166, 107, 0.16) 0%, rgba(195, 166, 107, 0.04) 50%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Secondary Shifting Deep Olive/Terracotta Aura */}
        <div
          className="absolute -bottom-32 right-[-8%] w-[620px] h-[620px] rounded-full animate-aura-2 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(166, 95, 69, 0.12) 0%, rgba(30, 62, 51, 0.18) 50%, transparent 75%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Subtle Diagonal Volumetric Light Shaft */}
        <div
          className="absolute -top-40 left-1/3 w-[260px] h-[850px] animate-beam-shift pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(195, 166, 107, 0.08), rgba(245, 240, 229, 0.03), transparent)',
            filter: 'blur(35px)',
            transform: 'rotate(-24deg)',
          }}
        />

        {/* Fine Architectural Blueprint Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #C3A66B 1px, transparent 1px), linear-gradient(to bottom, #C3A66B 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Edge Vignettes */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ==============================================================
          LAYER 4: GOLDEN DUST CANVAS PARTICLES
          ============================================================== */}
      <GoldenDustCanvas className="opacity-65 pointer-events-none z-[1]" />

      {/* ==============================================================
          LAYER 2 & 3: DISTANT FLOATING HARDCOVER BOOKS & DRIFTING PAGES
          (Positioned symmetrically in margins so they never obstruct form)
          ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {/* Top-Left: Burgundy Hardcover Volume */}
        <DistantFloatingBook
          color="burgundy"
          size="md"
          variant={1}
          style={{ top: '12%', left: '6%' }}
        />

        {/* Top-Right: Antique Gold Hardcover Volume */}
        <DistantFloatingBook
          color="gold"
          size="md"
          variant={2}
          style={{ top: '16%', right: '7%' }}
        />

        {/* Mid-Left: Terracotta Volume */}
        <DistantFloatingBook
          color="terracotta"
          size="sm"
          variant={3}
          style={{ top: '56%', left: '4%' }}
        />

        {/* Mid-Right: Forest Green Volume */}
        <DistantFloatingBook
          color="forest"
          size="sm"
          variant={4}
          style={{ top: '62%', right: '5%' }}
        />

        {/* Bottom-Left: Charcoal Buckram Volume */}
        <DistantFloatingBook
          color="charcoal"
          size="sm"
          variant={2}
          style={{ bottom: '10%', left: '10%' }}
        />

        {/* Bottom-Right: Walnut Morocco Volume */}
        <DistantFloatingBook
          color="walnut"
          size="md"
          variant={1}
          style={{ bottom: '12%', right: '9%' }}
        />

        {/* Drifting Parchment Leaves / Folios */}
        <DriftingParchmentPage
          variant={1}
          style={{ top: '38%', left: '3%' }}
        />
        <DriftingParchmentPage
          variant={2}
          style={{ top: '42%', right: '4%' }}
        />
        <DriftingParchmentPage
          variant={3}
          style={{ bottom: '24%', left: '7%' }}
        />
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-[#D6C5A3] hover:text-[#FFFDF8] hover:bg-[#1A3328] border border-[#C3A66B]/35 transition-colors shadow-xs"
          title={isDark ? 'Switch to Parchment Day Theme' : 'Switch to Botanical Night Theme'}
        >
          {isDark ? <Sun className="w-4 h-4 text-[#D6C5A3]" /> : <Moon className="w-4 h-4 text-[#D6C5A3]" />}
        </button>
      </div>

      {/* ==============================================================
          MAIN LOGIN INTERFACE (Smooth Staggered Entrance Choreography)
          ============================================================== */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header with Official IEM Logo (Fade + Scale Entrance) */}
        <div className="text-center space-y-3 animate-logo-entrance">
          <Link to="/" className="inline-flex flex-col items-center gap-2.5 group">
            <div className="relative">
              <img
                src="/iem-logo-white.webp"
                alt="Institute of Engineering & Management (IEM), Kolkata"
                className="h-16 w-auto object-contain mx-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-center">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#FFFDF8] tracking-tight block uppercase leading-snug">
                LIBRARY MANAGEMENT SYSTEM
              </span>
              <span className="text-xs font-serif font-medium text-[#C3A66B] block mt-0.5 tracking-wider">
                Institute of Engineering & Management, Kolkata
              </span>
              <span className="text-[11px] font-mono text-[#D6C5A3]/80 block mt-1 tracking-widest uppercase">
                Central Library Authentication Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Login Card (Layered Translucent Glass + Staggered Form Elements) */}
        <div className="bg-[#0E2018]/90 rounded-3xl p-6 sm:p-8 shadow-card border border-[#C3A66B]/35 backdrop-blur-md animate-login-card relative overflow-hidden">
          {/* Ambient Card Top Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C3A66B]/60 to-transparent" />

          {/* Login Success State Transition */}
          {loginSuccess ? (
            <div className="py-8 px-4 text-center space-y-4 animate-success-pop">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#183B2B] border-2 border-[#88D08D] flex items-center justify-center text-[#88D08D] shadow-[0_0_20px_rgba(136,208,141,0.35)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#FFFDF8]">Authentication Verified</h3>
                <p className="text-xs text-[#C3A66B] font-mono">Opening {loginSuccess}...</p>
              </div>
              <div className="w-36 h-1 bg-[#162D23] rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C3A66B] to-[#88D08D] w-full animate-pulse" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-[#3D1E18]/90 border border-[#8E4F39] text-[#F0A892] text-xs flex items-center gap-2.5 transition-all">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#F0A892]" />
                  <span>{error}</span>
                </div>
              )}

              {forgotPasswordNotice && (
                <div className="p-3 rounded-xl bg-[#2D2817]/90 border border-[#C3A66B]/40 text-[#E2C37E] text-xs transition-all">
                  Password recovery via email is disabled in local mode. Please use the evaluation accounts below or contact the Central Librarian.
                </div>
              )}

              {/* Form Item 1: User ID or Email */}
              <div className="animate-form-item-1">
                <label className="block text-xs font-bold text-[#D6C5A3] uppercase tracking-wider mb-1.5 font-mono">
                  User ID or Email
                </label>
                <div className="relative">
                  <User
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focusedField === 'identifier' ? 'text-[#C3A66B]' : 'text-[#77736B]'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="e.g. librarian@iemcal.ac.in or student1"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onFocus={() => setFocusedField('identifier')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08130E] border border-[#C3A66B]/35 text-[#FFFDF8] placeholder-[#77736B] text-sm focus:outline-none focus:border-[#C3A66B] focus:ring-2 focus:ring-[#C3A66B]/25 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Form Item 2: Password */}
              <div className="animate-form-item-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#D6C5A3] uppercase tracking-wider font-mono">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordNotice(true)}
                    className="text-xs text-[#C3A66B] hover:text-[#FFFDF8] hover:underline font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-[#C3A66B]' : 'text-[#77736B]'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#08130E] border border-[#C3A66B]/35 text-[#FFFDF8] placeholder-[#77736B] text-sm focus:outline-none focus:border-[#C3A66B] focus:ring-2 focus:ring-[#C3A66B]/25 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77736B] hover:text-[#FFFDF8] transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Form Item 3: Remember Me */}
              <div className="flex items-center justify-between pt-1 animate-form-item-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#D6C5A3] hover:text-[#FFFDF8] transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C3A66B]/40 bg-[#08130E] text-[#A65F45] focus:ring-[#A65F45]"
                  />
                  <span>Remember this terminal</span>
                </label>
              </div>

              {/* Form Item 4: Submit Button */}
              <div className="pt-1 animate-form-item-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#A65F45] hover:bg-[#8E4F39] text-white font-semibold text-sm shadow-terracotta transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating with Central Server...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Form Item 5: Quick 1-Click Evaluation Credentials */}
          {!loginSuccess && (
            <div className="mt-6 pt-5 border-t border-[#C3A66B]/25 space-y-3 animate-form-item-5">
              <span className="text-[11px] font-bold text-[#C3A66B] uppercase tracking-widest block text-center font-mono">
                Quick Evaluation Credentials (1-Click)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Librarian Staff Button */}
                <button
                  type="button"
                  onClick={() => handleDemoFill('librarian@iemcal.ac.in', 'admin123', 'librarian')}
                  className={`p-3 rounded-xl border transition-all text-left flex items-center gap-2.5 group relative hover:-translate-y-0.5 ${
                    selectedDemoRole === 'librarian'
                      ? 'bg-[#153326] border-[#88D08D] text-[#FFFDF8] shadow-sm'
                      : 'bg-[#0A1812] border-[#C3A66B]/30 text-[#D6C5A3] hover:border-[#C3A66B] hover:bg-[#10241B]'
                  }`}
                >
                  <Shield
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      selectedDemoRole === 'librarian' ? 'text-[#88D08D]' : 'text-[#C3A66B]'
                    }`}
                  />
                  <div className="truncate min-w-0">
                    <span className="block font-bold truncate text-[#FFFDF8]">Librarian Staff</span>
                    <span className="text-[10px] text-[#A69E8F] font-mono block">admin123</span>
                  </div>
                  {selectedDemoRole === 'librarian' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#88D08D] absolute top-2 right-2" />
                  )}
                </button>

                {/* Student Scholar Button */}
                <button
                  type="button"
                  onClick={() => handleDemoFill('alex@iemcal.ac.in', 'student123', 'student')}
                  className={`p-3 rounded-xl border transition-all text-left flex items-center gap-2.5 group relative hover:-translate-y-0.5 ${
                    selectedDemoRole === 'student'
                      ? 'bg-[#2A2314] border-[#E2C37E] text-[#FFFDF8] shadow-sm'
                      : 'bg-[#0A1812] border-[#C3A66B]/30 text-[#D6C5A3] hover:border-[#C3A66B] hover:bg-[#10241B]'
                  }`}
                >
                  <GraduationCap
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      selectedDemoRole === 'student' ? 'text-[#E2C37E]' : 'text-[#A65F45]'
                    }`}
                  />
                  <div className="truncate min-w-0">
                    <span className="block font-bold truncate text-[#FFFDF8]">Student Scholar</span>
                    <span className="text-[10px] text-[#A69E8F] font-mono block">student123</span>
                  </div>
                  {selectedDemoRole === 'student' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2C37E] absolute top-2 right-2" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info: Back to Catalogue Navigation */}
        <div className="text-center text-xs text-[#D6C5A3]">
          <Link
            to="/"
            className="hover:text-[#FFFDF8] hover:underline transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr; Back to IEM Library Catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
