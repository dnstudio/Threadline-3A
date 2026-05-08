import React, { useState } from "react";
import { 
  Search,
  ChevronRight,
  ChevronDown,
  Plus
} from "lucide-react";
import { DIVIDER, TYPE_SCALE, TEXT_PRIMARY, TEXT_SECONDARY, h1Style, subStyle } from "./constants";
import { ClinicianTag } from "./components";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { Button, Card, Badge } from "./ui";

export function MainSessionListWorkspace() {
  const [search, setSearch] = useState("");

  const allSessions = MOCK_CLIENTS.flatMap(client => {
    const clientData = MOCK_CLIENT_DATA[client.id] || { sessions: [] };
    return clientData.sessions.map(session => ({
      ...session,
      clientName: client.name,
      clientId: client.id,
      clinicians: client.clinicians
    }));
  });

  const filtered = allSessions.filter(s => 
    s.clientName.toLowerCase().includes(search.toLowerCase()) || 
    s.focus.toLowerCase().includes(search.toLowerCase()) ||
    s.clinicians.some(cl => cl.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "32px 0 64px" }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={h1Style}>Sessions</h1>
          <p style={subStyle}>Monitor and manage all client sessions in one place.</p>
        </div>
        <Button icon={<Plus size={18} />}>New Session</Button>
      </div>

      <Card noPadding>
        {/* Table Controls (Search) */}
        <div style={{ display: 'flex', justifyContent: "flex-end", padding: "20px 24px" }}>
          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input 
              type="text" 
              placeholder="Search by Clients, Clinicians, or Focus" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }} 
            />
          </div>
        </div>

        {/* Table Body */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.2fr 1fr 0.6fr", padding: "16px 24px", borderBottom: `1px solid ${DIVIDER}`, background: '#f9fafb', fontSize: 13, fontWeight: 600, color: TEXT_SECONDARY }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Session Focus <ChevronDown size={14} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Client</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Clinicians</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Session Date <ChevronDown size={14} /></div>
            <div style={{ textAlign: 'right' }}>Action</div>
          </div>

          {filtered.map((session, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.2fr 1fr 0.6fr", padding: "24px", borderBottom: i < filtered.length - 1 ? `1px solid ${DIVIDER}` : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{session.focus}</div>
                <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>ID: {session.id}</div>
              </div>
              <div>
                <div style={{ color: TEXT_PRIMARY, fontWeight: 500, fontSize: 14 }}>{session.clientName}</div>
                <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>#{session.clientId}</div>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: 'wrap' }}>
                {session.clinicians.map((clinician, idx) => (
                  <ClinicianTag key={idx} name={clinician} />
                ))}
              </div>
              <div style={{ ...TYPE_SCALE.BodyStandard }}>
                <div style={{ fontWeight: 500 }}>{session.date}</div>
                <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <button style={{ color: "#4caf50", background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Footer */}
        <div style={{ padding: "20px 24px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, fontSize: 13, color: TEXT_SECONDARY }}>
            <div>Rows per page: <span style={{ color: TEXT_PRIMARY, fontWeight: 500 }}>10</span> <ChevronDown size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></div>
            <div style={{ color: TEXT_PRIMARY }}>1-10 of 13</div>
            <div style={{ display: 'flex', gap: 16 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SECONDARY }} disabled>{"<"}</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SECONDARY }}>{">"}</button>
            </div>
        </div>
      </Card>
    </div>
  );
}
