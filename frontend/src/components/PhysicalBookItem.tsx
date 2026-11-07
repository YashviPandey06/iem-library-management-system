import React from 'react';
import { Book } from '../types';

interface PhysicalBookItemProps {
  book: Book;
  index?: number;
  onInspect?: (book: Book) => void;
  onAction?: (book: Book) => void;
  actionLabel?: string;
  actionDisabled?: boolean;
}

// Rich collegiate book cover palettes for visual variety
const COVER_PALETTES = [
  {
    from: '#1E3E33',
    via: '#173128',
    to: '#0F221B',
    border: '#C3A66B',
    accent: '#D6C5A3',
    ribbon: '#803D3C',
    name: 'Forest Green',
  },
  {
    from: '#7D2D37',
    via: '#63222B',
    to: '#45151C',
    border: '#D6C5A3',
    accent: '#E5DAC6',
    ribbon: '#C3A66B',
    name: 'Deep Burgundy',
  },
  {
    from: '#A65F45',
    via: '#8A4C35',
    to: '#663421',
    border: '#F5F0E5',
    accent: '#FAF7F0',
    ribbon: '#1E3E33',
    name: 'Terracotta',
  },
  {
    from: '#9E7836',
    via: '#826127',
    to: '#5C4318',
    border: '#FAF5EA',
    accent: '#FFFDF8',
    ribbon: '#7D2D37',
    name: 'Antique Gold',
  },
  {
    from: '#2D302A',
    via: '#22241F',
    to: '#161714',
    border: '#C3A66B',
    accent: '#D6C5A3',
    ribbon: '#A65F45',
    name: 'Charcoal Buckram',
  },
  {
    from: '#5C422C',
    via: '#4A3421',
    to: '#332314',
    border: '#D6C5A3',
    accent: '#F5F0E5',
    ribbon: '#803D3C',
    name: 'Walnut Morocco',
  },
];

