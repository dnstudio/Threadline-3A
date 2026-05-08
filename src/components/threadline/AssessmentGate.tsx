import React from "react";
import { ClipboardList } from "lucide-react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, primaryBtn } from "../threadline/constants";

interface AssessmentGateProps {
  children: React.ReactNode;
  onNavigateToAssessments: () => void;
}

export function AssessmentGate({ children, onNavigateToAssessments }: AssessmentGateProps) {
  const { flags, activeAssessmentId } = useFeatureFlags();

  if (!flags.FEATURE_ASSESSMENT_GATE || activeAssessmentId) {
    return <>{children}</>;
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "120px 24px",
      minHeight: "400px",
      textAlign: "center"
    }}>
      <div style={{ 
        width: 64, 
        height: 64, 
        borderRadius: "50%", 
        background: "#f3f4f6", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: TEXT_SECONDARY,
        marginBottom: 24
      }}>
        <ClipboardList size={32} />
      </div>
      
      <h2 style={{ 
        fontSize: 20, 
        fontWeight: 600, 
        color: TEXT_PRIMARY, 
        margin: "0 0 12px 0" 
      }}>
        No active assessment
      </h2>
      
      <p style={{ 
        fontSize: 15, 
        color: TEXT_SECONDARY, 
        margin: "0 0 32px 0",
        maxWidth: 320,
        lineHeight: 1.5
      }}>
        Start a new assessment in the Assessments tab to begin.
      </p>
      
      <button 
        onClick={onNavigateToAssessments}
        style={{ ...primaryBtn, padding: "10px 24px" }}
      >
        Go to Assessments
      </button>
    </div>
  );
}
