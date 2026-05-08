import React, { useState } from "react";
import { TabBar, AssessmentCard } from "./components";
import { Search as SearchIcon, Plus as AddIcon, ArrowLeft as BackArrow, AlertTriangle, Info, X, ChevronRight, Clock, FileX, CheckCircle } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, primaryBtn, BRAND, h1Style, subStyle, cardStyle, cardContentStyle, BRAND_LIGHT, outlineBtn } from "./constants";
import { motion, AnimatePresence } from "motion/react";
import { EvidenceWorkspace } from "./EvidenceWorkspace";
import { ReportWorkspace } from "./ReportWorkspace";
import { SessionListWorkspace } from "./SessionListWorkspace";
import { ProfileWorkspace } from "./ProfileWorkspace";
import { AnalysisWorkspace } from "./AnalysisWorkspace";
import { DocumentsWorkspace } from "./DocumentsWorkspace";
import { AssessmentResultScreen } from "./AssessmentResultScreen";
import { AssessmentCompareSidebar } from "./AssessmentCompareSidebar";
import { ClinicalNotesSidebar } from "./ClinicalNotesSidebar";
import { WorkspaceStatusBar } from "./WorkspaceStatusBar";
import { MOCK_ASSESSMENTS, MOCK_CLIENT_DATA, MOCK_CLIENTS } from "./mockData";
import { deriveClientStatus } from "./ClientListScreen";

