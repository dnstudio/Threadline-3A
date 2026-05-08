import React from "react";
import { AlertTriangle, Activity, CheckCircle2, Info, HelpCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { useWorkspaceAlerts, COGNITIVE_LOOP_LABELS } from "../../contexts/WorkspaceAlertsContext";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { DIVIDER, TEXT_PRIMARY, BRAND, TEXT_SECONDARY } from "./constants";
import { Badge, Typography } from "./ui";

interface WorkspaceStatusBarProps {
  onNavigate: (tab: string) => void;
}

export function WorkspaceStatusBar({ onNavigate }: WorkspaceStatusBarProps) {
  const { flags } = useFeatureFlags();
  const { conflicts, missingDocuments, lowConfidenceMappings, currentStep } = useWorkspaceAlerts();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!flags.FEATURE_WORKSPACE_STATUS_BAR && !flags.FEATURE_COGNITIVE_LOOP_TRACKER) return null;

  const totalAlerts = conflicts.length + missingDocuments.length + lowConfidenceMappings.length;
  const showAlerts = flags.FEATURE_WORKSPACE_STATUS_BAR && totalAlerts > 0;
  const showTracker = flags.FEATURE_COGNITIVE_LOOP_TRACKER;

  if (!showAlerts && !showTracker) return null;

  const openCognitiveLoopModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "cognitive_loop");
    setSearchParams(newParams);
  };

  const alertStrings = [];
  if (conflicts.length > 0) alertStrings.push({ text: `${conflicts.length} Conflict${conflicts.length > 1 ? 's' : ''}`, type: 'conflict', count: conflicts.length });
  if (missingDocuments.length > 0) alertStrings.push({ text: `${missingDocuments.length} Missing Doc${missingDocuments.length > 1 ? 's' : ''}`, type: 'document', count: missingDocuments.length });
  if (lowConfidenceMappings.length > 0) alertStrings.push({ text: `${lowConfidenceMappings.length} Low Confidence`, type: 'mapping', count: lowConfidenceMappings.length });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{ 
          overflow: "hidden", 
          background: "white", 
          border: `1px solid ${DIVIDER}`,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          marginBottom: 24,
          marginTop: 8
        }}
      >
        <div style={{ 
          padding: "16px 24px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          gap: 32
        }}>
          {/* Tracker Section */}
          {showTracker && (
            <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ 
                  background: BRAND, color: "white", 
                  width: 24, height: 24, borderRadius: "50%", 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(6, 48, 44, 0.2)"
                }}>
                  <Activity size={12} strokeWidth={3} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Typography variant="LabelMicro" style={{ lineHeight: 1 }}>
                      Cognitive Loop
                    </Typography>
                    <button 
                      onClick={openCognitiveLoopModal}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}
                      title="What is the Cognitive Loop?"
                    >
                      <HelpCircle size={12} />
                    </button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND, whiteSpace: "nowrap" }}>
                    {currentStep}. {COGNITIVE_LOOP_LABELS[currentStep as any]}
                  </div>
                </div>
              </div>

              {/* Progress Pips */}
              <div style={{ display: "flex", gap: 4, alignItems: "center", flex: 1, maxWidth: 300 }}>
                {[1, 2, 3, 4, 5, 6].map((s) => {
                  const isActive = s === currentStep;
                  const isCompleted = s < currentStep;
                  return (
                    <div key={s} style={{ flex: 1, position: "relative" }}>
                      <motion.div 
                        animate={{ 
                          background: isActive ? BRAND : isCompleted ? BRAND : "#e2e8f0",
                          height: isActive ? 6 : 4
                        }}
                        style={{ borderRadius: 4 }} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alert Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {showAlerts && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {alertStrings.map((item, i) => (
                  <Badge 
                    key={item.type}
                    status={item.type === 'conflict' ? 'conflicts-unresolved' : item.type === 'document' ? 'missing-documents' : 'in-progress'}
                    label={item.text}
                    onClick={() => {
                      if (item.type === 'conflict' || item.type === 'mapping') onNavigate('Evidence');
                      if (item.type === 'document') onNavigate('Documents');
                    }}
                    style={{ cursor: 'pointer', boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                  />
                ))}
              </div>
            )}
            
            {/* Status Indicator */}
            {currentStep === 6 && !showAlerts ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669", fontSize: 11, fontWeight: 600 }}>
                <CheckCircle2 size={14} />
                <span>Verification Ready</span>
              </div>
            ) : (
              <div style={{ fontSize: 10, color: TEXT_SECONDARY, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", opacity: 0.8 }}>
                {showAlerts ? "" : "Live Processing"}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
