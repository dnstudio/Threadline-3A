import React, { useState, useEffect } from "react";
import { Plus, X, ChevronDown, MessageSquare, ClipboardCheck, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, TYPE_SCALE } from "./constants";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { AssessmentGate } from "./AssessmentGate";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";
import { Button, Card, Typography } from "./ui";

function AssessmentUncertaintyIndicator({ onNavigateToEvidence }: { onNavigateToEvidence: () => void }) {
  const { flags } = useFeatureFlags();
  const { conflicts, missingDocuments, lowConfidenceMappings } = useWorkspaceAlerts();

  if (!flags.FEATURE_UNCERTAINTY_INDICATOR) return null;

  const conflictCount = conflicts.length;
  const missingDocCount = missingDocuments.length;
  const lowConfCount = lowConfidenceMappings.length;

  if (conflictCount === 0 && missingDocCount === 0 && lowConfCount === 0) return null;

  const parts = [];
  if (lowConfCount > 0) parts.push(`${lowConfCount} low-confidence mapping${lowConfCount > 1 ? 's' : ''}`);
  if (conflictCount > 0) parts.push(`${conflictCount} unresolved conflict${conflictCount > 1 ? 's' : ''}`);
  if (missingDocCount > 0) parts.push(`${missingDocCount} missing document${missingDocCount > 1 ? 's' : ''}`);

  let text = "This assessment has ";
  if (parts.length === 1) {
    text += parts[0];
  } else if (parts.length === 2) {
    text += parts[0] + " and " + parts[1];
  } else {
    text += parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];
  }
  text += ". Consider whether Defer is appropriate.";

  return (
    <div style={{ 
      background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 8, padding: "12px 16px", 
      marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 12, color: "#92400e" 
    }}>
      <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>
        {text}
        <button 
          onClick={onNavigateToEvidence}
          style={{ background: "none", border: "none", color: "#b45309", fontWeight: 500, padding: 0, marginLeft: 8, cursor: "pointer", textDecoration: "underline" }}
        >
          View details
        </button>
      </div>
    </div>
  );
}

import { SectionHeader } from "../common/SectionHeader";

