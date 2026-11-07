import React from 'react';

interface CentralHardcoverBookProps {
  className?: string;
  onClick?: () => void;
}

export const CentralHardcoverBook: React.FC<CentralHardcoverBookProps> = ({
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`relative select-none ${className}`}
      onClick={onClick}
      style={{ perspective: '1600px', width: '280px', height: '370px' }}
    >
      {/* 3D Floating Book Wrapper */}
      <div
        className="relative w-full h-full preserve-3d animate-central-book cursor-pointer group"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Soft Shadow on the 'Floor' */}
        <div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-72 h-14 rounded-full bg-black/40 animate-central-shadow pointer-events-none"
          style={{ filter: 'blur(20px)' }}
        />

        {/* Back Cover (Bottom Foundation) */}
        <div
          className="absolute inset-0 rounded-r-lg bg-[#152B23] border border-[#2E4A3E] shadow-2xl"
          style={{
            transform: 'translateZ(-22px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Subtle inside back texture */}
          <div className="w-full h-full p-4 flex flex-col justify-between opacity-40">
            <div className="border border-[#C3A66B]/30 h-full rounded p-3 flex items-end justify-end">
              <span className="text-[9px] font-mono tracking-widest text-[#C3A66B]">IEM ARCHIVES · PRESS 1989</span>
            </div>
          </div>
        </div>

        {/* Interior Page Block (Thickness / Paper Edge - Right side) */}
        <div
          className="absolute top-1 bottom-1 -right-2 w-4 rounded-r-sm bg-[#EFE8D8] border-r border-t border-b border-[#D8CBB5] shadow-inner pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, #FAF5EA 0px, #E8DFCB 2px, #FAF5EA 4px)',
            transform: 'translateZ(0px)',
          }}
        >
          {/* Subtle gilded paper edge striations */}
          <div className="w-full h-full opacity-40 flex flex-col justify-around py-3">
            <div className="h-[1px] bg-[#B38A50]" />
            <div className="h-[1px] bg-[#B38A50]" />
            <div className="h-[1px] bg-[#B38A50]" />
          </div>
        </div>

        {/* Book Spine (Left side) */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[44px] bg-gradient-to-r from-[#11221B] via-[#1D3A2F] to-[#14261F] rounded-l-sm border-l border-t border-b border-[#C3A66B]/40 flex flex-col justify-between py-6 items-center shadow-2xl"
          style={{
            transform: 'rotateY(-90deg) translateZ(0px)',
            transformOrigin: 'left center',
          }}
        >
          {/* Raised horizontal ribs */}
          <div className="w-full h-1 bg-[#0D1A15] border-t border-b border-[#C3A66B]/40" />
          <div className="w-full h-1 bg-[#0D1A15] border-t border-b border-[#C3A66B]/40" />

          {/* Spine Title in Gold Foil (Vertical Text) */}
          <div
            className="text-[10px] tracking-[0.25em] font-serif text-[#C3A66B] font-semibold whitespace-nowrap uppercase opacity-90"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            IEM COMPENDIUM · VOL. IV
          </div>

          <div className="w-full h-1 bg-[#0D1A15] border-t border-b border-[#C3A66B]/40" />
          <div className="w-full h-1 bg-[#0D1A15] border-t border-b border-[#C3A66B]/40" />
        </div>

        {/* Base Interior Left / Right Page Spread (Visible when cover is open) */}
        <div
          className="absolute inset-[3px] rounded-r bg-[#FAF7F0] border border-[#E0D7C3] p-5 shadow-inner flex flex-col justify-between preserve-3d"
          style={{ transform: 'translateZ(-2px)' }}
        >
          {/* Left / Right page crease line down the center */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />

          {/* Base Page Content */}
          <div className="space-y-3 relative z-10 pl-2">
            <div className="flex items-center justify-between border-b border-[#D8CBB5] pb-1.5">
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#77736B]">Section 01 · Informatics</span>
              <span className="text-[8px] font-mono text-[#77736B]">Folio 42</span>
            </div>
            <h4 className="font-serif text-xs font-bold text-[#263D32] tracking-wide leading-tight">
              On the Ordering of Recorded Thought
            </h4>
            <p className="text-[9px] text-[#4A4740] font-serif leading-relaxed italic">
              "A library is not merely a depository of printed volumes; it is a living nexus of human cognition, where every catalogued work awaits awakening."
            </p>
            {/* Academic Diagram / Code representation */}
            <div className="p-2 bg-[#F2EDE2] rounded border border-[#E2DAC7] font-mono text-[7.5px] text-[#263D32]/80 space-y-1">
              <div className="flex justify-between text-[#8E4F39] font-bold">
                <span>INDEX_NODE_ROOT</span>
                <span>[GR-2026]</span>
              </div>
              <div className="pl-1 border-l border-[#A65F45]/40 text-[#55524B]">
                ├── AVL_TREE (O(log n))<br />
                ├── DISCOVERY_ENGINE<br />
                └── PERSISTENCE: IEM_CENTRAL
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E8DFCB] text-[8px] text-[#8C877D] font-mono">
            <span>INSTITUTE PRESS</span>
            <span>43</span>
          </div>
        </div>

        {/* Turning Page Leaf 2 (Flips second) */}
        <div
          className="absolute inset-[3px] rounded-r bg-[#FCFAF5] border border-[#E5DEC9] p-5 preserve-3d animate-page-2 shadow-md pointer-events-none"
          style={{ transformOrigin: 'left center', transform: 'translateZ(2px)' }}
        >
          <div className="w-full h-full flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex justify-between border-b border-[#D8CBB5] pb-1">
                <span className="text-[7.5px] font-mono text-[#8C877D]">DISCOURSE ON ARCHIVES</span>
                <span className="text-[7.5px] font-mono text-[#8C877D]">P. 39</span>
              </div>
              <p className="text-[8.5px] font-serif text-[#3E3C36] leading-relaxed">
                Knowledge preserved across physical leaves bridges the historical foundation of engineering with future computational frontiers.
              </p>
              <div className="h-10 bg-[#F4EFE6] rounded p-1.5 border border-[#E0D7C3] flex items-center justify-center">
                <div className="text-[8px] font-serif text-[#8E4F39] italic font-semibold">
                  ◈ IEM Central Library Digital Archive ◈
                </div>
              </div>
            </div>
            <div className="text-right text-[7.5px] font-mono text-[#8C877D]">40</div>
          </div>
        </div>

        {/* Turning Page Leaf 1 (Flips first) */}
        <div
          className="absolute inset-[3px] rounded-r bg-[#FAF6EE] border border-[#E0D7C3] p-5 preserve-3d animate-page-1 shadow-md pointer-events-none"
          style={{ transformOrigin: 'left center', transform: 'translateZ(5px)' }}
        >
          <div className="w-full h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-[#D8CBB5] pb-1">
                <span className="text-[7.5px] font-mono text-[#8C877D]">PREFACE</span>
                <span className="text-[7.5px] font-mono text-[#8C877D]">P. 37</span>
              </div>
              <h5 className="font-serif text-[11px] font-bold text-[#192A23]">The Scholar's Catalog</h5>
              <p className="text-[8.5px] font-serif text-[#3E3C36] leading-relaxed">
                In this repository reside foundational treatises in computation, electrical networks, mechanics, and computational sciences.
              </p>
            </div>
            <div className="text-right text-[7.5px] font-mono text-[#8C877D]">38</div>
          </div>
        </div>

        {/* 3D Front Hardcover (Swings Open and Closed in 14s loop) */}
        <div
          className="absolute inset-0 rounded-r-lg preserve-3d animate-cover cursor-pointer"
          style={{
            transformOrigin: 'left center',
            transform: 'translateZ(10px)',
          }}
        >
          {/* Outside Front Cover (Visible when closed) */}
          <div
            className="absolute inset-0 rounded-r-lg bg-gradient-to-br from-[#1E3E33] via-[#163128] to-[#0F201A] border-2 border-[#C3A66B]/60 p-5 flex flex-col justify-between shadow-2xl backface-hidden"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(195, 166, 107, 0.12) 0%, transparent 60%)',
            }}
          >
            {/* Gilded Double Border Inlay */}
            <div className="absolute inset-2.5 rounded border border-[#C3A66B]/50 pointer-events-none flex flex-col justify-between p-3">
              {/* Corner Ornaments */}
              <div className="flex justify-between items-start text-[#C3A66B]/70 text-[10px] leading-none">
                <span>╔</span>
                <span>╗</span>
              </div>
              <div className="flex justify-between items-end text-[#C3A66B]/70 text-[10px] leading-none">
                <span>╚</span>
                <span>╝</span>
              </div>
            </div>

            {/* Top Institutional Header */}
            <div className="relative z-10 text-center pt-2">
              <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#C3A66B]/90 font-medium block">
                INSTITUTE OF ENGINEERING & MANAGEMENT
              </span>
              <span className="text-[7px] font-mono tracking-widest text-[#D6C5A3]/60 block mt-0.5">
                KOLKATA · EST. 1989
              </span>
            </div>

            {/* Center Golden Seal / Emblem Medallion */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
              <div className="w-16 h-16 rounded-full border-2 border-[#C3A66B] flex items-center justify-center bg-[#152B23]/90 shadow-[0_0_15px_rgba(195,166,107,0.3)] mb-3 p-2">
                <img
                  src="/iem-logo-white.webp"
                  alt="IEM Emblem"
                  className="w-10 h-10 object-contain drop-shadow"
                />
              </div>

              {/* Embossed Title */}
              <h3 className="font-serif text-sm font-bold text-[#F5F0E5] tracking-widest uppercase text-center leading-snug drop-shadow-sm px-2">
                COMPENDIUM OF COMPUTER SCIENCE
              </h3>
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C3A66B] to-transparent my-1.5" />
              <p className="text-[8px] font-serif italic text-[#C3A66B] tracking-wider text-center">
                Vol. IV · Algorithmic Foundations & Systems
              </p>
            </div>

            {/* Bottom Archive Stamp */}
            <div className="relative z-10 text-center pb-2 flex items-center justify-between border-t border-[#C3A66B]/30 pt-2 px-1">
              <span className="text-[7.5px] font-mono text-[#D6C5A3]/70 tracking-wider">REF: IEM-CS-04</span>
              <span className="text-[7.5px] font-serif text-[#C3A66B] font-medium tracking-widest">CENTRAL LIBRARY</span>
            </div>
          </div>

          {/* Inside Front Cover (Visible when opened - rotateY(180deg)) */}
          <div
            className="absolute inset-0 rounded-r-lg bg-[#F2EDE2] border border-[#D8CBB5] p-5 flex flex-col justify-between shadow-inner"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Bookplate / Ex-Libris Stamp */}
            <div className="border-2 border-[#A65F45]/50 rounded p-4 h-full flex flex-col justify-between bg-[#FAF7F0]">
              <div className="text-center space-y-1">
                <div className="text-[9px] font-serif tracking-[0.2em] uppercase text-[#A65F45] font-bold">
                  EX LIBRIS
                </div>
                <div className="text-[8px] font-mono text-[#55524B]">
                  IEM CENTRAL LIBRARY COLLECTION
                </div>
              </div>
              <div className="text-center py-4">
                <div className="w-10 h-10 mx-auto rounded-full border border-[#A65F45]/40 flex items-center justify-center p-1.5 opacity-80">
                  <img src="/iem-logo.webp" alt="IEM Seal" className="w-full h-full object-contain" />
                </div>
                <div className="text-[7.5px] font-serif italic text-[#63422C] mt-2">
                  "Knowledge is that which liberates."
                </div>
              </div>
              <div className="border-t border-[#E0D7C3] pt-2 flex justify-between text-[7px] font-mono text-[#77736B]">
                <span>CATALOGUED: 2026</span>
                <span>VOL. 04</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ribbon Bookmark draped from top */}
        <div
          className="absolute -top-3 left-10 w-4 h-32 bg-gradient-to-b from-[#803D3C] to-[#5C2423] shadow-md rounded-b pointer-events-none"
          style={{
            transform: 'translateZ(12px)',
            clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)',
          }}
        />
      </div>
    </div>
  );
};
