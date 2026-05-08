import React, { useState, useRef } from "react";
import { Toast, SignalBox } from "./components";
import { ModifyModal, SkipNextStepModal } from "./Modals";
import { ReviewItem } from "./ReviewItem";
import { BRAND, ACCEPTED_BG, REJECTED_BG, DEFERRED_BG, BRAND_LIGHT, 
  DEFERRED_ICON_COLOR, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, 
  DIVIDER, primaryBtn, outlineBtn, cardStyle, cardHeaderStyle, h1Style, subStyle, TYPE_SCALE } from "./constants";
import { ArrowLeft as BackArrow, RotateCcw as ResetIcon, AlertTriangle, AlertCircle, Edit3 as EditIcon, ExternalLink, ThumbsUp, ThumbsDown, MessageSquare, Info } from "lucide-react";

import { AssessmentGate } from "./AssessmentGate";
import { SectionHeader } from "../common/SectionHeader";
import { WorkspaceContainer } from "../common/WorkspaceContainer";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";
import { ConfidenceBadge, mapScoreToConfidence } from "../common/ConfidenceBadge";
import { Button, Badge, Card, Typography } from "./ui";

import { MOCK_EVIDENCE_ITEMS, MOCK_CONFLICTS, MOCK_MISSING_DOCUMENTS } from "./mockData";
import { FEATURE_CONFIDENCE_THRESHOLD as CONFIDENCE_THRESHOLD } from "./constants";

