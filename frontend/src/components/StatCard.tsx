import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorClass?: string;
  bgClass?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = 'text-[#263D32] dark:text-[#D6C5A3]',
  bgClass = 'bg-[#F5F0E5] border-[#E2DAC7] dark:bg-[#192A23] dark:border-[#334D40]',
  trend,
}) => {
  return (
    <div className="bg-[#FFFDF8] dark:bg-[#263D32] rounded-2xl p-5 border border-[#E2DAC7] dark:border-[#334D40] shadow-xs hover:border-[#A65F45]/50 hover:shadow-card transition-all duration-200 group relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#77776D] dark:text-[#D6C5A3]">
            {title}
          </span>
          <div className={`p-2.5 rounded-xl border ${bgClass} ${colorClass} transition-transform group-hover:scale-105`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-serif font-bold text-[#292B27] dark:text-[#FFFDF8] tracking-tight">
            {value}
          </div>
          {trend && (
            <span className="text-xs font-semibold text-[#1E4D2B] dark:text-[#88D08D] bg-[#E8F0EA] dark:bg-[#1C3626] px-2 py-0.5 rounded-full border border-[#C4D9C8] dark:border-[#2A523A]">
              {trend}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="mt-4 pt-3 border-t border-[#EAE3D2] dark:border-[#334D40] text-[11px] text-[#77776D] dark:text-[#D6C5A3]">
          {subtitle}
        </div>
      )}
    </div>
  );
};
