import React from "react";
import { LucideIcon } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, DIVIDER, primaryBtn } from "../threadline/constants";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  style 
}: EmptyStateProps) {
  return (
    <div style={{ 
      border: `1px dashed ${DIVIDER}`, 
      borderRadius: 12, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "80px 24px", 
      gap: 16,
      background: "#fcfcfc",
      ...style
    }}>
      <div style={{ 
        width: 64, 
        height: 64, 
        borderRadius: "50%", 
        background: "#f8fafc", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: TEXT_DISABLED 
      }}>
        <Icon size={32} />
      </div>
      <div style={{ 
        fontSize: 20, 
        color: TEXT_PRIMARY, 
        fontWeight: 500, 
        textAlign: "center" 
      }}>{title}</div>
      <p style={{ 
        margin: 0, 
        fontSize: 14, 
        color: TEXT_SECONDARY, 
        textAlign: "center", 
        maxWidth: 360 
      }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          style={{ ...primaryBtn, marginTop: 8 }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
