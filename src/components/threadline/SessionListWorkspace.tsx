import React, { useState } from "react";
import { 
  Plus as AddIcon, 
  ChevronRight, 
  Play, 
  SkipBack, 
  Volume2, 
  Maximize, 
  Maximize2, 
  Info, 
  X, 
  Copy, 
  Edit3,
  Search,
  FileText,
  Calendar,
  ArrowLeft as BackArrow,
  Download as DownloadIcon
} from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DISABLED, DIVIDER, primaryBtn, BRAND, BRAND_LIGHT, outlineBtn, cardStyle, cardHeaderStyle, cardContentStyle, h1Style, subStyle, TYPE_SCALE } from "./constants";
import { SimpleDropdown } from "../common/UIElements";
import { EmptyState } from "../common/EmptyState";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";

import { MOCK_CLIENT_DATA, MOCK_CLIENTS } from "./mockData";

import { SectionHeader } from "../common/SectionHeader";
import { StatusBadge } from "../common/StatusBadge";
import { EntityCard, TabBar } from "./components";

export function SessionListWorkspace({
  selectedSession,
  onSessionSelect,
  onBack
}: {
  selectedSession: any;
  onSessionSelect: (session: any) => void;
  onBack: () => void;
}) {
  const { flags, activeClientId } = useFeatureFlags();
  const [statusFilter, setStatusFilter] = useState("All Status");

  const clientData = activeClientId ? MOCK_CLIENT_DATA[activeClientId] : null;

  const sessions = clientData?.sessions?.map((s, idx) => ({
    id: `#SESSION-${idx + 1}`,
    timestamp: s.date,
    description: s.focus,
    notes: s.notes
  })) || [];

  if (selectedSession) {
    return <SessionDetail session={selectedSession} onBack={onBack} />;
  }

  return (
    <div style={{ padding: "0 0 64px" }}>
      <SectionHeader 
        title="Session"
        subtitle="Manage telehealth sessions and generate clinical notes seamlessly."
        actions={<button style={primaryBtn}><AddIcon size={18} /> New Session</button>}
        small={true}
      />

      <div style={cardStyle}>
        {/* List container */}
        <div style={cardContentStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
            <SimpleDropdown 
              label="Status"
              value={statusFilter}
              options={["All Status", "Completed", "Scheduled", "Draft"]}
              onChange={setStatusFilter}
              width={200}
            />

            <div style={{ position: "relative", width: 320 }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
              <input 
                type="text" 
                placeholder="Search sessions..." 
                style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }} 
              />
            </div>
          </div>
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {sessions.length === 0 ? (
            <EmptyState 
              icon={Calendar}
              title="No sessions recorded"
              description="This client hasn't had any recorded sessions yet. Start a new session to begin collecting clinical data."
              actionLabel="New Session"
              onAction={() => console.log('New Session')}
              style={{ padding: "100px 24px" }}
            />
          ) : (
            sessions.map((s, i) => (
              <EntityCard
                key={s.id}
                title={s.description || 'Session details'}
                metadata={[
                  { label: "Session ID", value: <span style={{ textTransform: "lowercase" }}>{s.id}</span> },
                  { label: "Date", value: s.timestamp },
                  ...(s.notes ? [{ label: "Session Summary", value: s.notes }] : [])
                ]}
                statusBadge={<StatusBadge status="completed" />}
                rightAction={<ChevronRight size={24} color={TEXT_SECONDARY} />}
                onClick={() => onSessionSelect(s)}
              >
              </EntityCard>
            ))
          )}
        </div>
        
        {/* The dark indicator bar on the right from screenshot */}
        <div style={{ width: 6, background: "#404040", borderRadius: 4, margin: "24px 0" }} />
      </div>
    </div>
    </div>
  );
}