import { StatusBadge } from "../common/StatusBadge";
import { EmptyState } from "../common/EmptyState";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { WorkspaceAlertsProvider, useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";

function ConflictResolutionModal({ isOpen, conflicts, onResolve, onSkip }: { isOpen: boolean, conflicts: any[], onResolve: () => void, onSkip: () => void }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
    }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: "white", padding: 32, borderRadius: 12, width: 440,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, color: "#991b1b" }}>
          <AlertTriangle size={24} />
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Unresolved conflicts</h2>
        </div>
        
        <p style={{ fontSize: 15, color: TEXT_SECONDARY, lineHeight: 1.5, marginBottom: 20 }}>
          You have {conflicts.length} unresolved conflict{conflicts.length > 1 ? 's' : ''}. These must be resolved before proceeding to Analysis.
        </p>

        <div style={{ 
          background: "#fef2f2", padding: 16, borderRadius: 8, marginBottom: 24,
          maxHeight: 160, overflowY: "auto", border: "1px solid #fee2e2"
        }}>
          {conflicts.map((c, i) => (
            <div key={i} style={{ 
              display: "flex", gap: 8, fontSize: 13, color: "#991b1b",
              marginBottom: i === conflicts.length - 1 ? 0 : 12
            }}>
              <div style={{ marginTop: 4, width: 4, height: 4, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
              {c.description}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={onSkip}
            style={{ ...outlineBtn, flex: 1, height: 44, color: TEXT_SECONDARY, borderColor: DIVIDER }}
          >
            Skip for now
          </button>
          <button 
            onClick={onResolve}
            style={{ ...primaryBtn, flex: 1, height: 44, background: "#dc2626" }}
          >
            Resolve conflicts
          </button>
        </div>
      </motion.div>
    </div>
  );
}


import { WorkspaceHeader } from "../common/WorkspaceHeader";
import { SectionHeader } from "../common/SectionHeader";
import { useLocation } from "react-router-dom";

function AssessmentListScreenContent({ clientId, onBack }: { clientId: string, onBack: () => void }) {
  const { flags, setActiveAssessmentId, useGroupedTabs, setActiveClientId } = useFeatureFlags();
  const { conflicts, missingDocuments, lowConfidenceMappings } = useWorkspaceAlerts();
  const [activeTab, setActiveTab] = useState("Profile");
  const [selectedAssessmentIdLocal, setSelectedAssessmentIdLocal] = useState<string | null>(null);
  const [selectedSessionLocal, setSelectedSessionLocal] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [hasSkippedConflicts, setHasSkippedConflicts] = useState(false);

  // Sync activeClientId in context and set initial tab based on client
  React.useEffect(() => {
    setActiveClientId(clientId);
    
    if (clientId === "125566") {
      setActiveTab("Evidence");
    } else if (clientId === "125570") {
      setActiveTab("Analysis");
    } else {
      setActiveTab("Profile");
    }
    setSelectedAssessmentIdLocal(null); // Reset selection on client change
  }, [clientId, setActiveClientId]);

  const clientData = (MOCK_CLIENT_DATA as any)[clientId];
  const clientMeta = MOCK_CLIENTS.find(c => c.id === clientId);
  const status = clientMeta ? deriveClientStatus(clientMeta) : "idle";

  // Workflow locking logic
  const sessionsComplete = (clientData?.sessions?.length || 0) >= 3;
  const assessmentsComplete = (clientData?.assessments?.length || 0) > 0 && clientData?.assessments?.every((a: any) => a.status.toLowerCase() === 'completed');
  const docsComplete = (clientData?.missingDocuments?.length || 0) === 0 && (clientMeta?.missingDocs?.length || 0) === 0;
  
  const isEvidenceLocked = !sessionsComplete || !assessmentsComplete || !docsComplete;
  const isAnalysisLocked = isEvidenceLocked || conflicts.length > 0;

  const group1 = ["Profile", "Sessions", "Assessments", "Documents"];
  const group2 = ["Evidence"];
  const group3 = ["Analysis", "Report"];

  const renderTab = (tab: string) => {
    const isActive = activeTab === tab;
    const badgeCount = tab === "Evidence" ? conflicts.length : tab === "Documents" ? missingDocuments.length : 0;
    
    let isLocked = false;
    let lockReason = "";

    if (tab === "Evidence" && isEvidenceLocked) {
      isLocked = true;
      lockReason = "Complete sessions (3), assessments, and documents to unlock Evidence.";
    }
    if ((tab === "Analysis" || tab === "Report") && isAnalysisLocked) {
      isLocked = true;
      lockReason = conflicts.length > 0 ? "Resolve conflicts in Evidence to unlock Analysis." : "Unlock Evidence first.";
    }

    return (
      <button 
        key={tab}
        onClick={() => !isLocked && handleTabSelect(tab)} 
        title={lockReason}
        style={{
          background: "none", border: "none", padding: "12px 16px", fontSize: 14,
          fontWeight: 600, cursor: isLocked ? "not-allowed" : "pointer", 
          color: isActive ? BRAND : isLocked ? "#cbd5e1" : TEXT_SECONDARY,
          borderBottom: isActive ? `2px solid ${BRAND}` : "2px solid transparent",
          marginBottom: -1, letterSpacing: "0.01em", transition: "all 0.15s",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 8,
          outline: "none",
          position: "relative"
        }}
      >
        {tab}
        {isLocked && (
          <div style={{ position: "absolute", top: 8, right: 4, width: 6, height: 6, borderRadius: "50%", background: "#94a3b8" }} />
        )}
        {badgeCount > 0 && !isLocked && (
          <span style={{
            background: isActive ? BRAND : "#e2e8f0",
            color: isActive ? "white" : TEXT_SECONDARY,
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 7px",
            borderRadius: 10,
            minWidth: 16,
            textAlign: "center"
          }}>
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  const handleTabSelect = (tab: string) => {
    if (tab === "Analysis" && flags.FEATURE_CONFLICT_RESOLUTION_GATE && conflicts.length > 0 && !hasSkippedConflicts) {
      setIsConflictModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const assessments = clientData?.assessments || MOCK_ASSESSMENTS;
  const filtered = assessments.filter((a: any) => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleViewResult = (id?: string) => {
    if (id) {
      setActiveAssessmentId(id);
      setSelectedAssessmentIdLocal(id);
    }
  };

  const alertStrings: { text: string, type: 'conflict' | 'document' | 'mapping', count: number }[] = [];
  if (conflicts.length > 0) alertStrings.push({ text: `${conflicts.length} Conflict${conflicts.length > 1 ? 's' : ''}`, type: 'conflict', count: conflicts.length });
  if (missingDocuments.length > 0) alertStrings.push({ text: `${missingDocuments.length} Missing Doc${missingDocuments.length > 1 ? 's' : ''}`, type: 'document', count: missingDocuments.length });
  if (lowConfidenceMappings.length > 0) alertStrings.push({ text: `${lowConfidenceMappings.length} Low Confidence`, type: 'mapping', count: lowConfidenceMappings.length });

  const alerts = flags.FEATURE_COMPACT_HUD && alertStrings.length > 0 && (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {alertStrings.map((item) => (
        <button 
          key={item.type}
          onClick={() => {
            if (item.type === 'conflict' || item.type === 'mapping') handleTabSelect('Evidence');
            if (item.type === 'document') handleTabSelect('Documents');
          }}
          style={{ 
            background: "white", 
            border: `1px solid ${item.type === 'conflict' ? '#fecaca' : item.type === 'document' ? '#e9eff6' : '#fef3c7'}`, 
            borderRadius: 20, 
            padding: "4px 12px", 
            fontSize: 11, 
            fontWeight: 600, 
            color: item.type === 'conflict' ? '#dc2626' : item.type === 'document' ? '#2563eb' : '#d97706',
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          {item.type === 'conflict' && <AlertTriangle size={12} />}
          {item.type === 'document' && <Info size={12} />}
          {item.type === 'mapping' && <ChevronRight size={12} />}
          {item.text}
        </button>
      ))}
    </div>
  );

  const hideNavigation = !!selectedAssessmentIdLocal || !!selectedSessionLocal;

  return (
    <div style={{ margin: "-32px -60px", minHeight: "100vh", background: "#fcfcfc" }}>
      <ConflictResolutionModal 
        isOpen={isConflictModalOpen} 
        conflicts={conflicts} 
        onResolve={() => {
          setIsConflictModalOpen(false);
          setActiveTab("Evidence");
        }} 
        onSkip={() => {
          setIsConflictModalOpen(false);
          setHasSkippedConflicts(true);
          setActiveTab("Analysis");
        }}
      />
      
      {!hideNavigation && (
        <WorkspaceHeader 
          title={clientMeta?.name || "Client"}
          subtitle={`#${clientMeta?.id || ""}`}
          status={status}
          onBack={onBack}
          alerts={alerts || undefined}
        />
      )}

      <div style={{ padding: "32px 60px" }}>
        {!hideNavigation && (
          <div style={{ marginBottom: 48 }}>
            {!flags.FEATURE_COMPACT_HUD && (
              <WorkspaceStatusBar onNavigate={handleTabSelect} />
            )}

            {useGroupedTabs ? (
              <div style={{ borderBottom: `1px solid #f1f5f9`, display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 0 }}>
                  {group1.map(renderTab)}
                </div>
                <div style={{ color: "#94a3b8", padding: "0 8px", display: "flex", alignItems: "center" }}>
                  <ChevronRight size={18} />
                </div>
                <div style={{ display: "flex", gap: 0 }}>
                  {group2.map(renderTab)}
                </div>
                <div style={{ color: "#94a3b8", padding: "0 8px", display: "flex", alignItems: "center" }}>
                  <ChevronRight size={18} />
                </div>
                <div style={{ display: "flex", gap: 0 }}>
                  {group3.map(renderTab)}
                </div>
              </div>
            ) : (
              <TabBar 
                tabs={[...group1, ...group2, ...group3]} 
                active={activeTab} 
                onSelect={handleTabSelect} 
                badges={{
                  "Evidence": conflicts.length,
                  "Documents": missingDocuments.length
                }}
              />
            )}
          </div>
        )}

        {activeTab === "Profile" ? (
          <ProfileWorkspace />
        ) : activeTab === "Analysis" ? (
          <AnalysisWorkspace 
            onViewProfile={() => setActiveTab("Profile")} 
            onNavigateToAssessments={() => setActiveTab("Assessments")} 
            onNavigateToTab={setActiveTab}
          />
        ) : activeTab === "Evidence" ? (
          <EvidenceWorkspace 
            onViewProfile={() => setActiveTab("Profile")} 
            onNavigateToAssessments={() => setActiveTab("Assessments")} 
            onNavigateToDocuments={() => setActiveTab("Documents")}
          />
        ) : activeTab === "Documents" ? (
          <DocumentsWorkspace />
        ) : activeTab === "Report" ? (
          <ReportWorkspace onNavigateToAssessments={() => setActiveTab("Assessments")} />
        ) : activeTab === "Sessions" ? (
          <SessionListWorkspace 
            selectedSession={selectedSessionLocal}
            onSessionSelect={setSelectedSessionLocal}
            onBack={() => setSelectedSessionLocal(null)}
          />
        ) : activeTab === "Assessments" ? (
          selectedAssessmentIdLocal ? (
            <AssessmentResultScreen 
              clientId={clientId} 
              onBack={() => setSelectedAssessmentIdLocal(null)} 
            />
          ) : (
            <>
              <SectionHeader 
                title="Assessments"
                subtitle="Quick insights into client performance through tailored assessments."
                actions={<button style={primaryBtn}><AddIcon size={18} /> Start New Assessment</button>}
                small={true}
              />
              <div style={cardStyle}>
                <div style={cardContentStyle}>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
                    <div style={{ position: "relative", width: 320 }}>
                      <SearchIcon style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search Assessment"
                        style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 8, fontSize: 14, outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {filtered.length === 0 ? (
                      <EmptyState 
                        icon={SearchIcon}
                        title="No assessments found"
                        description="Try adjusting your search or start a new assessment session."
                        actionLabel="Start New Assessment"
                        onAction={() => console.log('Start new assessment')}
                      />
                    ) : (
                      filtered.map((a, i) => (
                        <AssessmentCard 
                          key={i} 
                          title={a.title} 
                          subtitle={a.subtitle} 
                          status={a.status} 
                          onViewResult={() => handleViewResult(String(i))} 
                          date={(a as any).date} 
                          description={(a as any).description} 
                          notes={(a as any).notes}
                          overallImpression={a.overallImpression}
                          score={a.score}
                          percentile={a.percentile}
                          descriptor={a.descriptor}
                        />
                      ))
                    )}
                  </div>
              </div>
            </div>
            </>
          )
        ) : null}
        <AssessmentCompareSidebar />
        <ClinicalNotesSidebar />
      </div>
    </div>
  );
}

export function AssessmentListScreen(props: { clientId: string, onBack: () => void }) {
  return (
    <WorkspaceAlertsProvider>
      <AssessmentListScreenContent {...props} />
    </WorkspaceAlertsProvider>
  );
}
