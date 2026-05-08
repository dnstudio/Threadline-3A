import React, { useState } from "react";
import { History, ChevronRight, ChevronLeft, Calendar, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_ASSESSMENTS } from "./mockData";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, TYPE_SCALE } from "./constants";

// SCOPE NOTE: If longitudinal comparison is out of scope, remove this component and document the limitation in the IFU

export function AssessmentCompareSidebar() {
  const { flags, activeAssessmentId } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (!flags.FEATURE_PRIOR_ASSESSMENT_COMPARE || !activeAssessmentId) return null;

  // For demo, we consider all assessments except the active one as "prior"
  const priorAssessments = MOCK_ASSESSMENTS.filter((_, idx) => String(idx) !== activeAssessmentId);

  if (priorAssessments.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      right: 0,
      top: 64, // below navbar
      bottom: 0,
      zIndex: 100,
      display: "flex",
      pointerEvents: "none"
    }}>
      {/* Toggle Button */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "120px",
        height: "100%"
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "#388e3c",
            color: "white",
            border: "none",
            borderRadius: "8px 0 0 8px",
            padding: "16px 8px",
            cursor: "pointer",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <div style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: 12,
            fontWeight: 600,
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap"
          }}>
            Prior Assessments
          </div>
          <History size={18} color="white" />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              width: 360,
              background: "white",
              borderLeft: `1px solid ${DIVIDER}`,
              boxShadow: "-4px 0 16px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              pointerEvents: "auto"
            }}
          >
            <div style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${DIVIDER}`,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <History size={20} color="#388e3c" />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>Assessment History</h2>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {priorAssessments.map((assessment, i) => (
                  <div key={i} style={{
                    position: "relative",
                    padding: 16,
                    borderRadius: 12,
                    border: `1px solid ${DIVIDER}`,
                    background: "#fff",
                    transition: "transform 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, ...TYPE_SCALE.LabelMicro }}>
                        <Calendar size={13} />
                        {assessment.subtitle.split(' • ')[0]}
                      </div>
                      <div style={{ 
                        fontSize: 9, 
                        fontWeight: 700, 
                        padding: "2px 8px", 
                        borderRadius: 20,
                        background: assessment.status.toLowerCase() === 'completed' ? "#dcfce7" : "#fef3c7",
                        color: assessment.status.toLowerCase() === 'completed' ? "#15803d" : "#b45309",
                        textTransform: "uppercase"
                      }}>
                        {assessment.status.toLowerCase() === 'completed' ? 'Formulated' : 'Deferred'}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#388e3c", marginBottom: 8 }}>
                      {assessment.title}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, ...TYPE_SCALE.LabelMicro, marginBottom: 12 }}>
                      <User size={13} />
                      Assessed by: {assessment.subtitle.split(' • ')[1]}
                    </div>

                    <div style={{
                      paddingTop: 12,
                      borderTop: `1px dashed ${DIVIDER}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      marginTop: 4
                    }}>
                      <Info size={14} color={TEXT_SECONDARY} style={{ marginTop: 2 }} />
                      <div style={{ fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.6, fontStyle: "italic" }}>
                        Conclusion: Symptoms aligned with {assessment.title} guidelines. Recommended follow-up in 3 months.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, borderTop: `1px solid ${DIVIDER}`, background: "#f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, ...TYPE_SCALE.LabelMicro }}>
                <Info size={14} />
                <span>Quick-access archive for longitudinal support</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