function SessionDetail({ session, onBack }: { session: any, onBack: () => void }) {
  const { activeClientId } = useFeatureFlags();
  const clientMeta = activeClientId ? MOCK_CLIENTS.find(c => c.id === activeClientId) : null;
  const [activeTab, setActiveTab] = useState("Context");

  return (
    <div style={{ padding: "0 0 64px" }}>
      <div style={{ ...cardStyle }}>
        {/* Header */}
        <div style={{ ...cardHeaderStyle, paddingBottom: 24 }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND, fontSize: 13, fontWeight: 600, padding: "0 0 12px", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
              <BackArrow size={16} /> Back to Sessions
            </button>
            <h1 style={{ ...h1Style, fontSize: 24, margin: "0 0 4px 0" }}>
              {session.description || 'Session Details'}
            </h1>
            <p style={{ ...TYPE_SCALE.IdLabel, margin: 0 }}>
              {session.id} • {session.timestamp}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <StatusBadge status="completed" />
              <div style={{ padding: "2px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 4, ...TYPE_SCALE.LabelMicro }}>1 Alert</div>
            </div>
          </div>
          <button style={{ ...primaryBtn, flexShrink: 0 }}><DownloadIcon size={18} /> Download Session Info</button>
        </div>

        <div style={cardContentStyle}>
          {/* Client info banner matching AssessmentResultScreen */}
          <div style={{ background: "#f1f5f9", border: `1px solid #f1f5f9`, borderRadius: 12, display: "flex", flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { label: "Client Name", value: clientMeta?.name || "Maria Santos" },
              { label: "Session Date", value: session.timestamp },
              { label: "Date of Birth", value: "17 Dec 2001 (24y)" },
              { label: "Clinician", value: "Dr. Marcus Thorne" },
              { label: "Duration", value: "45 minutes" },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "16px 24px", minWidth: 160, borderRight: `1px solid #f1f5f9` }}>
                <div style={{ ...TYPE_SCALE.LabelMicro, marginBottom: 4 }}>{label}</div>
                <div style={{ ...TYPE_SCALE.HeadingSmall, fontWeight: 400 }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Left Column: Video & Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Video Player */}
        <div style={{ background: "#d1d5db", borderRadius: 12, overflow: "hidden", position: "relative", aspectRatio: "16/9" }}>
          {/* Video Header */}
          <div style={{ 
            position: "absolute", top: 0, left: 0, right: 0, 
            padding: "12px 20px", background: "rgba(0,0,0,0.1)", 
            display: "flex", justifyContent: "space-between", alignItems: "center",
            color: "white", zIndex: 10
          }}>
            <span style={{ fontSize: 15, fontWeight: 400 }}>{clientMeta?.name || "Client"} #{clientMeta?.id || ""}</span>
            <Info size={16} style={{ opacity: 0.8 }} />
          </div>

          {/* Placeholder for Video */}
          <div style={{ width: "100%", height: "100%", display: "flex", gap: 4 }}>
             <div style={{ flex: 1, background: "#888", position: "relative", overflow: "hidden" }}>
                <img 
                   src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop" 
                   alt="Clinician" 
                   style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
                <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.5)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 2 }}>Play Name</div>
             </div>
             <div style={{ flex: 1, background: "#999", position: "relative", overflow: "hidden" }}>
                <img 
                   src="https://images.unsplash.com/photo-1543132220-3ce99c5ae93c?q=80&w=600&auto=format&fit=crop" 
                   alt="Patient" 
                   style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
                <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.5)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 2 }}>Display Name</div>
             </div>
          </div>

          {/* Centered Play Button overlay */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <div style={{ width: 64, height: 44, background: "rgba(0,0,0,0.7)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                <Play size={24} fill="white" />
             </div>
          </div>

          {/* Video Controls */}
          <div style={{ 
            position: "absolute", bottom: 0, left: 0, right: 0, 
            background: "rgba(0,0,0,0.4)", padding: "8px 16px",
            color: "white"
          }}>
            {/* Progress Bar */}
            <div style={{ height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginBottom: 8, position: "relative" }}>
               <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "35%", background: BRAND }} />
               <div style={{ position: "absolute", left: "35%", top: "50%", width: 12, height: 12, background: BRAND, borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
               <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Play size={18} fill="white" />
                  <SkipBack size={18} />
                  <Volume2 size={18} />
                  <span style={{ fontSize: 12 }}>5:07 / 15:28</span>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, border: "1px solid white", padding: "1px 3px", borderRadius: 2 }}>HD</span>
                  <Maximize size={18} />
               </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div style={{ background: "white", border: `1px solid ${DIVIDER}`, borderRadius: 12, flex: 1, display: "flex", flexDirection: "column", padding: "0" }}>
          <div style={{ padding: "12px 24px 0", borderBottom: `1px solid ${DIVIDER}` }}>
            <TabBar 
              tabs={["Transcript", "Context"]} 
              active={activeTab} 
              onSelect={setActiveTab} 
            />
          </div>

          <div style={{ padding: 24, flex: 1 }}>
            <h2 style={{ ...TYPE_SCALE.HeadingHero, fontSize: 18, margin: "0 0 4px" }}>Context</h2>
            <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: "0 0 24px" }}>Clinician observations and context</p>
            
            <div style={{ fontSize: 15, color: TEXT_PRIMARY, lineHeight: 1.6 }}>
               When clinicians conduct tests, they meticulously document the results to ensure accuracy and clarity. This process involves typing detailed observations, measurements, and any relevant notes that may assist in diagnosis and treatment planning. It's essential for maintaining a comprehensive record that can be referenced in future consultations.
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
             <button style={{ ...outlineBtn, display: "flex", alignItems: "center", gap: 8 }}><Copy size={16} /> Copy</button>
             <button style={{ ...outlineBtn, display: "flex", alignItems: "center", gap: 8 }}><Edit3 size={16} /> Edit</button>
          </div>
        </div>
      </div>

      {/* Right Column: Notes */}
      <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 12, background: "white", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
             <button style={{ ...outlineBtn, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px" }}>
                <Maximize2 size={16} /> Go To Full Screen
             </button>
             <div style={{ marginTop: 24 }}>
                <h1 style={{ ...h1Style, fontSize: 24, margin: 0 }}>Notes</h1>
                <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: 0 }}>Clinical notes and documentation for this session</p>
             </div>
          </div>
          <button style={primaryBtn}><AddIcon size={18} /> Create Note</button>
        </div>

        {/* Note selection chips */}
        <div style={{ borderBottom: `1px solid ${DIVIDER}`, paddingBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
           <div style={{ background: BRAND, color: "white", padding: "6px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              Referral Note <X size={14} />
           </div>
           <div style={{ border: `1px solid ${DIVIDER}`, color: TEXT_PRIMARY, padding: "6px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              Progress note <X size={14} />
           </div>
           <div style={{ border: `1px solid ${DIVIDER}`, color: TEXT_PRIMARY, padding: "6px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              Risk Assessment <X size={14} />
           </div>
        </div>

        {/* Note Content Area */}
        <div style={{ 
          border: `1px solid ${DIVIDER}`, 
          borderRadius: 8, 
          flex: 1, 
          padding: 24, 
          position: "relative",
          overflowY: "auto"
        }}>
           <h3 style={{ ...TYPE_SCALE.HeadingHero, fontSize: 16, marginBottom: 16 }}>Referral Note</h3>
           
           <div style={{ display: "flex", flexDirection: "column", gap: 12, ...TYPE_SCALE.BodyStandard }}>
              <p><strong>Patient Name:</strong> Maria Santos</p>
              <p><strong>Date:</strong> January 15, 2025</p>
              
              <div style={{ marginTop: 8 }}>
                 <p><strong>Reason For Referral:</strong></p>
                 <p style={{ opacity: 0.8 }}>The Patient Is Being Referred For Further Evaluation Due To Persistent Lower Back Pain That Has Not Improved With Initial Management.</p>
              </div>

              <div style={{ marginTop: 8 }}>
                 <p><strong>Summary:</strong></p>
                 <p style={{ opacity: 0.8 }}>Maria Reports Ongoing Pain For 3 Weeks, Rated 6/10. No Red Flags Noted. Basic Assessment Completed, And Initial Interventions Provided. Further Assessment By A Specialist Is Recommended.</p>
              </div>

              <div style={{ marginTop: 8 }}>
                 <p><strong>Referred To:</strong></p>
                 <p style={{ opacity: 0.8 }}>Dr. John Reyes – Orthopedic Specialist</p>
              </div>

              <div style={{ marginTop: 8 }}>
                 <p><strong>Referred By:</strong></p>
                 <p style={{ opacity: 0.8 }}>Nurse Practitioner Anna Dela Cruz</p>
              </div>
           </div>

           {/* Custom scrollbar indicator */}
           <div style={{ position: "absolute", top: 8, bottom: 8, right: 8, width: 4, background: "rgba(0,0,0,0.5)", borderRadius: 2 }} />
        </div>

        {/* Note Footer buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
           <button style={{ ...outlineBtn, padding: "8px 32px" }}>Reset</button>
           <button style={{ ...primaryBtn, padding: "8px 32px" }}>Save</button>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}