export const PhysicalBookItem: React.FC<PhysicalBookItemProps> = ({
  book,
  index = 0,
  onInspect,
  onAction,
  actionLabel,
  actionDisabled = false,
}) => {
  const palette = COVER_PALETTES[index % COVER_PALETTES.length];
  const isAvailable = book.availableCopies > 0;

  // Generate deterministic call number if not present
  const callNumber = `QA.76.${(book.id * 17) % 89 + 10}.${book.title.slice(0, 3).toUpperCase()}`;

  return (
    <div className="flex flex-col items-center group">
      {/* 3D Physical Book Object Container */}
      <div
        className="relative w-48 h-64 select-none cursor-pointer perspective-1200"
        onClick={() => onInspect?.(book)}
      >
        {/* Soft Contact Drop Shadow on Table/Shelf */}
        <div
          className="absolute -bottom-4 left-4 right-4 h-6 rounded-full bg-black/35 blur-md transition-all duration-500 group-hover:scale-110 group-hover:opacity-60"
        />

        {/* 3D Tilting Book Body */}
        <div className="relative w-full h-full book-3d-card rounded-r-md">
          {/* Hanging Bookmark Ribbon */}
          <div
            className="absolute -top-2 right-6 w-3 h-14 shadow-md rounded-b pointer-events-none z-30 transition-transform duration-300 group-hover:translate-y-1"
            style={{
              backgroundColor: palette.ribbon,
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
            }}
          />

          {/* Book Spine (Left 3D Face) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[24px] rounded-l-sm border-l border-t border-b border-black/30 flex flex-col justify-between py-4 items-center shadow-md z-10"
            style={{
              transform: 'rotateY(-90deg) translateZ(0px)',
              transformOrigin: 'left center',
              background: `linear-gradient(to right, ${palette.to}, ${palette.via})`,
            }}
          >
            {/* Raised gold ribs */}
            <div className="w-full h-0.5 bg-black/40 border-t border-[#C3A66B]/30" />
            <div
              className="text-[7.5px] font-serif text-[#FAF7F0] font-semibold uppercase tracking-wider whitespace-nowrap opacity-85"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '140px', overflow: 'hidden' }}
            >
              {book.title}
            </div>
            <div className="w-full h-0.5 bg-black/40 border-t border-[#C3A66B]/30" />
          </div>

          {/* Gilded Stacked Paper Block (Right 3D Face) */}
          <div
            className="absolute top-1 bottom-1 right-0 w-[24px] rounded-r-sm bg-[#EFE9DB] border-r border-t border-b border-[#D8CEBA] shadow-inner"
            style={{
              transform: 'rotateY(90deg) translateZ(12px)',
              transformOrigin: 'right center',
              backgroundImage: 'repeating-linear-gradient(to right, #FAF5EA 0px, #E8DFCB 2px, #FAF5EA 4px)',
            }}
          />

          {/* Front Hardcover Face */}
          <div
            className="relative w-full h-full rounded-r-md p-4 flex flex-col justify-between shadow-xl overflow-hidden border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 60%, ${palette.to} 100%)`,
            }}
          >
            {/* Embossed Filigree Inlay Border */}
            <div
              className="absolute inset-2 rounded border pointer-events-none p-1.5 flex flex-col justify-between"
              style={{ borderColor: `${palette.border}55` }}
            >
              <div className="flex justify-between text-[8px] leading-none opacity-60" style={{ color: palette.border }}>
                <span>┌</span>
                <span>┐</span>
              </div>
              <div className="flex justify-between text-[8px] leading-none opacity-60" style={{ color: palette.border }}>
                <span>└</span>
                <span>┘</span>
              </div>
            </div>

            {/* Header: Institutional & Category Tag */}
            <div className="relative z-10 flex items-center justify-between pt-0.5">
              <span
                className="text-[7px] font-mono uppercase tracking-widest font-semibold"
                style={{ color: `${palette.accent}CC` }}
              >
                IEM ARCHIVE
              </span>
              <span
                className="text-[6.5px] font-mono px-1.5 py-0.5 rounded border"
                style={{
                  backgroundColor: `${palette.to}88`,
                  borderColor: `${palette.border}44`,
                  color: palette.accent,
                }}
              >
                {(book as any).category || 'CS'}
              </span>
            </div>

            {/* Middle: Title & Author stamped with gold foil */}
            <div className="relative z-10 my-auto text-center px-1">
              <div
                className="w-7 h-7 mx-auto rounded-full border flex items-center justify-center mb-2 bg-black/20"
                style={{ borderColor: `${palette.border}60` }}
              >
                <span className="text-[9px] font-serif" style={{ color: palette.accent }}>
                  ❦
                </span>
              </div>
              <h4
                className="font-serif text-xs font-bold uppercase tracking-wider leading-snug line-clamp-2 drop-shadow-sm"
                style={{ color: '#FFFDF8' }}
                title={book.title}
              >
                {book.title}
              </h4>
              <div
                className="w-10 h-[1px] mx-auto my-1.5"
                style={{ background: `linear-gradient(to right, transparent, ${palette.border}, transparent)` }}
              />
              <p
                className="text-[8.5px] font-serif italic line-clamp-1"
                style={{ color: `${palette.accent}DD` }}
              >
                {book.author}
              </p>
            </div>

            {/* Bottom: Shelf Call Number & Availability Tag */}
            <div
              className="relative z-10 flex items-center justify-between pt-1 border-t text-[7px] font-mono"
              style={{ borderColor: `${palette.border}30` }}
            >
              <span style={{ color: `${palette.accent}99` }}>{callNumber}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[6.5px] font-bold tracking-wider uppercase ${
                  isAvailable
                    ? 'bg-[#192A23] text-[#D6C5A3] border border-[#263D32]'
                    : 'bg-[#5C2423] text-[#FAF7F0] border border-[#803D3C]'
                }`}
              >
                {isAvailable ? `${book.availableCopies} AV` : 'OUT'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Metadata & Interactive Buttons Below Object */}
      <div className="w-full mt-3 text-center space-y-1.5">
        <h5
          onClick={() => onInspect?.(book)}
          className="font-serif text-xs font-bold text-[#FFFDF8] hover:text-[#C3A66B] cursor-pointer line-clamp-1 transition-colors"
        >
          {book.title}
        </h5>
        <p className="text-[11px] text-[#D6C5A3] italic line-clamp-1">
          {book.author}
        </p>

        {/* Action Button: Inspect or Issue/Return */}
        <div className="pt-1 flex items-center justify-center gap-1.5">
          <button
            onClick={() => onInspect?.(book)}
            className="px-2.5 py-1 rounded text-[10px] font-mono font-medium text-[#D6C5A3] bg-[#142A20] border border-[#C3A66B]/40 hover:bg-[#1E3E33] hover:text-[#FFFDF8] hover:border-[#C3A66B] transition-all shadow-xs"
          >
            Inspect Volume
          </button>
          {actionLabel && (
            <button
              onClick={() => onAction?.(book)}
              disabled={actionDisabled}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all shadow-xs ${
                actionDisabled
                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  : 'bg-[#A65F45] text-white hover:bg-[#8E4F39] border border-[#A65F45]'
              }`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
