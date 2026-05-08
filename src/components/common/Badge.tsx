import React from "react";
import { LucideIcon } from "lucide-react";

export type BadgeVariant = 
  | 'default' 
  | 'outline' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'blue' 
  | 'active' 
  | 'inactive'
  | 'soft';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 text-gray-600",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    active: "bg-green-50 text-green-700 border border-green-200",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200",
    soft: "bg-gray-50 text-gray-500",
};

export function Badge({ children, variant = "default", icon: Icon, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} className="shrink-0" />}
      {children}
    </span>
  );
}
