import React, { useState, useRef } from "react";
import { Search, Filter, Plus, MoreVertical, ChevronDown, ChevronUp, Cpu, CheckCircle, FileText } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, primaryBtn, outlineBtn, h1Style, subStyle, cardStyle, cardContentStyle, TYPE_SCALE } from "./constants";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { DocumentCompletenessModal } from "../modals/DocumentCompletenessModal";
import { StatusBadge } from "../common/StatusBadge";
import { EmptyState } from "../common/EmptyState";
import { SectionHeader } from "../common/SectionHeader";
import { EntityCard } from "./components";

import { REQUIRED_DOCUMENTS, MOCK_DOCUMENTS as fallbackDocuments, MOCK_CLIENT_DATA } from "./mockData";

// Helper to map document names to types for the demo
const mapDocNameToType = (name: string): string => {
  if (name.toLowerCase().includes('letter')) return 'referral-letter';
  if (name.toLowerCase().includes('questionnaire')) return 'parent-questionnaire';
  if (name.toLowerCase().includes('school')) return 'school-report';
  return 'other';
};

export function DocumentsWorkspace() {
  const { flags, activeClientId } = useFeatureFlags();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const clientData = activeClientId ? (MOCK_CLIENT_DATA as any)[activeClientId] : null;
  const documents = clientData?.documents || fallbackDocuments;

  const handleStartAnalysis = () => {
    if (!flags.FEATURE_DOCUMENT_COMPLETENESS_GATE) {
      triggerAIProcessing();
      return;
    }

    const currentDocTypes = documents.map((d: any) => mapDocNameToType(d.name));
    const notFound = REQUIRED_DOCUMENTS.filter(req => !currentDocTypes.includes(req));

    if (notFound.length > 0) {
      setMissingDocs(notFound);
      setIsModalOpen(true);
    } else {
      triggerAIProcessing();
    }
  };

  const triggerAIProcessing = (acknowledged = false) => {
    if (acknowledged) {
      // SCOPE NOTE: Log to audit state
      console.info("AUDIT LOG:", {
        timestamp: new Date().toISOString(),
        missingDocuments: missingDocs,
        clinicianAcknowledged: true,
        action: "PROCEED_WITH_MISSING_DOCUMENTS"
      });
    }

    setIsProcessing(true);
    setIsModalOpen(false);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessVisible(true);
      setTimeout(() => setIsSuccessVisible(false), 3000);
    }, 2000);
  };

  const handleUploadNow = () => {
    setIsModalOpen(false);
    // Focus search or simulation focus of upload area
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const TableHeader = ({ label, icon: Icon }: { label: string; icon?: React.ElementType }) => (
    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {label}
        {Icon && <Icon size={16} style={{ color: "#9ca3af" }} />}
      </div>
    </th>
  );

  return (
    <div style={{ padding: "0 0 64px" }}>
      <DocumentCompletenessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        missingDocuments={missingDocs}
        onProceed={() => triggerAIProcessing(true)}
        onUploadNow={handleUploadNow}
      />

      {/* Success Notification */}
      {isSuccessVisible && (
        <div style={{
          position: "fixed", top: 80, right: 32, background: "#ecfdf5", 
          border: "1px solid #10b981", color: "#065f46", padding: "12px 24px",
          borderRadius: 8, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 12, zIndex: 1000
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>AI Analysis initialized successfully</span>
        </div>
      )}

      <SectionHeader 
        title="Documents"
        subtitle="View, upload, and manage assessment reports, letters, and clinical documents."
        small={true}
        actions={
          <>
            {!flags.FEATURE_SINGLE_HYPOTHESIS && (
              <button 
                onClick={handleStartAnalysis}
                disabled={isProcessing}
                style={{ 
                  ...primaryBtn, 
                  background: "#06302c", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  opacity: isProcessing ? 0.7 : 1,
                  cursor: isProcessing ? "not-allowed" : "pointer"
                }}
              >
                <Cpu size={16} className={isProcessing ? "animate-spin" : ""} /> 
                {isProcessing ? "Processing..." : "Run AI Analysis"}
              </button>
            )}
            <button style={primaryBtn}>
              <Plus size={16} /> Add File
            </button>
          </>
        }
      />

      <div style={cardStyle}>
        <div style={cardContentStyle}>
          <div style={{ paddingBottom: 24, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <button style={{ ...outlineBtn, display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={16} /> Filter
            </button>
            <div style={{ position: "relative", width: 320 }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search Document" 
                style={{ width: "100%", padding: "10px 16px 10px 40px", border: `1px solid ${DIVIDER}`, borderRadius: 8, fontSize: 14, outline: "none" }} 
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, minHeight: 400 }}>
            {documents.length === 0 ? (
              <EmptyState 
                icon={FileText}
                title="No documents found"
                description="This client has no documents uploaded yet. Upload assessment reports or clinical notes to get started."
                actionLabel="Upload File"
                onAction={() => console.log('Upload File')}
              />
            ) : (
              documents.map((doc, idx) => (
                <EntityCard
                  key={idx}
                  title={doc.name}
                  statusBadge={<StatusBadge status={doc.status.toLowerCase() as any} />}
                  metadata={
                    doc.status.toLowerCase() === 'uploaded' ? [
                      ...(doc.type ? [{ label: "Type", value: doc.type }] : []),
                      ...(doc.creationDate && doc.creationDate !== '-' && doc.creationDate !== 'TBD' ? [{ label: "Creation Date", value: doc.creationDate }] : []),
                      ...(doc.uploadDate && doc.uploadDate !== '-' ? [{ label: "Upload Date", value: doc.uploadDate }] : [])
                    ] : []
                  }
                  summary={doc.status.toLowerCase() !== 'uploaded' ? doc.description : undefined}
                  rightAction={
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 8 }}>
                      <MoreVertical size={20} />
                    </button>
                  }
                  onClick={() => {}}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
