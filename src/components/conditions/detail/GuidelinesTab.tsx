/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, CSSProperties } from "react";
import { COLORS, ICON_PATHS, GUIDELINE_SECTIONS } from "../../../constants";
import { Icon, Accordion } from "../../common/UIElements";
import { Condition } from "../../../types";
import { getGuidelineContent } from "../../../services/dataService";

const bodyStyle: CSSProperties = { fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TS, lineHeight: 1.6, letterSpacing: .17, whiteSpace: "pre-wrap" };
const subheadStyle: CSSProperties = { fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP, fontWeight: 400, letterSpacing: .15, marginBottom: 6 };

export function GuidelinesTab({ row }: { row: Condition }) {
  const [activeSection, setActiveSection] = useState("description");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const content = getGuidelineContent(row);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ display: "flex", minHeight: 600 }}>
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${COLORS.DIV}`, paddingTop: 24, paddingLeft: 8 }}>
        {GUIDELINE_SECTIONS.map(sec => {
          const active = activeSection === sec.id;
          return (
            <button key={sec.id} onClick={() => scrollTo(sec.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
              borderRadius: 4, fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 500,
              color: active ? COLORS.SM : COLORS.TS, letterSpacing: .4,
              borderLeft: active ? `3px solid ${COLORS.SM}` : "3px solid transparent",
            }}>
              {sec.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <div style={{ borderBottom: `1px solid ${COLORS.DIV}`, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 4, background: COLORS.AVATAR_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon d={ICON_PATHS.doc} size={24} color="#6b6560" />
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP, lineHeight: 1.5 }}>{row.name}</p>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TS, lineHeight: 1.43 }}>Last updated: {row.updated}</p>
            </div>
          </div>
          <div style={{ background: COLORS.IL, borderRadius: 4, padding: "8px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Icon d={ICON_PATHS.info} size={22} color={COLORS.IM} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.IM, fontWeight: 500, lineHeight: 1.5 }}>{row.guideline} (2025-01) • {row.code}</p>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.IM, fontWeight: 500, lineHeight: 1.43, marginTop: 2 }}>This content is automatically sourced from {row.guideline} (2025-01) and is read-only. Changes to official guidelines will be reflected in future system updates.</p>
            </div>
          </div>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {GUIDELINE_SECTIONS.map(sec => (
            <div key={sec.id} ref={el => sectionRefs.current[sec.id] = el}>
              <Accordion title={sec.label}>
                {sec.id === "description" && <p style={bodyStyle}>{content.description}</p>}
                {sec.id === "diagnostic" && (
                   <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div><p style={subheadStyle}>Inclusions</p>{content.inclusions.map((v,i)=><p key={i} style={bodyStyle}>• {v}</p>)}</div>
                    <div><p style={subheadStyle}>Exclusions</p>{content.exclusions.map((v,i)=><p key={i} style={bodyStyle}>• {v}</p>)}</div>
                    <div><p style={subheadStyle}>Mood / Assessment Instruments</p><p style={bodyStyle}>{content.mood}</p></div>
                  </div>
                )}
                {sec.id === "requirements" && (
                   <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div><p style={subheadStyle}>Essential (Required) Features</p><p style={bodyStyle}>{content.requirements}</p></div>
                    <div><p style={subheadStyle}>Insight Specifiers</p><p style={bodyStyle}>{content.insightSpecifiers}</p></div>
                  </div>
                )}
                {sec.id === "clinical" && <p style={bodyStyle}>{content.clinicalFeatures}</p>}
                {sec.id === "scoring" && <p style={bodyStyle}>{content.scoring}</p>}
                {sec.id === "boundary" && <p style={bodyStyle}>{content.boundary}</p>}
                {sec.id === "course" && <div><p style={subheadStyle}>Essential (Required) Features</p><p style={bodyStyle}>{content.course}</p></div>}
                {sec.id === "developmental" && <p style={bodyStyle}>{content.developmental}</p>}
                {sec.id === "gender" && <p style={bodyStyle}>{content.gender}</p>}
                {sec.id === "differential" && (
                   <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                     {content.differential.map(({title,text})=><div key={title}><p style={subheadStyle}>{title}</p><p style={bodyStyle}>{text}</p></div>)}
                   </div>
                )}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