export function AnalysisWorkspace({ onViewProfile, onNavigateToAssessments, onNavigateToTab }: { onViewProfile?: () => void, onNavigateToAssessments?: () => void, onNavigateToTab?: (tab: string) => void }) {
  const { flags, activeAssessmentId } = useFeatureFlags();
  const { setHypothesisSubmitted: setSharedHypothesisSubmitted, setIsDeferred: setSharedIsDeferred, setImpressionFormulated } = useWorkspaceAlerts();
  const [hypothesisText, setHypothesisText] = useState("");
  const [hypothesisSubmitted, setHypothesisSubmitted] = useState(false);
  
  const [isDeferred, setIsDeferred] = useState(false);
  const [missingInfo, setMissingInfo] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [deferDate, setDeferDate] = useState<string | null>(null);

  // REGULATORY NOTE: This prompt is the primary architectural control for RISK-004 (premature closure) and RISK-001 (over-reliance at hypothesis stage).
  
  // Reset when assessment changes
  useEffect(() => {
    setHypothesisSubmitted(false);
    setHypothesisText("");
    setIsDeferred(false);
    setDeferDate(null);
  }, [activeAssessmentId]);

  const handleSubmitHypothesis = () => {
    if (hypothesisText.length >= 20) {
      console.info("AUDIT LOG: Hypothesis Captured", {
        hypothesisText,
        timestamp: new Date().toISOString(),
        assessmentId: activeAssessmentId
      });
      setHypothesisSubmitted(true);
      setSharedHypothesisSubmitted(true);
    }
  };

  const handleDefer = () => {
    const now = new Date().toISOString();
    console.info("AUDIT LOG: Assessment Deferred", {
      timestamp: now,
      assessmentId: activeAssessmentId,
      missingInformation: missingInfo,
      nextStep: nextStep
    });
    setDeferDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
    setIsDeferred(true);
    setSharedIsDeferred(true);
  };

  const handleFormulate = () => {
    setImpressionFormulated(true);
  };

  const showPrompt = flags.FEATURE_HYPOTHESIS_FRAMING_PROMPT && !hypothesisSubmitted;

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <div style={{ padding: "0 0 64px" }}>
        <SectionHeader 
          title="Analysis"
          subtitle="Whole Mind Analysis"
          small={true}
          actions={
            !flags.FEATURE_SINGLE_HYPOTHESIS && (
              <Button>
                <Plus size={16} /> Request Another Assessment
              </Button>
            )
          }
        />

      <AssessmentUncertaintyIndicator onNavigateToEvidence={() => onNavigateToTab?.("Evidence")} />

      <AnimatePresence mode="wait">
        {showPrompt ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: "center", maxWidth: 700, margin: "40px auto" }}
          >
            <Card style={{ padding: 40 }}>
              <div style={{ background: "#eff6ff", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: BRAND }}>
                <MessageSquare size={32} />
              </div>
              <Typography variant="HeadingHero" style={{ marginBottom: 12 }}>Clinical Hypothesis</Typography>
              <Typography variant="sub" style={{ fontSize: 16, marginBottom: 32 }}>
                Before reviewing the system's analysis, what is your working hypothesis based on the evidence you've reviewed?
              </Typography>
              
              <textarea
                value={hypothesisText}
                onChange={(e) => setHypothesisText(e.target.value)}
                placeholder="Type your hypothesis here (min. 20 characters)..."
                style={{
                  width: "100%", height: 160, padding: 20, borderRadius: 12, border: `2px solid ${DIVIDER}`,
                  fontSize: 15, fontFamily: "inherit", outline: "none", resize: "none", marginBottom: 12,
                  transition: "border-color 0.2s"
                }}
              />
              <div style={{ fontSize: 13, color: hypothesisText.length < 20 ? "#ef4444" : "#22c55e", textAlign: "left", marginBottom: 24, fontWeight: 500 }}>
                {hypothesisText.length < 20 
                  ? `Character count: ${hypothesisText.length}/20 required` 
                  : `Character count: ${hypothesisText.length} (Ready to submit)`}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Button 
                  onClick={handleSubmitHypothesis}
                  disabled={hypothesisText.length < 20}
                  style={{ width: "100%", height: 52, fontSize: 16, opacity: hypothesisText.length < 20 ? 0.5 : 1 }}
                >
                  Record my hypothesis and view analysis
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.info("AUDIT LOG: Hypothesis Skipped", { timestamp: new Date().toISOString(), assessmentId: activeAssessmentId });
                    setHypothesisSubmitted(true);
                    setSharedHypothesisSubmitted(true);
                  }}
                  style={{ width: "100%", height: 52, fontSize: 16, color: TEXT_SECONDARY }}
                >
                  Skip and view analysis
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={flags.FEATURE_HYPOTHESIS_FRAMING_PROMPT ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {flags.FEATURE_HYPOTHESIS_FRAMING_PROMPT && hypothesisSubmitted && (
              <Card style={{ marginBottom: 32, background: "#f1f5f9", borderColor: "#e2e8f0", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, color: "#475569" }}>
                  <ClipboardCheck size={20} />
                  <span style={{ fontWeight: 500, fontSize: 15 }}>Recorded Hypothesis</span>
                </div>
                <p style={{ fontSize: 15, color: TEXT_PRIMARY, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                  "{hypothesisText}"
                </p>
              </Card>
            )}

            <Card>
              {/* Initial Hypotheses */}
              {!flags.FEATURE_SINGLE_HYPOTHESIS && (
                <div style={{ marginBottom: 48 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 500, color: TEXT_PRIMARY, margin: "0 0 4px" }}>Initial Hypotheses (Optional)</h2>
                  <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: "0 0 16px" }}>Select any conditions you want to explore first</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16, border: `1px solid ${DIVIDER}`, borderRadius: 8 }}>
                    {["ADHD", "Learning Disorder", "Language Disorder"].map((tag) => (
                      <span key={tag} style={{ display: "flex", alignItems: "center", gap: 8, px: 12, py: 6, background: "#eff6ff", color: "#1e40af", fontSize: 14, borderRadius: 20, padding: "6px 12px" }}>
                        {tag} <X size={14} style={{ cursor: "pointer" }} />
                      </span>
                    ))}
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><Plus size={20} /></button>
                  </div>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>All conditions will still be evaluated</p>
                </div>
              )}

              {/* Steps List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {[
                  { id: 1, title: "What information do I have?", desc: "A summary of key information available for this Client.", content: ["Assessment data", "Information from sessions", "Documents and collateral", "Information that may be missing"] },
                  { id: 2, title: "What does this tell me about the Client?", desc: "A summary of symptom patterns, functional impacts, and Whole-Mind themes.", content: ["Whole-Mind Snapshot", "Assessment insights"] },
                  { id: 3, title: "What is the most likely working impression or stage?", desc: "A provisional diagnostic impression based on the combined assessment.", content: ["Provisional working impression", "Differential considerations", "Key diagnostic indicators", "Confidence level: HIGH", "Why this impression was generated"] },
                  { id: 4, title: "What should I do to clarify the working impression?", desc: "Suggested next steps to strengthen diagnostic clarity and reduce uncertainty.", content: ["Suggested next diagnostic steps", "Recommended information to gather", "Why these next steps were suggested"] },
                ].map((step) => (
                  <div key={step.id} style={{ display: "flex", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", border: `1px solid ${DIVIDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, color: TEXT_SECONDARY }}>
                        {step.id}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 4px" }}>{step.title}</h3>
                      <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: "0 0 24px" }}>{step.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {step.content.map((item, idx) => (
                          <div key={idx} style={{ border: `1px solid ${DIVIDER}`, borderRadius: 8, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9" }}>
                            <span style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{item}</span>
                            <ChevronDown size={18} style={{ color: "#9ca3af" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 48, padding: "32px 0", borderTop: `1px solid ${DIVIDER}` }}>
                {isDeferred ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: "#f1f5f9", border: `1px solid ${BRAND}`, borderRadius: 12, padding: 32 }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, color: BRAND, marginBottom: 24 }}>
                      <Clock size={20} />
                      <span style={{ fontWeight: 500, fontSize: 18 }}>Assessment deferred — {deferDate}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">What's still needed</label>
                        <textarea 
                          value={missingInfo}
                          onChange={(e) => setMissingInfo(e.target.value)}
                          placeholder="Detail the missing information or observations required..."
                          style={{ width: "100%", height: 100, padding: 12, borderRadius: 8, border: `1px solid ${DIVIDER}`, fontSize: 14, resize: "none", outline: "none" }}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Next step</label>
                        <select 
                          value={nextStep}
                          onChange={(e) => setNextStep(e.target.value)}
                          style={{ width: "100%", padding: "0 12px", height: 44, borderRadius: 8, border: `1px solid ${DIVIDER}`, fontSize: 14, outline: "none", background: "white" }}
                        >
                          <option value="">Select next action...</option>
                          <option value="follow-up">Schedule follow-up</option>
                          <option value="docs">Request additional documents</option>
                          <option value="specialist">Refer for specialist assessment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button 
                          variant="outline"
                          onClick={() => setIsDeferred(false)}
                          style={{ height: 40, fontSize: 13 }}
                        >
                          Revise Decision
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : flags.FEATURE_DEFER_AS_PRIMARY_ACTION ? (
                  <div style={{ display: "flex", gap: 24 }}>
                    {/* REGULATORY NOTE: Defer is the primary control for RISK-005. Salience is tested in Scenario S9-D. Do not demote this to a secondary action. */}
                    <Button 
                      variant="outline"
                      onClick={handleDefer}
                      style={{ 
                        flex: 1, height: 56, fontSize: 16, fontWeight: 500, borderRadius: 12,
                        borderColor: "#64748b", color: "#475569", background: "#f1f5f9",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                      }}
                    >
                      <Clock size={20} /> Defer Decision
                    </Button>
                    <Button 
                      onClick={handleFormulate}
                      style={{ 
                        flex: 1, height: 56, fontSize: 16, fontWeight: 500, borderRadius: 12,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                      }}
                    >
                      Formulate Impression <ArrowRight size={20} />
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                     <Button variant="outline" onClick={handleDefer} style={{ height: 44, padding: "0 24px" }}>Defer</Button>
                     <Button onClick={handleFormulate} style={{ height: 44, padding: "0 24px" }}>Formulate</Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </AssessmentGate>
  );
}

