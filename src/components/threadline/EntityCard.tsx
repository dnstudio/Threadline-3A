import React from 'react';
import { BRAND, TEXT_PRIMARY, TEXT_SECONDARY } from './constants';

export interface EntityCardProps {
  key?: React.Key;
  title: string;
  statusBadge?: React.ReactNode;
  metadata?: { label: string; value: React.ReactNode }[];
  summary?: React.ReactNode;
  rightAction?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  hoverable?: boolean;
}

export function EntityCard({
  title,
  statusBadge,
  metadata = [],
  summary,
  rightAction,
  onClick,
  children,
  hoverable = true,
}: EntityCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col ${
        isHovered && hoverable && onClick ? "border-[#06302c]" : "border-slate-100"
      } ${hoverable && onClick ? "cursor-pointer" : "cursor-default"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 md:p-7 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className={`flex items-center gap-3 ${metadata.length || summary ? "mb-1.5" : "mb-0"}`}>
              <h3 className="text-xl font-semibold text-slate-900 m-0 tracking-tight">{title}</h3>
              {statusBadge}
            </div>
            
            {metadata.length > 0 && (
              <div className="flex items-start gap-8 flex-wrap mt-4">
                {metadata.map((m, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{m.label}</div>
                    <div className="text-sm font-normal text-slate-900 whitespace-nowrap">{m.value}</div>
                  </div>
                ))}
              </div>
            )}
            
            {summary && (
              <div className="text-sm text-slate-500 leading-relaxed mt-3">
                {summary}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {rightAction}
          </div>
        </div>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