export function EvidenceWorkspace({ 
  onViewProfile, 
  onNavigateToAssessments,
  onNavigateToDocuments 
}: { 
  onViewProfile?: () => void, 
  onNavigateToAssessments?: () => void,
  onNavigateToDocuments?: () => void
}) {
  const { flags } = useFeatureFlags();
  const { setConflicts, setMissingDocuments, setAcceptedMappings, setLowConfidenceMappings } = useWorkspaceAlerts();

  // TODO: acceptedMappings must be written to shared assessment state in EvidenceWorkspace for this check to function
  
  // TODO: Gemini response must include sourceDocumentId per mapping for this feature to function
  const [items, setItems] = useState(MOCK_EVIDENCE_ITEMS);
  
  const [activeItem, setActiveItem] = useState("Journal Entry");
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const [deferredItems, setDeferredItems] = useState<string[]>([]);
  const [acceptedItem, setAcceptedItem] = useState<string | null>(null);
  const [rejectedItems, setRejectedItems] = useState<Record<string, string>>({});
  const [isRejecting, setIsRejecting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [activeAction, setActiveAction] = useState<'accept' | 'reject' | 'modify' | null>(null);
  const [rationale, setRationale] = useState("");
  const rationaleRef = useRef<HTMLTextAreaElement>(null);

  const currentItem = items.find(i => i.label === activeItem) || items[0];
  const isCriteria = currentItem.type === 'criteria';
  const isNextStep = currentItem.type === 'nextstep';
  const itemConfidence = parseFloat(currentItem.score);
  const hasConflict = flags.FEATURE_WORKSPACE_STATUS_BAR && (currentItem.hasConflict);
  
  const requiresRationale = (action: 'accept' | 'reject' | 'modify') => {
    if (action === 'reject') return true;
    if (action === 'modify') return true;
    if (action === 'accept' && itemConfidence < CONFIDENCE_THRESHOLD) return true;
    if (hasConflict) return true;
    if (deferredItems.includes(activeItem)) return true;
    return false;
  };

  const getSystemSuggestedRationale = (action: 'accept' | 'reject' | 'modify') => {
    if (action === 'accept') return `Evidence strongly supports the ${currentItem.type} mapping based on clinical guidelines.`;
    if (action === 'reject') return `Insufficient semantic overlap between evidence and ${currentItem.type} criteria.`;
    if (action === 'modify') return `Refined mapping to better capture clinical nuance of ${currentItem.label}.`;
    return "";
  };

  const handleActionClick = (action: 'accept' | 'reject' | 'modify') => {
    if (requiresRationale(action)) {
      setActiveAction(action);
      setRationale(getSystemSuggestedRationale(action));
      setTimeout(() => rationaleRef.current?.focus(), 50);
    } else {
      if (action === 'accept') handleAccept();
      if (action === 'reject') setIsRejecting(true); // Fallback to existing logic if needed
      if (action === 'modify') setIsModifyOpen(true);
    }
  };

  const commitAction = () => {
    if (activeAction === 'accept') {
      console.info("AUDIT LOG:", {
        mappingId: activeItem,
        action: "ACCEPT",
        rationale: rationale,
        timestamp: new Date().toISOString(),
        confidence: currentItem.score,
        clinicianId: "CLIN-123"
      });
      handleAccept();
    } else if (activeAction === 'reject') {
      console.info("AUDIT LOG:", {
        mappingId: activeItem,
        action: "REJECT",
        rationale: rationale,
        timestamp: new Date().toISOString(),
        confidence: currentItem.score,
        clinicianId: "CLIN-123"
      });
      handleReject(rationale);
    } else if (activeAction === 'modify') {
      console.info("AUDIT LOG:", {
        mappingId: activeItem,
        action: "MODIFY",
        rationale: rationale,
        timestamp: new Date().toISOString(),
        confidence: currentItem.score,
        clinicianId: "CLIN-123"
      });
      setIsModifyOpen(true);
    }
    setActiveAction(null);
    setRationale("");
  };

  const handleDefer = () => {
    if (!deferredItems.includes(activeItem)) {
      setDeferredItems([...deferredItems, activeItem]);
    }
  };

  const handleReject = (reason: string) => {
    setRejectedItems({ ...rejectedItems, [activeItem]: reason });
    setIsRejecting(false);
  };

  const handleUndoReject = () => {
    const newRejected = { ...rejectedItems };
    delete newRejected[activeItem];
    setRejectedItems(newRejected);
  };

  const handleAccept = () => {
    setAcceptedItem(activeItem);
    setShowToast(true);

    // Update shared state for completeness check
    const acceptedItemData = items.find(i => i.label === activeItem);
    if (acceptedItemData) {
      setAcceptedMappings((prev: any[]) => {
        // Prevent duplicates
        if (prev.find(m => m.id === activeItem)) return prev;
        return [...prev, { id: activeItem, label: activeItem, confidence: parseFloat(acceptedItemData.score) || 0 }];
      });
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      
      const currentIndex = items.findIndex(i => i.label === activeItem);
      const nextItem = items[currentIndex + 1] || items[currentIndex - 1] || null;
      
      setItems(prev => prev.filter(i => i.label !== activeItem));
      setAcceptedItem(null);
      
      if (nextItem) {
        setActiveItem(nextItem.label);
      }
      transitionTimeoutRef.current = null;
    }, 3000);
  };

  const handleUndoAccept = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setAcceptedMappings((prev: any[]) => prev.filter(m => m.id !== activeItem));
    setAcceptedItem(null);
    setShowToast(false);
  };

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <div style={{ padding: "0 0 64px" }}>
        {/* Page Header */}
        <SectionHeader 
          title="Evidence Workspace"
          subtitle="Review extracted evidence, assess diagnostic criteria, and identify next steps"
          small={true}
        />

        <WorkspaceContainer
          height={800}
          sidebarWidth={280}
          sidebarContent={
            <>
            <div style={{ padding: "24px 20px", borderBottom: `1px solid ${DIVIDER}` }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY }}>Review Queue</h2>
            </div>
            
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f1f5f9" }}>
              Evidence ({items.filter(i => i.type === 'evidence').length})
            </div>
            {items.filter(i => i.type === 'evidence').map(item => (
              <ReviewItem 
                key={item.label}
                label={item.label} 
                score={item.score} 
                type={item.type}
                active={activeItem === item.label} 
                deferred={deferredItems.includes(item.label)} 
                accepted={acceptedItem === item.label}
                rejected={!!rejectedItems[item.label]}
                hasConflict={item.hasConflict}
                onClick={() => setActiveItem(item.label)} 
              />
            ))}
            
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f1f5f9", borderTop: `1px solid ${DIVIDER}` }}>
              Criteria ({items.filter(i => i.type === 'criteria').length})
            </div>
            {items.filter(i => i.type === 'criteria').map(item => (
              <ReviewItem 
                key={item.label}
                label={item.label} 
                score={item.score} 
                type={item.type}
                active={activeItem === item.label} 
                deferred={deferredItems.includes(item.label)} 
                accepted={acceptedItem === item.label}
                rejected={!!rejectedItems[item.label]}
                hasConflict={item.hasConflict}
                onClick={() => setActiveItem(item.label)} 
              />
            ))}
    
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f1f5f9", borderTop: `1px solid ${DIVIDER}` }}>
              Next steps ({items.filter(i => i.type === 'nextstep').length})
            </div>
            {items.filter(i => i.type === 'nextstep').map(item => (
              <ReviewItem 
                key={item.label}
                label={item.label} 
                score={item.type === 'nextstep' ? (item as any).impact : item.score} 
                type={item.type}
                active={activeItem === item.label} 
                deferred={deferredItems.includes(item.label)} 
                accepted={acceptedItem === item.label}
                rejected={!!rejectedItems[item.label]}
                hasConflict={item.hasConflict}
                onClick={() => setActiveItem(item.label)} 
              />
            ))}
    
            <div style={{ padding: "16px 24px", ...TYPE_SCALE.HeadingSmall, background: "#f1f5f9", borderTop: `1px solid ${DIVIDER}` }}>
              Deferred ({deferredItems.length})
            </div>
            {deferredItems.map(item => (
              <div key={item} style={{ padding: "16px 24px", background: "#f0f9f1", borderLeft: `4px solid ${BRAND}` }}>
                <div style={{ fontSize: 15, color: TEXT_PRIMARY, marginBottom: 4, fontWeight: 500 }}>{item}</div>
                <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>Relevance score : <span style={{ fontWeight: 500 }}>0.89</span></div>
              </div>
            ))}
            </>
          }
          mainContent={
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toast message={`${activeItem} successfully accepted`} visible={showToast} />
            <ModifyModal 
              isOpen={isModifyOpen} 
              onClose={() => setIsModifyOpen(false)} 
              item={currentItem}
            />
            <SkipNextStepModal
              isOpen={isSkipOpen}
              onClose={() => setIsSkipOpen(false)}
              item={currentItem}
              onConfirm={handleAccept}
            />
            {/* Stepper + Navigation Row */}
            <div style={{ padding: "20px 32px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: currentItem.type === 'evidence' ? BRAND : "#e0e0e0", color: currentItem.type === 'evidence' ? "white" : TEXT_SECONDARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>1</span>
                <span style={{ fontSize: 14, fontWeight: currentItem.type === 'evidence' ? 500 : 400, color: currentItem.type === 'evidence' ? TEXT_PRIMARY : TEXT_SECONDARY }}>Evidence</span>
              </div>
              <div style={{ height: 1, width: 40, background: DIVIDER }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: currentItem.type === 'criteria' ? BRAND : "#e0e0e0", color: currentItem.type === 'criteria' ? "white" : TEXT_SECONDARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>2</span>
                <span style={{ fontSize: 14, fontWeight: currentItem.type === 'criteria' ? 500 : 400, color: currentItem.type === 'criteria' ? TEXT_PRIMARY : TEXT_SECONDARY }}>Criteria</span>
              </div>
              <div style={{ height: 1, width: 40, background: DIVIDER }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: currentItem.type === 'nextstep' ? BRAND : "#e0e0e0", color: currentItem.type === 'nextstep' ? "white" : TEXT_SECONDARY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>3</span>
                <span style={{ fontSize: 14, fontWeight: currentItem.type === 'nextstep' ? 500 : 400, color: currentItem.type === 'nextstep' ? TEXT_PRIMARY : TEXT_SECONDARY }}>Next Steps</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>Item <span style={{ fontWeight: 500, color: TEXT_PRIMARY }}>{items.findIndex(i => i.label === activeItem) + 1}</span> of {items.length}</span>
              <Button 
                variant="outline"
                onClick={() => {
                  const idx = items.findIndex(i => i.label === activeItem);
                  if (idx > 0) setActiveItem(items[idx - 1].label);
                }}
                disabled={items.findIndex(i => i.label === activeItem) === 0}
                icon={<BackArrow size={16} />}
                style={{ padding: "8px 24px" }}
              >
                Previous
              </Button>
              <Button 
                onClick={() => {
                  const idx = items.findIndex(i => i.label === activeItem);
                  if (idx < items.length - 1) setActiveItem(items[idx + 1].label);
                }}
                disabled={items.findIndex(i => i.label === activeItem) === items.length - 1}
                style={{ padding: "8px 24px" }}
              >
                Next <div style={{ transform: "rotate(180deg)", display: 'flex' }}><BackArrow size={16} /></div>
              </Button>
            </div>
          </div>
  
          {/* Evidence Detail Container */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
            {acceptedItem === activeItem && (
  
              <div style={{ 
                background: "#ecf2eb", padding: "16px 32px", display: "flex", alignItems: "center", gap: 12,
                borderBottom: "1px solid rgba(46, 125, 50, 0.1)"
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", border: "2px solid #4caf50",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#4caf50"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#4caf50" }}>
                  Confirmation received: {isNextStep ? "Next step" : isCriteria ? "Criterion" : "Evidence"} has been accepted.
                </div>
              </div>
            )}
            
            {rejectedItems[activeItem] && (
              <div style={{ 
                background: "#ffebf0", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
                borderBottom: "1px solid rgba(255, 82, 82, 0.1)"
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: "#ff5252",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, fontWeight: "bold"
                }}>!</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#ff5252" }}>Evidence rejected</div>
                  <div style={{ fontSize: 13, color: "#ff5252", opacity: 0.8 }}>Reason: {rejectedItems[activeItem]}</div>
                </div>
              </div>
            )}
            
            <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
              {isNextStep ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Target criterion
                    </div>
                    <div style={{ fontSize: 24, color: TEXT_PRIMARY, fontWeight: 600 }}>{activeItem}</div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Suggested question
                    </div>
                    <div style={{ 
                      background: "#f1f5f9", padding: "16px 20px", borderRadius: 4, 
                      fontSize: 16, color: TEXT_SECONDARY, border: `1px solid #e2e8f0` 
                    }}>
                      "Do you worry that people might judge you negatively in social situations?"
                    </div>
                  </div>
  
                  <div style={{ display: "flex", gap: "15%" }}>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Expected impact
                      </div>
                      <span style={{ 
                        background: "#e0f2fe", color: "#0ea5e9", padding: "6px 16px", 
                        borderRadius: 20, fontSize: 14, fontWeight: 500, display: "inline-block", 
                        border: "1px solid rgba(14, 165, 233, 0.2)" 
                      }}>
                        {(currentItem as any).impact || "High information gain"}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Reason
                      </div>
                      <div style={{ fontSize: 15, color: TEXT_SECONDARY }}>
                        -
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
              <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {isCriteria ? "Criterion name" : "Evidence Type"}
                </div>
                <div style={{ fontSize: 24, color: TEXT_PRIMARY, fontWeight: 600 }}>{activeItem}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {flags.FEATURE_CONFIDENCE_BADGE ? (
                  <ConfidenceBadge 
                    confidence={
                      !isNaN(parseFloat(currentItem.score)) 
                        ? mapScoreToConfidence(parseFloat(currentItem.score))
                        : (currentItem.score.toLowerCase() === 'high' ? 'high' : currentItem.score.toLowerCase() === 'medium' ? 'medium' : 'low')
                    } 
                  />
                ) : (
                  <>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Certainty Score
                    </div>
                    <div style={{ fontSize: 14, color: TEXT_PRIMARY, fontWeight: 600, marginBottom: 8 }}>{currentItem.score}</div>
                    <span style={{ background: BRAND_LIGHT, color: "#4caf50", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(76, 175, 80, 0.2)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50" }} /> High Relevance
                    </span>
                  </>
                )}
              </div>
            </div>
  
            {hasConflict && (
              <div style={{ 
                marginBottom: 24, 
                padding: "12px 16px", 
                background: "#fff7ed", 
                border: "1px solid #ffedd5", 
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#9a3412"
              }}>
                <AlertCircle size={18} color="#f97316" />
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  Conflict detected: This evidence contradicts other extracted signals. Please review carefully.
                </div>
              </div>
            )}

            {(isCriteria) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Suggested status
                  </div>
                  <div style={{ 
                    background: "#e8f5e9", 
                    color: "#2e7d32", 
                    padding: "6px 16px", borderRadius: 20, fontSize: 13, 
                    fontWeight: 500, display: "inline-block", 
                    border: "1px solid rgba(46, 125, 50, 0.1)"
                  }}>
                    Supported
                  </div>
                </div>
  
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Supporting evidence
                  </div>
                  <div style={{ ...TYPE_SCALE.BodyStandard, lineHeight: 1.8 }}>
                    <div style={{ marginBottom: 4 }}>• "I feel low most days."</div>
                    <div>• PHQ-9 score = 14</div>
                  </div>
                </div>
  
                <div style={{ 
                  borderLeft: "4px solid #f97316", padding: "16px 24px", 
                  borderRadius: "0 4px 4px 0", display: "flex", gap: 16, background: "rgba(255, 152, 0, 0.08)"
                }}>
                  <div style={{ marginTop: 2 }}><AlertTriangle size={20} color="#f97316" /></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#9a3412", marginBottom: 4 }}>Missing information</div>
                    <div style={{ fontSize: 14, color: "#c2410c" }}>None</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
              <div className="flex flex-col gap-10 mb-8">
                {(activeItem === "Journal Entry" ? [
                  {
                    id: 1,
                    text: "\"I felt very anxious today when I had to speak in the meeting. I kept thinking everyone was looking at my hands shaking.\"",
                    signalTitle: "Social anxiety symptoms",
                    signalDesc: "Client reports intense anxiety in social or performance situations where they feel subjected to scrutiny.",
                    source: "Client Digital Journal ( May 01, 2026 )",
                  },
                  {
                    id: 2,
                    text: "\"I couldn't sleep again, replaying what I said. It felt like everyone judged me.\"",
                    signalTitle: "Rumination & Sleep Disturbance",
                    signalDesc: "Post-event processing characterized by negative self-evaluation leading to sleep difficulties.",
                    source: "Client Digital Journal ( May 03, 2026 )",
                  }
                ] : [
                  {
                    id: 1,
                    text: "\"I mostly just go to work and come home.\"",
                    signalTitle: "Reduced social engagement",
                    signalDesc: "Avoidance of social interactions outside of mandatory work obligations.",
                    source: "Session transcript ( Session 1 - Timestamp 03:17 )",
                  }
                ]).map(block => (
                  <div key={block.id} className="flex flex-col gap-5">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence text</div>
                      <div style={{ 
                        background: "#ffffff", 
                        padding: "16px 20px", 
                        borderRadius: 6, 
                        fontSize: 15, 
                        lineHeight: 1.6, 
                        color: TEXT_PRIMARY, 
                        fontStyle: "italic",
                        borderLeft: `3px solid ${BRAND}`
                      }}>
                        {block.text}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-8">
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Candidate Signal</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800">{block.signalTitle}</span>
                          <div className="relative group flex items-center">
                            <Info size={16} className="text-slate-400 cursor-help hover:text-slate-600 transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-10" style={{ lineHeight: 1.5 }}>
                              {block.signalDesc}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Source</div>
                        <div className="flex flex-col gap-1.5">
                          {flags.FEATURE_EVIDENCE_SOURCE_LINKS && (currentItem as any).sourceDocumentId ? (
                            <button 
                              onClick={onNavigateToDocuments}
                              className="flex items-center font-medium gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors w-fit group"
                            >
                              <ExternalLink size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                              <span className="underline underline-offset-2">{block.source}</span>
                            </button>
                          ) : (
                            <div className="text-sm text-slate-600">{block.source}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
                <div style={{ marginBottom: 32 }}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">This evidence will be mapped to</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "#e3f2fd", color: "#2196f3", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 500 }}>Reduced activity</div>
                    <div style={{ background: "#e3f2fd", color: "#2196f3", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 500 }}>Social withdrawal</div>
                  </div>
                </div>

                {/* Inline Rationale Section for FEATURE_EQUALISED_MAPPING_ACTIONS */}
                {flags.FEATURE_EQUALISED_MAPPING_ACTIONS && activeAction && (
                  <div style={{ 
                    marginTop: 32, padding: "24px", background: "#f1f5f9", 
                    borderRadius: 8, border: `1px solid #e2e8f0`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ 
                        padding: 8, borderRadius: "50%", 
                        background: activeAction === 'accept' ? "#dcfce7" : activeAction === 'reject' ? "#fee2e2" : "#f1f5f9",
                        color: activeAction === 'accept' ? "#166534" : activeAction === 'reject' ? "#991b1b" : "#475569"
                      }}>
                        {activeAction === 'accept' ? <ThumbsUp size={18} /> : activeAction === 'reject' ? <ThumbsDown size={18} /> : <EditIcon size={18} />}
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 500, color: TEXT_PRIMARY }}>
                        Reason for {activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}
                      </span>
                    </div>
                    
                    <textarea 
                      ref={rationaleRef}
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      placeholder="Add clinical rationale..."
                      style={{ 
                        width: "100%", height: 100, padding: 12, borderRadius: 6, 
                        border: `1px solid ${DIVIDER}`, fontSize: 14, outline: "none",
                        fontFamily: "inherit", resize: "none", marginBottom: 16
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                      <button 
                        onClick={() => setActiveAction(null)}
                        style={{ ...outlineBtn, padding: "8px 20px", fontSize: 13 }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={commitAction}
                        disabled={rationale.length === 0}
                        style={{ 
                          ...primaryBtn, 
                          padding: "8px 20px", fontSize: 13,
                          background: activeAction === 'accept' ? "#16a34a" : activeAction === 'reject' ? "#dc2626" : "#0f172a",
                          opacity: rationale.length === 0 ? 0.5 : 1
                        }}
                      >
                        Commit Action
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}
              </>
            )}
          </div>
        </div>
  
        {/* Footer Actions */}
          <div style={{ padding: "20px 32px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", background: "#f8fafc", flexShrink: 0 }}>
            {flags.FEATURE_EQUALISED_MAPPING_ACTIONS ? (
              <div style={{ display: "flex", width: "100%", gap: 16 }}>
                <Button 
                  variant="outline"
                  onClick={() => handleActionClick('accept')}
                  disabled={!!acceptedItem || activeAction !== null}
                  icon={<ThumbsUp size={18} />}
                  style={{ 
                    flex: 1, height: 44, 
                    borderWidth: 2, borderColor: "#22c55e", color: "#166534",
                    opacity: activeAction && activeAction !== 'accept' ? 0.3 : (!!acceptedItem ? 0.5 : 1)
                  }}
                >
                  Accept
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleActionClick('reject')}
                  disabled={activeAction !== null}
                  icon={<ThumbsDown size={18} />}
                  style={{ 
                    flex: 1, height: 44,
                    borderWidth: 2, borderColor: "#ef4444", color: "#991b1b",
                    opacity: activeAction && activeAction !== 'reject' ? 0.3 : 1
                  }}
                >
                  Reject
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleActionClick('modify')}
                  disabled={activeAction !== null}
                  icon={<EditIcon size={18} />}
                  style={{ 
                    flex: 1, height: 44,
                    borderWidth: 2, borderColor: "#3b82f6", color: "#1e40af",
                    opacity: activeAction && activeAction !== 'modify' ? 0.3 : 1
                  }}
                >
                  Modify
                </Button>
              </div>
            ) : isNextStep ? (
              <>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    onClick={() => setIsModifyOpen(true)}
                    icon={<EditIcon size={14} />}
                    style={{ background: "#ff9800" }}
                  >
                    Modify Wording
                  </Button>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    variant="outline"
                    onClick={() => setIsSkipOpen(true)}
                  >
                    Skip <div style={{ transform: "rotate(180deg)", display: 'flex' }}><BackArrow size={16} /></div>
                  </Button>
                  <Button 
                    onClick={handleAccept}
                    icon={<span style={{ fontSize: 18, fontWeight: 400 }}>✓</span>}
                  >
                    Accept
                  </Button>
                </div>
              </>
            ) : isRejecting ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setIsRejecting(false)}
                >
                  <span style={{ fontSize: 18, fontWeight: 400, marginRight: 8 }}>✕</span> Cancel
                </Button>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    onClick={() => handleReject("Wrong Criterion")}
                    style={{ background: "#ff5252" }}
                  >
                     Wrong Criterion
                  </Button>
                  <Button 
                    onClick={() => handleReject("Not Diagnostic Evidence")}
                    style={{ background: "#ff5252" }}
                  >
                     Not Diagnostic Evidence
                  </Button>
                  <Button 
                    onClick={() => handleReject("Too Weak")}
                    style={{ background: "#ff5252" }}
                  >
                     Too Weak
                  </Button>
                </div>
              </>
            ) : rejectedItems[activeItem] ? (
              <>
                <div />
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    variant="outline"
                    onClick={handleUndoReject}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 010 10H3"/><path d="M7 14L3 10l4-4"/></svg>}
                  >
                    Undo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsModifyOpen(true)}
                    icon={<EditIcon size={14} />}
                  >
                    Modify
                  </Button>
                </div>
              </>
            ) : acceptedItem === activeItem ? (
              <>
                <div />
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    variant="outline"
                    onClick={handleUndoAccept}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 010 10H3"/><path d="M7 14L3 10l4-4"/></svg>}
                  >
                    Undo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsModifyOpen(true)}
                    icon={<EditIcon size={14} />}
                  >
                    Modify
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    variant="outline"
                    onClick={handleDefer}
                    disabled={deferredItems.includes(activeItem)}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                    style={{ opacity: deferredItems.includes(activeItem) ? 0.6 : 1 }}
                  >
                    Defer
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsModifyOpen(true)}
                    icon={<EditIcon size={14} />}
                  >
                    Modify
                  </Button>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button 
                    variant="outline"
                    onClick={() => setIsRejecting(true)}
                    icon={<ResetIcon size={16} />}
                    style={{ borderColor: "#ff5252", color: "#ff5252" }}
                  >
                    {isCriteria || isNextStep ? "Rule Out" : <><span style={{ fontSize: 18, fontWeight: 400, marginRight: 8 }}>✕</span> Reject</>}
                  </Button>
                  <Button 
                    onClick={handleAccept}
                    disabled={!!acceptedItem}
                    icon={<span style={{ fontSize: 18, fontWeight: 400 }}>✓</span>}
                    style={{ opacity: acceptedItem ? 0.6 : 1 }}
                  >
                    Accept
                  </Button>
                </div>
              </>
            )}
            </div>
          </div>
        }
      />
      </div>
    </AssessmentGate>
  );
}
