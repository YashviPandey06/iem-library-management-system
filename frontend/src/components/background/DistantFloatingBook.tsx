import React from 'react';

export type BackgroundBookColor = 'burgundy' | 'gold' | 'terracotta' | 'forest' | 'charcoal' | 'walnut';
export type BackgroundBookSize = 'sm' | 'md' | 'lg';

interface DistantFloatingBookProps {
  color?: BackgroundBookColor;
  size?: BackgroundBookSize;
  variant?: 1 | 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
  blur?: boolean;
}

const COLOR_MAP: Record<BackgroundBookColor, { bg: string; spine: string; border: string; ribbon: string; title: string }> = {
  burgundy: {
    bg: 'linear-gradient(135deg, #7D2D37 0%, #581C23 60%, #3B1015 100%)',
    spine: '#3B1015',
    border: '#C3A66B',
    ribbon: '#C3A66B',
    title: 'ARITHMETICA',
  },
  gold: {
    bg: 'linear-gradient(135deg, #9E7836 0%, #785A24 60%, #4D3813 100%)',
    spine: '#4D3813',
    border: '#FAF5EA',
    ribbon: '#7D2D37',
    title: 'COMPILERS',
  },
  terracotta: {
    bg: 'linear-gradient(135deg, #A65F45 0%, #82432D 60%, #562719 100%)',
    spine: '#562719',
    border: '#F5F0E5',
    ribbon: '#1E3E33',
    title: 'DATABASES',
  },
  forest: {
    bg: 'linear-gradient(135deg, #1E3E33 0%, #152C24 60%, #0E1F19 100%)',
    spine: '#0E1F19',
    border: '#C3A66B',
    ribbon: '#803D3C',
    title: 'ALGORITHMS',
  },
  charcoal: {
    bg: 'linear-gradient(135deg, #2D302A 0%, #1F211D 60%, #121310 100%)',
    spine: '#121310',
    border: '#C3A66B',
    ribbon: '#A65F45',
    title: 'SYSTEMS',
  },
  walnut: {
    bg: 'linear-gradient(135deg, #5C422C 0%, #452F1E 60%, #2A1C10 100%)',
    spine: '#2A1C10',
    border: '#D6C5A3',
    ribbon: '#803D3C',
    title: 'ARCHIVES',
  },
};

const SIZE_MAP: Record<BackgroundBookSize, { w: number; h: number; spine: number }> = {
  sm: { w: 38, h: 54, spine: 6 },
  md: { w: 52, h: 72, spine: 8 },
  lg: { w: 66, h: 92, spine: 10 },
};

export const DistantFloatingBook: React.FC<DistantFloatingBookProps> = ({
  color = 'forest',
  size = 'md',
  variant = 1,
  className = '',
  style,
  blur = true,
}) => {
  const scheme = COLOR_MAP[color];
  const dims = SIZE_MAP[size];

  const animationClass = `animate-bg-book-${variant}`;

  return (
    <div
      className={`absolute pointer-events-none select-none preserve-3d ${animationClass} ${className}`}
      style={{
        width: `${dims.w}px`,
        height: `${dims.h}px`,
        filter: blur ? 'blur(0.8px)' : undefined,
        opacity: 0.28,
        ...style,
      }}
    >
      {/* 3D Soft Shadow */}
      <div
        className="absolute -bottom-3 left-2 right-2 h-3 rounded-full bg-black/40 blur-sm pointer-events-none"
        style={{ transform: 'translateZ(-10px)' }}
      />

      {/* Book Container with 3D tilt */}
      <div className="relative w-full h-full preserve-3d rounded-r-sm">
        {/* Bookmark Ribbon */}
        <div
          className="absolute -top-1.5 right-2 w-1.5 h-6 rounded-b shadow-xs pointer-events-none"
          style={{
            backgroundColor: scheme.ribbon,
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          }}
        />

        {/* 3D Spine (Left) */}
        <div
          className="absolute top-0 bottom-0 left-0 rounded-l-xs border-r border-black/30 shadow-sm"
          style={{
            width: `${dims.spine}px`,
            backgroundColor: scheme.spine,
            transform: 'rotateY(-90deg) translateZ(0px)',
            transformOrigin: 'left center',
          }}
        />

        {/* Gilded Paper Block (Right) */}
        <div
          className="absolute top-0.5 bottom-0.5 -right-1 w-1.5 rounded-r-xs bg-[#ECE4D2] border-r border-[#D2C5AF]"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, #FAF5EA 0px, #E5DCB8 1px, #FAF5EA 2px)',
          }}
        />

        {/* Front Hardcover */}
        <div
          className="w-full h-full rounded-r-sm border border-white/10 shadow-lg p-1.5 flex flex-col justify-between overflow-hidden"
          style={{
            background: scheme.bg,
          }}
        >
          {/* Subtle Gilded Inlay Border */}
          <div
            className="w-full h-full rounded-xs border p-0.5 flex flex-col justify-between"
            style={{ borderColor: `${scheme.border}40` }}
          >
            <div className="flex justify-between items-center text-[5px] font-mono opacity-60" style={{ color: scheme.border }}>
              <span>IEM</span>
              <span>✦</span>
            </div>

            <div className="my-auto text-center">
              <span
                className="font-serif text-[6px] font-bold tracking-widest uppercase block truncate leading-none"
                style={{ color: '#FFFDF8' }}
              >
                {scheme.title}
              </span>
            </div>

            <div className="flex justify-between text-[4.5px] font-mono opacity-50" style={{ color: scheme.border }}>
              <span>VOL.I</span>
              <span>1989</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
