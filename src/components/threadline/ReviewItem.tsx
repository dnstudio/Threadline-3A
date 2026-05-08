import React from "react";
import { ACCEPTED_BG, REJECTED_BG, DEFERRED_BG, BRAND_LIGHT, BRAND, DEFERRED_ICON_COLOR, TEXT_PRIMARY, TEXT_SECONDARY } from "./constants";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { ConfidenceBadge, mapScoreToConfidence } from "../common/ConfidenceBadge";
import { AlertCircle } from "lucide-react";

export interface ReviewItemProps {
  label: string;
  score: string;
  active?: boolean;
  deferred?: boolean;
  accepted?: boolean;
  rejected?: boolean;
  hasConflict?: boolean;
  onClick: () => void;
  type?: string;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ label, score, active = false, deferred = false, accepted = false, rejected = false, hasConflict = false, onClick, type }) => {
  const { flags } = useFeatureFlags();
  const isDeferredActive = active && deferred;
  const isAcceptedActive = active && accepted;
  const isRejectedActive = active && rejected;
  const isNextStep = type === 'nextstep';
  
  return (
    <div 
      onClick={accepted ? undefined : onClick}
      style={{
        padding: "16px 24px",
        background: isAcceptedActive ? ACCEPTED_BG : (isRejectedActive ? REJECTED_BG : (isDeferredActive ? DEFERRED_BG : (active ? BRAND_LIGHT : "transparent"))),
        cursor: accepted ? "default" : "pointer",
        transition: "background 0.2s",
        borderLeft: active ? `4px solid ${accepted ? "#2e7d32" : (rejected || deferred ? "#ff5252" : BRAND)}` : "4px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative"
      }}
    >
      {!isNextStep ? (
        <>
          {hasConflict && !accepted && !rejected && !deferred && (
            <div title="Conflict detected" style={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#f97316" // Orange for conflict
            }}>
              <AlertCircle size={14} />
            </div>
          )}
          {accepted ? (
            <div style={{
              width: 20, height: 20, borderRadius: "50%", border: `2px solid #2e7d32`,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#2e7d32"
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          ) : rejected ? (
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "#ff5252",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: "bold"
            }}>!</div>
          ) : deferred ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={DEFERRED_ICON_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          ) : null}
        </>
      ) : null}
      <div style={{ flex: 1, paddingLeft: (isNextStep || (!accepted && !rejected && !deferred)) ? 36 : 0 }}>
        <div style={{ 
          fontSize: 15, 
          color: (rejected || deferred) ? "#ff5252" : TEXT_PRIMARY, 
          marginBottom: 4, 
          fontWeight: active ? 500 : 400,
          textDecoration: deferred ? "line-through" : "none"
        }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: TEXT_SECONDARY, display: "flex", alignItems: "center", gap: 6 }}>
          {flags.FEATURE_CONFIDENCE_BADGE ? (
            <div style={{ marginTop: 4 }}>
              <ConfidenceBadge 
                confidence={
                  !isNaN(parseFloat(score)) 
                    ? mapScoreToConfidence(parseFloat(score))
                    : (score.toLowerCase() === 'high' ? 'high' : score.toLowerCase() === 'medium' ? 'medium' : 'low')
                } 
              />
            </div>
          ) : (
            <>
              {isNextStep ? "Impact :" : "Relevance score :"} <span style={{ fontWeight: 400 }}>{score}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
