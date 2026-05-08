/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COLORS, ICON_PATHS } from "../constants";
import { Icon } from "./common/UIElements";
import { Search } from "lucide-react";

interface NavbarProps {
  onClientsClick?: () => void;
  onPatientsClick?: () => void;
  onSessionsClick?: () => void;
  onAssessmentsClick?: () => void;
  onResourcesClick?: () => void;
  onUsersClick?: () => void;
  onConditionsClick?: () => void;
  onAvatarClick?: () => void;
  activeItem?: string;
  isAdminView?: boolean;
}

export function Navbar({ 
  onClientsClick, 
  onPatientsClick, 
  onSessionsClick, 
  onAssessmentsClick,
  onResourcesClick, 
  onUsersClick, 
  onConditionsClick, 
  onAvatarClick, 
  activeItem = "Conditions", 
  isAdminView = false 
}: NavbarProps) {
  const navItems = ["Sessions", "Assessments"];
  if (isAdminView) {
    navItems.push("Conditions", "Users");
  }

  return (
    <div style={{
      borderBottom: `1px solid ${COLORS.DIV}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 60px",
      marginBottom: 0,
      background: "white",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: 8, background: COLORS.P, 
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 18
          }}>T</div>
          <span style={{ fontFamily: "'Frank Ruhl Libre',serif", fontSize: 20, fontWeight: 700, color: COLORS.TP, letterSpacing: "-0.02em" }}>Threadline</span>
        </div>

        <div style={{ width: 1, height: 24, background: COLORS.DIV }} />
        
        <button 
          onClick={onClientsClick}
          style={{
            background: activeItem === "Clients" ? COLORS.PL : "transparent",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "'Poppins',sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.P,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s"
          }}
        >
          Client Workspace
        </button>

      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.TS }} />
          <input 
            type="text"
            placeholder="Search clients, assessments, or notes..."
            style={{
              padding: "7px 12px 7px 36px",
              borderRadius: 8,
              border: `1px solid ${COLORS.DIV}`,
              fontSize: 13,
              fontFamily: "'Poppins',sans-serif",
              width: 260,
              outline: "none",
              background: "#f8fafc",
              transition: "border-color 0.2s"
            }}
          />
        </div>
        <div style={{ width: 1, height: 24, background: COLORS.DIV }} />
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(item => (
            <button 
              key={item} 
              onClick={() => {
                if (item === "Patients" && onPatientsClick) onPatientsClick();
                if (item === "Sessions" && onSessionsClick) onSessionsClick();
                if (item === "Assessments" && onAssessmentsClick) onAssessmentsClick();
                if (item === "Resources" && onResourcesClick) onResourcesClick();
                if (item === "Users" && onUsersClick) onUsersClick();
                if (item === "Conditions" && onConditionsClick) onConditionsClick();
              }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 12px", borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                fontSize: 13, fontWeight: item === activeItem ? 600 : 500,
                color: item === activeItem ? COLORS.P : COLORS.TS,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center"
              }}
            >
              {item}
            </button>
          ))}
        </div>
        
        <div 
          onClick={onAvatarClick}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            paddingLeft: 24, 
            borderLeft: `1px solid ${COLORS.DIV}`,
            cursor: onAvatarClick ? "pointer" : "default"
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.TP }}>Dr. O. P.</div>
            <div style={{ fontSize: 11, color: COLORS.TS }}>Clinician</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: COLORS.AVATAR_BG || "#e4e0dc",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: COLORS.P, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
            border: `2px solid white`,
            boxShadow: "0 0 0 1px #e2e8f0"
          }}>OP</div>
        </div>
      </div>
    </div>
  );
}
