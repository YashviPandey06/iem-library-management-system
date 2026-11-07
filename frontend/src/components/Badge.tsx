import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'cyan' | 'neutral' | 'blue' | 'amber' | 'brass' | 'burgundy' | 'forest' | 'terracotta' | 'gold';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  dot = true,
}) => {
  const variantStyles: Record<string, string> = {
    success: 'bg-[#E8F0EA] text-[#1E4D2B] border-[#C4D9C8] dark:bg-[#1C3626] dark:text-[#88D08D] dark:border-[#2A523A]',
    warning: 'bg-[#FAF5EB] text-[#7A602B] border-[#E5D7B7] dark:bg-[#2E2818] dark:text-[#E2C37E] dark:border-[#4D4226]',
    danger: 'bg-[#F9ECE7] text-[#9C5538] border-[#E8C5B8] dark:bg-[#382119] dark:text-[#F0A892] dark:border-[#5C3326]',
    info: 'bg-[#EAF0F4] text-[#26445A] border-[#C3D4E0] dark:bg-[#192A36] dark:text-[#9EC0E6] dark:border-[#2A4356]',
    forest: 'bg-[#E9F0EC] text-[#263D32] border-[#C4D6CB] dark:bg-[#1E3228] dark:text-[#F6F3EA] dark:border-[#334D40]',
    terracotta: 'bg-[#F9ECE7] text-[#9C5538] border-[#E8C5B8] dark:bg-[#382119] dark:text-[#F0A892] dark:border-[#5C3326]',
    gold: 'bg-[#FAF5EB] text-[#7A602B] border-[#E5D7B7] dark:bg-[#2E2818] dark:text-[#E2C37E] dark:border-[#4D4226]',
    brass: 'bg-[#FAF5EB] text-[#7A602B] border-[#E5D7B7] dark:bg-[#2E2818] dark:text-[#E2C37E] dark:border-[#4D4226]',
    burgundy: 'bg-[#F9ECE7] text-[#9C5538] border-[#E8C5B8] dark:bg-[#382119] dark:text-[#F0A892] dark:border-[#5C3326]',
    violet: 'bg-[#F9ECE7] text-[#9C5538] border-[#E8C5B8] dark:bg-[#382119] dark:text-[#F0A892] dark:border-[#5C3326]',
    blue: 'bg-[#EAF0F4] text-[#26445A] border-[#C3D4E0] dark:bg-[#192A36] dark:text-[#9EC0E6] dark:border-[#2A4356]',
    amber: 'bg-[#FAF5EB] text-[#7A602B] border-[#E5D7B7] dark:bg-[#2E2818] dark:text-[#E2C37E] dark:border-[#4D4226]',
    cyan: 'bg-[#EAF5F2] text-[#1E5245] border-[#C4DFD7] dark:bg-[#16332B] dark:text-[#88D0BD] dark:border-[#254F43]',
    neutral: 'bg-[#EAE5D8] text-[#52544E] border-[#DDD6C6] dark:bg-[#263D32] dark:text-[#EAE5D8] dark:border-[#334D40]',
  };

  const dotColors: Record<string, string> = {
    success: 'bg-[#1E4D2B] dark:bg-[#88D08D]',
    warning: 'bg-[#C3A66B] dark:bg-[#E2C37E]',
    danger: 'bg-[#B96F50] dark:bg-[#F0A892]',
    info: 'bg-[#26445A] dark:bg-[#9EC0E6]',
    forest: 'bg-[#263D32] dark:bg-[#C4D6CB]',
    terracotta: 'bg-[#B96F50] dark:bg-[#F0A892]',
    gold: 'bg-[#C3A66B] dark:bg-[#E2C37E]',
    brass: 'bg-[#C3A66B] dark:bg-[#E2C37E]',
    burgundy: 'bg-[#B96F50] dark:bg-[#F0A892]',
    violet: 'bg-[#B96F50] dark:bg-[#F0A892]',
    blue: 'bg-[#26445A] dark:bg-[#9EC0E6]',
    amber: 'bg-[#C3A66B] dark:bg-[#E2C37E]',
    cyan: 'bg-[#1E5245] dark:bg-[#88D0BD]',
    neutral: 'bg-[#77776D] dark:bg-[#A3A395]',
  };

  const style = variantStyles[variant] || variantStyles.neutral;
  const dotColor = dotColors[variant] || dotColors.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${style} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      {children}
    </span>
  );
};
