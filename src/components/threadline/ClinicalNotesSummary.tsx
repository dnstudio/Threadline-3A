import React, { useState } from "react";
import { StickyNote, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_CLIENT_DATA } from "./mockData";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND } from "./constants";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";

interface ClinicalNotesSummaryProps {
  clientId?: string;
  onViewProfile?: () => void;
}

export function ClinicalNotesSummary({ clientId = "125566", onViewProfile }: ClinicalNotesSummaryProps) {
  const { flags } = useFeatureFlags();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!flags.FEATURE_CLINICAL_NOTES_STRIP) return null;

  const clientData = MOCK_CLIENT_DATA[clientId];
  if (!clientData || !clientData.sessions || clientData.sessions.length === 0) return null;

  // Find most recent note
  const lastSession = [...clientData.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  if (!lastSession) return null;

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    const weeks = Math.floor(diffDays / 7);
    if (weeks === 1) return "1 week ago";
    return `${weeks} weeks ago`;
  };

  return (
    <div style={{ 
      marginBottom: 24, 
      border: `1px solid ${DIVIDER}`, 
      borderRadius: 8, 
      background: "white", 
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: "12px 20px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          cursor: "pointer",
          background: isExpanded ? "#f9fafb" : "white",
          transition: "background 0.2s"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: "50%", 
            background: "rgba(6, 48, 44, 0.05)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: BRAND
          }}>
            <StickyNote size={16} />
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>Clinical notes</span>
            <span style={{ margin: "0 8px", color: DIVIDER }}>•</span>
            <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>updated {timeAgo(lastSession.date)}</span>
          </div>
        </div>
        <div style={{ color: TEXT_SECONDARY }}>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div style={{ padding: "0 20px 20px 64px" }}>
              <div style={{ 
                padding: "16px", 
                background: "#f1f5f9", 
                borderRadius: 6, 
                fontSize: 14, 
                lineHeight: 1.6, 
                color: TEXT_PRIMARY,
                borderLeft: `3px solid ${BRAND}`,
                marginBottom: 16
              }}>
                {lastSession.notes}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile?.();
                }}
                style={{ 
                  background: "none", 
                  border: "none", 
                  padding: 0, 
                  color: BRAND, 
                  fontSize: 13, 
                  fontWeight: 500, 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                View full profile <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
