import React, { useState } from "react";
import { Search, Plus, MoreVertical, ChevronDown } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, primaryBtn, cardStyle, cardHeaderStyle, cardContentStyle, h1Style, subStyle, TYPE_SCALE } from "./constants";
import { SimpleDropdown } from "../common/UIElements";

export function PatientListWorkspace() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const patients = [
    { name: "Lean Echo", initials: "LE", sessions: 2, email: "lean.echo@example.com", phone: "+61 412 345 678", status: "active", lastUpdated: "15 Jan 2026" },
    { name: "Thin Whisper", initials: "TW", sessions: 2, email: "thin.whisper@example.com", phone: "+61 423 456 789", status: "active", lastUpdated: "22 Feb 2026" },
    { name: "Slim Shadow", initials: "SS", sessions: 2, email: "slim.shadow@example.com", phone: "+61 434 567 890", status: "inactive", lastUpdated: "10 Mar 2026" },
    { name: "Narrow Breeze", initials: "NB", sessions: 2, email: "narrow.breeze@example.com", phone: "+61 467 890 123", status: "inactive", lastUpdated: "5 Apr 2026" },
    { name: "Sleek Mirage", initials: "SM", sessions: 2, email: "sleek.mirage@example.com", phone: "+61 445 678 901", status: "active", lastUpdated: "18 May 2026" },
    { name: "Faint Glimmer", initials: "FG", sessions: 2, email: "faint.glimmer@example.com", phone: "+61 456 789 012", status: "active", lastUpdated: "30 Jun 2026" },
    { name: "Delicate Trace", initials: "DT", sessions: 2, email: "delicate.trace@example.com", phone: "+61 478 901 234", status: "inactive", lastUpdated: "12 Jul 2026" },
    { name: "Anorexia Nervosa", initials: "AN", sessions: 2, email: "anorexia.nervosa@example.com", phone: "+61 489 012 345", status: "active", lastUpdated: "28 Aug 2026" },
  ];

  return (
    <div style={{ padding: "32px 0 64px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={h1Style}>Patients</h1>
          <p style={subStyle}>Manage your patient registry and session history.</p>
        </div>
        <button style={primaryBtn}>
          <Plus size={16} /> Add Patient
        </button>
      </div>

      <div style={cardStyle}>
        <div style={cardContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
          <SimpleDropdown 
            label="Status"
            value={statusFilter}
            options={["All Status", "Active", "Inactive"]}
            onChange={setStatusFilter}
            width={200}
          />
          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input 
              type="text" 
              placeholder="Search by Name, Email, Phone" 
              style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }} 
            />
          </div>
        </div>

        <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: `1px solid ${DIVIDER}` }}>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Patient Name</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Email</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Phone</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Status</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Last Updated</th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: idx < patients.length - 1 ? `1px solid ${DIVIDER}` : "none" }} className="hover:bg-gray-50">
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#111827", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13 }}>
                        {p.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{p.name}</div>
                        <div style={{ ...TYPE_SCALE.LabelMicro }}>{p.sessions} sessions</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: TEXT_SECONDARY }}>{p.email}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: TEXT_SECONDARY }}>{p.phone}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ 
                      display: "inline-block", borderRadius: 20, fontSize: 12, fontWeight: 500,
                      background: p.status === 'active' ? '#f0fdf4' : '#fef2f2',
                      color: p.status === 'active' ? '#166534' : '#991b1b',
                      padding: "4px 12px",
                      border: `1px solid ${p.status === 'active' ? '#dcfce7' : '#fee2e2'}`
                    }}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: TEXT_SECONDARY }}>{p.lastUpdated}</td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, fontSize: 13, color: TEXT_SECONDARY }}>
          <div>Rows per page: 10</div>
          <div>1-13 of 13</div>
          <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>&lt;</button>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
