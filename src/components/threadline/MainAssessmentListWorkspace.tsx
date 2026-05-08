import React, { useState } from "react";
import { 
  Search,
  ChevronDown,
  ClipboardCheck
} from "lucide-react";
import { DIVIDER, TYPE_SCALE, TEXT_PRIMARY, TEXT_SECONDARY, h1Style, subStyle } from "./constants";
import { ClinicianTag } from "./components";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { Button, Card, Badge, Typography } from "./ui";

export function MainAssessmentListWorkspace() {
  const [search, setSearch] = useState("");

  const allAssessments = MOCK_CLIENTS.flatMap(client => {
    const clientData = MOCK_CLIENT_DATA[client.id] || { assessments: [] };
    return clientData.assessments.map(assessment => ({
      ...assessment,
      clientName: client.name,
      clientId: client.id,
      leadClinician: client.clinicians[0]
    }));
  });

  const filtered = allAssessments.filter(a => 
    a.clientName.toLowerCase().includes(search.toLowerCase()) || 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.leadClinician.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 0 64px" }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={h1Style}>Assessments</h1>
          <p style={subStyle}>Track and manage diagnostic assessments for all clients.</p>
        </div>
        <Button icon={<ClipboardCheck size={18} />}>Start New Assessment</Button>
      </div>

      <Card noPadding>
        {/* Table Controls (Search) */}
        <div style={{ display: 'flex', justifyContent: "flex-end", padding: "20px 24px" }}>
          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input 
              type="text" 
              placeholder="Search by Clients, Clinicians, or Assessments" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }} 
            />
          </div>
        </div>

        {/* Table Body */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.8fr 1fr 0.6fr", padding: "16px 24px", borderBottom: `1px solid ${DIVIDER}`, background: '#f9fafb', fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Assessment Title <ChevronDown size={14} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Client</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Lead Clinician</div>
            <div style={{ textAlign: 'right' }}>Action</div>
          </div>

          {filtered.map((assessment, i) => {
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.8fr 1fr 0.6fr", padding: "24px", borderBottom: i < filtered.length - 1 ? `1px solid ${DIVIDER}` : "none", alignItems: "center" }}>
                <div>
                  <div style={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: 14 }}>{assessment.title}</div>
                  {assessment.date && (
                    <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 }}>{assessment.date}</div>
                  )}
                </div>
                <div>
                  <div style={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: 14 }}>{assessment.clientName}</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>#{assessment.clientId}</div>
                </div>
                <div>
                  <Badge status={assessment.status.toLowerCase() as any} />
                </div>
                <div style={{ display: "flex", gap: 8, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ClinicianTag name={assessment.leadClinician} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <button style={{ color: "#4caf50", background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Manage</button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Pagination Footer */}
        <div style={{ padding: "20px 24px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, fontSize: 13, color: TEXT_SECONDARY }}>
            <div>Rows per page: <span style={{ color: TEXT_PRIMARY, fontWeight: 500 }}>10</span> <ChevronDown size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></div>
            <div style={{ color: TEXT_PRIMARY }}>1-10 of {filtered.length}</div>
            <div style={{ display: 'flex', gap: 16 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SECONDARY }} disabled>{"<"}</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SECONDARY }}>{">"}</button>
            </div>
        </div>
      </Card>
    </div>
  );
}
