/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, Fragment, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS } from "../../../constants";
import { Icon, DUChip, Toggle } from "../../common/UIElements";
import { TableFooter } from "../../common/TableFooter";
import { CoverageSidebar } from "./CoverageSidebar";
import { AddUnitModal } from "./AddUnitModal";
import { Condition, DecisionUnit } from "../../../types";
import { getDUs } from "../../../services/dataService";

export function DecisionUnitsTab({ row }: { row: Condition }) {
  const [units, setUnits] = useState<DecisionUnit[]>(() => getDUs(row));
  const [sf, setSf] = useState<keyof DecisionUnit>("lastUpdated");
  const [sd, setSd] = useState("desc");

  const onAddUnit = (unit: Partial<DecisionUnit>) => {
    const newUnit: DecisionUnit = {
      id: Math.max(...units.map(u => u.id), 0) + 1,
      type: unit.type || "Diagnostic Rule",
      status: "Draft",
      group: unit.group || "New Group",
      logic: unit.logic || "New logic defined",
      pop: unit.pop || "Both",
      source: unit.source || row.guideline,
      ok: false,
      createdBy: "Current User",
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + " – " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      version: "V.10",
      ...unit
    };
    setUnits([newUnit, ...units]);
    setModalOpen(false);
  };
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [exp, setExp] = useState<Record<string, boolean>>({});
  const [jsonMode, setJsonMode] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | undefined>(undefined);

  const handleOpenModal = (ruleType?: string) => {
    setSelectedDimension(ruleType);
    setModalOpen(true);
  };

  const sort = (f: keyof DecisionUnit) => {
    if (sf === f) setSd(d => d === "asc" ? "desc" : "asc");
    else { setSf(f); setSd("asc"); }
  };

  const sorted = useMemo(() => 
    [...units].sort((a, b) => {
      if (sf === "lastUpdated") {
        const d1 = new Date(a.lastUpdated.replace('–', '')).getTime();
        const d2 = new Date(b.lastUpdated.replace('–', '')).getTime();
        return sd === "asc" ? d1 - d2 : d2 - d1;
      }
      return sd === "asc" 
        ? String(a[sf]).localeCompare(String(b[sf])) 
        : String(b[sf]).localeCompare(String(a[sf]));
    }), [units, sf, sd]);

  const paged = sorted.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(sorted.length / rpp);
  const s = page * rpp + 1;
  const e = Math.min((page + 1) * rpp, sorted.length);

  const TH = ({ children, field, w }: { children: ReactNode; field?: keyof DecisionUnit; w: number }) => (
    <th onClick={() => field && sort(field)} style={{
      width: w, minWidth: w, padding: "0 16px", height: 56, textAlign: "left", fontFamily: "'Poppins',sans-serif",
      fontWeight: 500, fontSize: 13, color: COLORS.TP, letterSpacing: .17, cursor: field ? "pointer" : "default",
      background: "rgba(140,145,164,0.05)", borderBottom: `1px solid ${COLORS.DIV}`, userSelect: "none", whiteSpace: "nowrap"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {children}
        {field && <Icon d={sd === "asc" ? ICON_PATHS.sortD : ICON_PATHS.sortU} size={14} color={sf === field ? COLORS.P : "rgba(0,0,0,0.3)"} />}
      </div>
    </th>
  );

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.TP, lineHeight: 1.334 }}>Decision Units</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => handleOpenModal()}
            style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.P, color: "white", border: "none", borderRadius: 4, padding: "8px 20px", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 500, letterSpacing: ".46px", boxShadow: "0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 1px 5px rgba(0,0,0,.12)" }}>
            <Icon d={ICON_PATHS.add} size={18} color="white" />Add Decision Unit
          </button>
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid rgba(6,48,44,0.5)`, borderRadius: 4, background: "white", color: COLORS.P, padding: "8px 20px", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 500, letterSpacing: ".46px" }}>
            <Icon d={ICON_PATHS.grid} size={18} color={COLORS.P} />Coverage and Validation
          </button>
        </div>
      </div>
      <div style={{ border: `1px solid rgba(21,21,21,0.12)`, borderRadius: 8, overflow: "hidden", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 230 }} /><col style={{ width: 120 }} /><col style={{ width: 140 }} /><col /><col style={{ width: 90 }} /><col style={{ width: 180 }} /><col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <TH field="type" w={230}>Unit Type</TH>
              <TH field="status" w={120}>Status</TH>
              <TH field="group" w={140}>Rule Group</TH>
              <TH field="logic" w={200}>Logic Summary</TH>
              <TH field="pop" w={90}>Population</TH>
              <TH field="source" w={180}>Source</TH>
              <TH w={100}>Validation</TH>
            </tr>
          </thead>
          <tbody>
            {paged.map(u => (
              <Fragment key={u.id}>
                <tr style={{ borderBottom: exp[u.id] ? "none" : `1px solid ${COLORS.DIV}`, cursor: "pointer", transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(6,48,44,0.025)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setExp(p => ({ ...p, [u.id]: !p[u.id] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex", alignItems: "center", borderRadius: "50%", color: COLORS.TS, transform: exp[u.id] ? "rotate(90deg)" : "none", transition: "transform .2s" }}>
                        <Icon d={ICON_PATHS.chevR} size={16} color={COLORS.TS} />
                      </button>
                      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}><DUChip status={u.status} /></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.group}</span></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TP, lineHeight: 1.5, display: "block" }}>{u.logic}</span></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.pop}</span></td>
                  <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TP, textDecoration: "underline", textDecorationColor: "rgba(0,0,0,.3)", cursor: "pointer" }}>{u.source}</span></td>
                  <td style={{ padding: "14px 16px" }}>{u.ok ? <Icon d={ICON_PATHS.checkCircle} size={22} color={COLORS.SM} /> : <Icon d={ICON_PATHS.warning} size={22} color={COLORS.WM} />}</td>
                </tr>
                {exp[u.id] && (
                  <tr style={{ background: "#fffefb", borderBottom: `1px solid ${COLORS.DIV}` }}>
                    <td colSpan={7} style={{ padding: 0 }}>
                      <div style={{ display: "flex", borderTop: `1px solid ${COLORS.DIV}` }}>
                        {/* Left column */}
                        <div style={{ flex: 1, padding: "24px 32px", borderRight: `1px solid ${COLORS.DIV}`, display: "flex", flexDirection: "column", gap: 24 }}>
                          <div>
                            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Clinical Explanation:</p>
                            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP, lineHeight: 1.5 }}>
                              {u.explanation || u.logic}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Applies to population:</p>
                            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.pop}</p>
                          </div>
                          <div style={{ display: "flex", gap: 98 }}>
                            <div>
                              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Guideline source</p>
                              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.source}</p>
                            </div>
                            <div>
                              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Source reference link:</p>
                              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#03A9F4", textDecoration: "underline", cursor: "pointer" }}>{u.sourceLink || "Samplelink.Url-here"}</p>
                            </div>
                          </div>
                          <div>
                            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Notes:</p>
                            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.notes || "No additional notes provided."}</p>
                          </div>
                        </div>
 
                        {/* Right column */}
                        <div style={{ flex: 1, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Toggle checked={jsonMode[u.id]} onChange={() => setJsonMode(p => ({ ...p, [u.id]: !p[u.id] }))} label="Structured Logic (JSON):" />
                          </div>
                          {jsonMode[u.id] ? (
                            <div style={{ 
                              background: "#f1f5f9", 
                              border: `1px solid ${COLORS.DIV}`, 
                              borderRadius: 4, 
                              padding: 16, 
                              fontFamily: "var(--font-mono)", 
                              fontSize: 12, 
                              color: "#0f172a",
                              whiteSpace: "pre-wrap",
                              overflowX: "auto",
                              maxHeight: 280,
                              lineHeight: 1.5
                            }}>
                              <pre style={{ margin: 0 }}>
                                {JSON.stringify({
                                  symptom_domain: u.group.toLowerCase().replace(/\s/g, '_'),
                                  min_count_youth: 6,
                                  min_count_adult: 5,
                                  items: [
                                    "Often fails to give close attention to details",
                                    "Often has difficulty sustaining attention",
                                    "Often does not seem to listen when spoken to directly",
                                    "Often does not follow through on instructions",
                                    "Often has difficulty organizing tasks and activities",
                                    "Often avoids tasks that require sustained mental effort",
                                    "Often loses things necessary for tasks",
                                    "Often easily distracted by extraneous stimuli",
                                    "Often forgetful in daily activities"
                                  ]
                                }, null, 2)}
                              </pre>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: "flex", gap: 98 }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Created By</p>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.createdBy || "John Doe"}</p>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Last Updated</p>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.lastUpdated || "July 23, 2025"}</p>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 98 }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Version number</p>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.version || "V.21"}</p>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Status</p>
                                  <DUChip status={u.status} />
                                </div>
                              </div>
                              <div>
                                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.TP, marginBottom: 4 }}>Change Notes:</p>
                                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{u.changeNotes || "No change notes available."}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        <TableFooter page={page} setPage={setPage} rpp={rpp} setRpp={setRpp} total={total} s={s} e={e} count={sorted.length} />
        
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <CoverageSidebar 
            onClose={() => setSidebarOpen(false)} 
            onDimensionClick={(dim) => handleOpenModal(dim)} 
            units={units}
          />
        )}
      </AnimatePresence>
      <AddUnitModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAddUnit={onAddUnit} 
        initialRuleType={selectedDimension} 
      />
    </div>
  );
}
