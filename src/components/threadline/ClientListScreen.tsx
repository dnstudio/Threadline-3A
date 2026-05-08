import React, { useState } from "react";
import { Search, Plus as AddIcon, ChevronDown } from "lucide-react";
import { DIVIDER, TYPE_SCALE, TEXT_SECONDARY, TEXT_PRIMARY, TEXT_DISABLED } from "./constants";
import { ClinicianTag } from "./components";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { SimpleDropdown } from "../common/UIElements";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { Button, Badge, Card, Typography } from "./ui";

export type ClientStatus = any;

export function deriveClientStatus(client: any): ClientStatus {
  const data = MOCK_CLIENT_DATA[client.id];
  if (!data) return 'idle';

  // Check for NEW status: no sessions and no assessments completed/in-progress
  if ((!data.sessions || data.sessions.length === 0) && 
      (!data.assessments || data.assessments.every(a => a.status.toLowerCase() === 'not-started'))) {
    return 'new';
  }

  if (!client.consent || (client.missingDocs && client.missingDocs.length > 0)) return 'missing-documents';
  
  if (client.hasConflicts) return 'conflicts-unresolved';

  const hasInProgress = data.assessments?.some(a => a.status.toLowerCase() === 'in-progress');
  if (hasInProgress) return 'in-progress';

  const allCompleted = data.assessments?.length > 0 && data.assessments.every(a => a.status.toLowerCase() === 'completed');
  if (allCompleted) return 'ready';

  return 'idle';
}

export function ClientListScreen({ onSelectClient }: { onSelectClient: (id: string) => void }) {
  const { flags } = useFeatureFlags();
  const [search, setSearch] = useState("");
  const [clinicianFilter, setClinicianFilter] = useState("All Clinicians");
  const clients = MOCK_CLIENTS;

  return (
    <div style={{ padding: "32px 0 64px" }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Typography variant="h1">Clients</Typography>
          <Typography variant="sub">Manage your diagnostic registry and client relationships.</Typography>
        </div>
        <Button icon={<AddIcon size={18} />}>Add Client</Button>
      </div>

      <Card noPadding>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 0, padding: '24px 32px', borderBottom: `1px solid ${DIVIDER}` }}>
          <SimpleDropdown 
            label="Clinician"
            value={clinicianFilter}
            options={["All Clinicians", "James Wilson", "Sara Miller", "Olivia Porter"]}
            onChange={setClinicianFilter}
            width={200}
          />

          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input 
              placeholder="Search by name, Referred, or Id" 
              style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: `1px solid ${DIVIDER}` }}>
              {[
                { l: "Name", w: "18%" },
                { l: "Status", w: "12%" },
                { l: "External ID", w: "10%" },
                { l: "Clinicians", w: "18%" },
                { l: "Referred By", w: "15%" },
                { l: "Last Session", w: "15%" },
                { l: "Consent Obtained", w: "9%" },
                { l: "Action", w: "3%" }
              ].map(h => (
                <th key={h.l} style={{ 
                  padding: "16px", textAlign: "left", fontSize: 13, fontWeight: 700, 
                  color: TEXT_SECONDARY, width: h.w,
                  textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {h.l}
                    {h.l !== "Clinicians" && h.l !== "Action" && <ChevronDown size={14} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => {
              const status = deriveClientStatus(c);
              
              return (
                <tr key={i} style={{ borderBottom: i < clients.length - 1 ? `1px solid ${DIVIDER}` : "none", transition: "background 0.2s" }} className="hover:bg-gray-50">
                  <td style={{ padding: "16px" }}>
                    <div 
                      onClick={() => onSelectClient(c.id)}
                      style={{ ...TYPE_SCALE.BodyStandard, fontWeight: 600, cursor: "pointer", marginBottom: 2 }}
                    >
                      {c.name}
                    </div>
                    <Typography variant="IdLabel">ID: #{c.id}</Typography>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {status !== 'idle' ? <Badge status={status} /> : <span style={{ color: TEXT_DISABLED, fontSize: 13 }}>—</span>}
                  </td>
                  <td style={{ padding: "16px", fontSize: 14, color: TEXT_SECONDARY }}>{c.extId}</td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {c.clinicians.map((cl, idx) => <ClinicianTag key={idx} name={cl} />)}
                    </div>
                    {c.extra > 0 && <div style={{ ...TYPE_SCALE.LabelMicro, marginTop: 4 }}>+{c.extra} more</div>}
                  </td>
                  <td style={{ padding: "16px", fontSize: 14, color: TEXT_SECONDARY }}>{c.ref}</td>
                  <td style={{ padding: "16px", fontSize: 14, color: TEXT_SECONDARY }}>{c.last}</td>
                  <td style={{ padding: "16px" }}>
                    <Badge status={c.consent ? 'completed' : 'missing'} label={c.consent ? "Yes" : "No"} />
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ padding: 24, borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>Rows per page: <span style={{ fontWeight: 500, color: TEXT_PRIMARY }}>10</span> <ChevronDown size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></div>
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: TEXT_PRIMARY }}>
              <span>1-5 of 13</span>
              <div style={{ display: "flex", gap: 16, color: TEXT_SECONDARY }}>
                 <button style={{ background: "none", border: "none", cursor: "pointer" }}>{"<"}</button>
                 <button style={{ background: "none", border: "none", cursor: "pointer" }}>{">"}</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
