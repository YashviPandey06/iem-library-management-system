import React from 'react';

interface DriftingParchmentPageProps {
  variant?: 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const DriftingParchmentPage: React.FC<DriftingParchmentPageProps> = ({
  variant = 1,
  className = '',
  style,
  width = 54,
  height = 72,
}) => {
  const animationClass = `animate-page-flutter-${variant}`;

  return (
    <div
      className={`absolute pointer-events-none select-none preserve-3d ${animationClass} ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: 0.22,
        filter: 'blur(0.4px)',
        ...style,
      }}
    >
      {/* 3D Page Shadow */}
      <div
        className="absolute inset-1 rounded-sm bg-black/25 blur-sm"
        style={{ transform: 'translateZ(-6px) translate(4px, 6px)' }}
      />

      {/* Parchment Leaf */}
      <div
        className="w-full h-full rounded-xs bg-[#FAF5EB] border border-[#DDD3BF] p-1.5 shadow-md flex flex-col justify-between"
        style={{
          boxShadow: 'inset 0 0 6px rgba(166, 95, 69, 0.08), 0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header Rule */}
        <div className="flex items-center justify-between border-b border-[#D8CBB5] pb-0.5">
          <div className="w-6 h-[1.5px] bg-[#A65F45]/40" />
          <span className="text-[4px] font-mono text-[#8C7A65]">FOLIO</span>
        </div>

        {/* Faint Text Lines */}
        <div className="space-y-1 my-auto">
          <div className="w-full h-[1px] bg-[#8C7A65]/35" />
          <div className="w-5/6 h-[1px] bg-[#8C7A65]/30" />
          <div className="w-full h-[1px] bg-[#8C7A65]/35" />
          <div className="w-4/5 h-[1px] bg-[#8C7A65]/25" />
          {/* Miniature Illuminated Initial / Glyph */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="w-2.5 h-2.5 rounded-xs border border-[#C3A66B]/50 bg-[#F2EDE2] flex items-center justify-center text-[5px] text-[#A65F45] font-serif font-bold leading-none">
              §
            </div>
            <div className="w-3/4 h-[1px] bg-[#8C7A65]/35" />
          </div>
          <div className="w-full h-[1px] bg-[#8C7A65]/30" />
        </div>

        {/* Footer Page Number */}
        <div className="flex justify-end pt-0.5 border-t border-[#E8DFC9]">
          <span className="text-[4px] font-mono text-[#9C8A75]">◈</span>
        </div>
      </div>
    </div>
  );
};
