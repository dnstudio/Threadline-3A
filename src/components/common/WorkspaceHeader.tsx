import React from "react";
import { ChevronLeft } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, h1Style, subStyle, TYPE_SCALE } from "../threadline/constants";
import { Badge } from "../threadline/ui/Badge";
import { StatusType } from "./StatusBadge";

interface WorkspaceHeaderProps {
  title: string;
  subtitle: string;
  status: StatusType;
  onBack?: () => void;
  actions?: React.ReactNode;
  alerts?: React.ReactNode;
}

export function WorkspaceHeader({ 
  title, 
  subtitle, 
  status, 
  onBack,
  actions,
  alerts
}: WorkspaceHeaderProps) {
  return (
    <div style={{ 
      padding: "32px 60px 24px 60px", 
      borderBottom: `1px solid ${DIVIDER}`, 
      background: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }}>
      <div style={{ display: "flex", gap: 16 }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              color: TEXT_SECONDARY,
              padding: 0,
              marginTop: 4
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <h1 style={{ ...h1Style, margin: 0 }}>{title}</h1>
            <div style={{ ...TYPE_SCALE.IdLabel, marginTop: 4 }}>{subtitle}</div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge status={status} />
            {alerts}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {actions}
      </div>
    </div>
  );
}
