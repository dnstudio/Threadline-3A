import React from "react";
import { AlertTriangle, FileX, Clock, CheckCircle, Plus as AddIcon, LucideIcon, HelpCircle } from "lucide-react";
import { STATUS_CONFIG } from "../threadline/constants";
import { Badge } from "./Badge";

export type StatusType = keyof typeof STATUS_CONFIG;

const STATUS_ICONS: Record<string, LucideIcon> = {
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

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  center?: boolean;
}

export function StatusBadge({ status, label, className = "", style, center }: StatusBadgeProps) {
  const config = (STATUS_CONFIG as any)[status];
  
  if (!config || status === 'idle') return null;
  
  const Icon = STATUS_ICONS[status];
  const displayLabel = label !== undefined ? label : config.label;

  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${center ? 'mx-auto' : ''} ${className}`}
      style={{
        background: config.bg,
        color: config.text,
        borderColor: config.border,
        ...style
      }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} className="shrink-0" />}
      {displayLabel}
    </span>
  );
}
