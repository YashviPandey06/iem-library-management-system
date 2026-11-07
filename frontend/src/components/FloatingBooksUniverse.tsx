import React, { useState, useEffect, useRef } from 'react';
import { GoldenDustCanvas } from './GoldenDustCanvas';
import { CentralHardcoverBook } from './CentralHardcoverBook';

interface FloatingBooksUniverseProps {
  onBookClick?: (title: string) => void;
}

export const FloatingBooksUniverse: React.FC<FloatingBooksUniverseProps> = ({ onBookClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle interactive parallax based on mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({ x: Math.max(-0.5, Math.min(0.5, x)), y: Math.max(-0.5, Math.min(0.5, y)) });
    };

    const handleMouseLeave = () => {
      setMouseOffset({ x: 0, y: 0 });
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] md:h-[580px] lg:h-[640px] flex items-center justify-center select-none overflow-visible"
      style={{ perspective: '1600px' }}
    >
      {/* Floating Micro-Dust Particle Canvas */}
      <GoldenDustCanvas className="opacity-75" />

      {/* Subtle Radial Glow Behind Books */}
      <div
        className="absolute w-96 h-96 rounded-full bg-[#C3A66B]/15 blur-3xl pointer-events-none"
        style={{ transform: 'translateZ(-100px)' }}
      />

      {/* 3D Scene Group with dynamic mouse parallax */}
      <div
        className="relative w-full h-full flex items-center justify-center preserve-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateY(${mouseOffset.x * 12}deg) rotateX(${-mouseOffset.y * 8}deg)`,
        }}
      >
        {/* ==============================================================
            SATELLITE 1 (Top-Right): Burgundy Volume — Discrete Mathematics
            ============================================================== */}
        <div
          onClick={() => onBookClick?.('Discrete Mathematics & Graph Theory')}
          className="absolute top-8 right-4 md:right-8 lg:right-12 w-36 h-48 rounded-r bg-gradient-to-br from-[#7D2D37] via-[#61212A] to-[#43141B] border border-[#C3A66B]/50 shadow-2xl preserve-3d animate-satellite-1 cursor-pointer hover:brightness-110 transition-all z-20 hidden sm:block"
          style={{
            transform: 'translate3d(0, 0, 80px)',
            boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.6)',
          }}
          title="Inspect: Discrete Mathematics"
        >
          {/* Spine Accent */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#43141B] border-r border-[#C3A66B]/30" />
          <div className="p-3 pl-5 h-full flex flex-col justify-between text-[#F5F0E5]">
            <div className="text-[7px] font-mono text-[#D6C5A3]/70 uppercase tracking-widest">
              VOL. II · ANALYSIS
            </div>
            <div>
              <div className="w-5 h-[1px] bg-[#C3A66B] mb-1.5" />
              <h5 className="font-serif text-[10px] font-bold uppercase tracking-wider leading-snug">
                DISCRETE MATHEMATICS
              </h5>
              <p className="text-[7.5px] font-serif italic text-[#C3A66B] mt-0.5">
                K. H. Rosen
              </p>
            </div>
            <div className="flex justify-between items-center text-[6.5px] font-mono text-[#C3A66B]">
              <span>QA.39.2</span>
              <span>IN STACKS</span>
            </div>
          </div>
        </div>

        {/* ==============================================================
            SATELLITE 2 (Top-Left / Background): Antique Gold Volume — Compiler Design
            ============================================================== */}
        <div
          onClick={() => onBookClick?.('Compilers: Principles & Techniques')}
          className="absolute top-10 left-4 md:left-10 lg:left-14 w-32 h-44 rounded-r bg-gradient-to-br from-[#9E7836] via-[#85632A] to-[#5C4217] border border-[#E2DAC7]/60 shadow-2xl preserve-3d animate-satellite-2 cursor-pointer hover:brightness-110 transition-all z-10 hidden md:block"
          style={{
            transform: 'translate3d(0, 0, -40px)',
            boxShadow: '0 16px 30px -6px rgba(0, 0, 0, 0.55)',
          }}
          title="Inspect: Compiler Design"
        >
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#4A3412] border-r border-[#E2DAC7]/40" />
          <div className="p-3 pl-4 h-full flex flex-col justify-between text-[#FAF7F0]">
            <div className="text-[6.5px] font-mono tracking-widest text-[#F5F0E5]/80">IEM PRESS</div>
            <div>
              <h5 className="font-serif text-[9.5px] font-bold uppercase tracking-wider leading-snug">
                COMPILER ARCHITECTURES
              </h5>
              <div className="w-4 h-[1px] bg-[#FAF7F0]/60 my-1" />
              <p className="text-[7px] italic text-[#FAF7F0]/80">A. V. Aho</p>
            </div>
            <div className="text-[6.5px] font-mono text-[#F5F0E5]/90">QA.76.76</div>
          </div>
        </div>

        {/* ==============================================================
            SATELLITE 3 (Mid-Left / Foreground): Terracotta Volume — Database Systems
            ============================================================== */}
        <div
          onClick={() => onBookClick?.('Database System Concepts')}
          className="absolute bottom-20 left-6 md:left-12 lg:left-16 w-36 h-48 rounded-r bg-gradient-to-br from-[#A65F45] via-[#8E4F39] to-[#683321] border border-[#C3A66B]/50 shadow-2xl preserve-3d animate-satellite-3 cursor-pointer hover:brightness-110 transition-all z-30 hidden sm:block"
          style={{
            transform: 'translate3d(0, 0, 110px)',
            boxShadow: '0 24px 40px -10px rgba(0, 0, 0, 0.65)',
          }}
          title="Inspect: Database Systems"
        >
          <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-[#542819] border-r border-[#C3A66B]/30" />
          <div className="p-3 pl-5 h-full flex flex-col justify-between text-[#FAF7F0]">
            <div className="text-[6.5px] font-mono tracking-widest text-[#F5F0E5]/70">MONOGRAPH 08</div>
            <div>
              <h5 className="font-serif text-[10px] font-bold uppercase tracking-wider leading-snug">
                DATABASE SYSTEMS
              </h5>
              <p className="text-[7.5px] font-serif italic text-[#C3A66B] mt-0.5">Silberschatz</p>
            </div>
            <div className="flex justify-between items-center text-[6.5px] font-mono text-[#F5F0E5]">
              <span>QA.76.9</span>
              <span>AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* ==============================================================
            SATELLITE 4 (Bottom-Right / Offset): Charcoal Volume — Operating Systems
            ============================================================== */}
        <div
          onClick={() => onBookClick?.('Modern Operating Systems')}
          className="absolute bottom-16 right-6 md:right-12 lg:right-14 w-32 h-44 rounded-r bg-gradient-to-br from-[#2D302A] via-[#22241F] to-[#151613] border border-[#C3A66B]/40 shadow-2xl preserve-3d animate-satellite-4 cursor-pointer hover:brightness-110 transition-all z-20 hidden lg:block"
          style={{
            transform: 'translate3d(0, 0, 50px)',
            boxShadow: '0 18px 32px -8px rgba(0, 0, 0, 0.6)',
          }}
          title="Inspect: Operating Systems"
        >
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#11120F] border-r border-[#C3A66B]/30" />
          <div className="p-3 pl-4 h-full flex flex-col justify-between text-[#FAF7F0]">
            <div className="text-[6.5px] font-mono text-[#C3A66B] tracking-widest">SYSTEMS DIV.</div>
            <div>
              <h5 className="font-serif text-[9.5px] font-bold uppercase tracking-wider leading-snug">
                DISTRIBUTED KERNELS
              </h5>
              <p className="text-[7px] italic text-[#C3A66B]">Tanenbaum</p>
            </div>
            <div className="text-[6.5px] font-mono text-[#D6C5A3]">QA.76.76.O63</div>
          </div>
        </div>

        {/* ==============================================================
            THE CENTRAL HERO HARDCOVER BOOK
            ============================================================== */}
        <div className="relative z-20">
          <CentralHardcoverBook onClick={() => onBookClick?.('Compendium of Computer Science')} />
        </div>

        {/* ==============================================================
            GROUNDED BASE BOOKSTACK FOUNDATION (Resting beneath)
            ============================================================== */}
        <div
          className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 w-80 md:w-96 flex flex-col items-center pointer-events-none opacity-90"
          style={{ transform: 'translateZ(-60px)' }}
        >
          {/* Stack Volume 3 (Top of stack) */}
          <div
            className="w-72 h-7 rounded-sm bg-gradient-to-r from-[#172B23] via-[#263D32] to-[#172B23] border border-[#C3A66B]/40 shadow-lg flex items-center justify-between px-4 -mb-1"
            style={{ transform: 'rotate(2.5deg)' }}
          >
            <div className="h-2 w-32 border-b border-[#C3A66B]/30 flex items-center">
              <span className="text-[7.5px] font-serif text-[#C3A66B] tracking-widest uppercase">
                ALGORITHMS & DATA STRUCTURES
              </span>
            </div>
            <span className="text-[7px] font-mono text-[#C3A66B]">IEM-2026</span>
          </div>

          {/* Stack Volume 2 (Middle of stack) */}
          <div
            className="w-80 h-8 rounded-sm bg-gradient-to-r from-[#5C2423] via-[#7D2D37] to-[#5C2423] border border-[#C3A66B]/35 shadow-xl flex items-center justify-between px-5 -mb-1"
            style={{ transform: 'rotate(-1.8deg)' }}
          >
            <span className="text-[8px] font-serif text-[#F5F0E5] tracking-widest uppercase font-semibold">
              SIGNALS & SYSTEM ANALYSIS · VOL. II
            </span>
            <span className="text-[7px] font-mono text-[#C3A66B]">OPPENHEIM</span>
          </div>

          {/* Stack Volume 1 (Bottom foundation) */}
          <div
            className="w-88 h-9 rounded bg-gradient-to-r from-[#1E2522] via-[#2B3430] to-[#1E2522] border border-[#43594F] shadow-2xl flex items-center justify-between px-6"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <span className="text-[8.5px] font-serif text-[#D6C5A3] tracking-[0.2em] uppercase font-bold">
              ENCYCLOPEDIA OF ELECTRICAL & COMPUTER ENGINEERING
            </span>
            <span className="text-[7.5px] font-mono text-[#A65F45]">1989</span>
          </div>
        </div>
      </div>
    </div>
  );
};
