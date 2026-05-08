import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, primaryBtn, cardStyle, cardContentStyle, h1Style, subStyle } from "./constants";
import { SimpleDropdown } from "../common/UIElements";

export function UsersWorkspace() {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const users = [
    { name: "Dr. Olivia Porter", role: "Admin", email: "olivia.porter@threadline.com", lastActive: "Just now" },
    { name: "Dr. James Wilson", role: "Clinician", email: "james.wilson@threadline.com", lastActive: "2 hours ago" },
    { name: "Sara Miller", role: "Clinician", email: "sara.miller@threadline.com", lastActive: "5 hours ago" },
    { name: "Michael Davies", role: "Coordinator", email: "michael.davies@threadline.com", lastActive: "Yesterday" },
    { name: "Jessica Thompson", role: "Clinician", email: "jessica.thompson@threadline.com", lastActive: "Yesterday" },
  ];

  return (
    <div style={{ padding: "32px 0 64px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={h1Style}>Users</h1>
          <p style={subStyle}>Manage users and permissions within your organization.</p>
        </div>
        <button style={primaryBtn}>
          <Plus size={16} /> Invite User
        </button>
      </div>

      <div style={cardStyle}>
        <div style={cardContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <SimpleDropdown 
               label="Role" 
               value={roleFilter} 
               options={["All Roles", "Admin", "Clinician", "Coordinator"]} 
               onChange={setRoleFilter} 
            />
          </div>

          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input 
              type="text" 
              placeholder="Search by Name or Email" 
              style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }} 
            />
          </div>
        </div>

        <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: `1px solid ${DIVIDER}` }}>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Name</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Role</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Email</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Last Active</th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: 14, fontWeight: 600, color: TEXT_SECONDARY }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx} style={{ borderBottom: idx < users.length - 1 ? `1px solid ${DIVIDER}` : "none" }} className="hover:bg-gray-50">
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}>{u.name}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: TEXT_SECONDARY }}>{u.role}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: TEXT_SECONDARY }}>{u.email}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: TEXT_SECONDARY }}>{u.lastActive}</td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, fontSize: 13, color: TEXT_SECONDARY }}>
          <div>Rows per page: 10</div>
          <div>1-5 of 5</div>
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
