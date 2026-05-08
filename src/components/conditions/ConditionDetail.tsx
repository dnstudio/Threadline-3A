/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS, TABS } from "../../constants";
import { 
  BRAND, cardStyle, h1Style, subStyle, primaryBtn 
} from "../threadline/constants";

import { Icon, StatusChip, GlChip, SimpleDropdown } from "../common/UIElements";
import { Condition } from "../../types";
import { OverviewTab } from "./detail/OverviewTab";
import { GuidelinesTab } from "./detail/GuidelinesTab";
import { DecisionUnitsTab } from "./detail/DecisionUnitsTab";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function ConditionDetail({ row, onBack }: { row: Condition; onBack: () => void, key?: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState(row.status);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      style={{ padding: "32px 0 64px" }}
    >
      {/* Breadcrumbs Navigation */}
      <nav style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 28 }}>
        {[{ label: "Conditions", click: onBack }, { label: row.name.length > 38 ? row.name.slice(0, 38) + "…" : row.name }, { label: TABS[activeTab] }].map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {i > 0 && <span style={{ color: COLORS.TS, fontSize: 16, margin: "0 4px" }}>/</span>}
            <span onClick={crumb.click} style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP, cursor: crumb.click ? "pointer" : "default", textDecoration: crumb.click ? "underline" : "none", textDecorationColor: "rgba(0,0,0,.3)" }}>{crumb.label}</span>
          </span>
        ))}
      </nav>

      <div style={{ borderBottom: `1px solid ${COLORS.DIV}`, display: "flex", marginBottom: 16 }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: .4, color: i === activeTab ? COLORS.P : COLORS.TS, borderBottom: i === activeTab ? `2px solid ${COLORS.P}` : "2px solid transparent", marginBottom: -1, transition: "color .15s" }}>{tab}</button>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <h1 style={{ ...h1Style, flex: 1, marginRight: 24 }}>{row.name}</h1>
            <SimpleDropdown label="Status" value={status} width={200} options={["Approved", "In Review", "Deprecated", "Draft"]} onChange={setStatus} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[row.category, row.guideline].map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.TS }} />}
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP }}>{item}</span>
              </span>
            ))}
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.TS }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP }}>Last updated: {row.updated}</span>
          </div>
          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TP }}>Status</span>
              <StatusChip status={status} center />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TP }}>Guideline</span>
              <GlChip label={row.code} />
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: COLORS.DIV }} />
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
            {activeTab === 0 && <OverviewTab row={row} />}
            {activeTab === 1 && <GuidelinesTab row={row} />}
            {activeTab === 2 && <DecisionUnitsTab row={row} />}
            {activeTab === 3 && <div style={{ padding: 48, textAlign: "center", color: COLORS.TS, fontFamily: "'Poppins',sans-serif", fontSize: 15 }}>This tab is not yet implemented.</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
