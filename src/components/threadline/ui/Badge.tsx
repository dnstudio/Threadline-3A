import React from 'react';
import { STATUS_CONFIG } from '../constants';
import { AlertTriangle, FileX, Clock, CheckCircle, Plus as AddIcon, LucideIcon, HelpCircle } from "lucide-react";

export const STATUS_ICONS: Record<string, LucideIcon> = {
  'conflicts-unresolved': AlertTriangle,
  'missing-documents': FileX,
  'missing': FileX,
  'in-progress': Clock,
  'processing': Clock,
  'completed': CheckCircle,
  'ready': CheckCircle,
  'uploaded': CheckCircle,
  'new': AddIcon,
  'required': Clock,
  'not-started': Clock,
  'optional': HelpCircle,
};

interface BadgeProps {
  status: keyof typeof STATUS_CONFIG;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showIcon?: boolean;
  variant?: 'solid' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ 
  status, 
  label, 
  className = "", 
  style, 
  onClick,
  showIcon = true,
  variant = 'solid'
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['not-started'];
  const isOutline = variant === 'outline';
  const Icon = (showIcon && !isOutline) ? STATUS_ICONS[status] : null;
  
  return (
    <div 
      className={`px-2 py-0.5 rounded border inline-flex items-center gap-1 ${onClick ? 'cursor-pointer' : 'cursor-default'} ${className}`}
      onClick={onClick}
      style={{ 
        backgroundColor: isOutline ? 'transparent' : config.bg,
        color: config.text,
        borderColor: config.border,
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        ...style 
      }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} className="shrink-0" />}
      {label || config.label}
    </div>
  );
};
