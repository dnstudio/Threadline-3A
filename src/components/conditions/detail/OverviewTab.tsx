/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COLORS, ICON_PATHS } from "../../../constants";
import { Icon } from "../../common/UIElements";
import { Condition } from "../../../types";

export function OverviewTab({ row }: { row: Condition }) {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", gap: 48, marginBottom: 48 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.SG, lineHeight: 1.334, marginBottom: 12 }}>Overview</h3>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TS, lineHeight: 1.6, letterSpacing: .15 }}>{row.overview}</p>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.SG, lineHeight: 1.334, marginBottom: 14, marginTop: 24 }}>Guideline References</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {row.refs.map((ref, i) => (
              <a key={i} href="#" onClick={e => e.preventDefault()} style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.P, textDecoration: "underline", textDecorationColor: "rgba(6,48,44,.4)", display: "flex", alignItems: "center", gap: 6 }}>
                {ref}<Icon d={ICON_PATHS.ext} size={14} color={COLORS.P} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.SG, lineHeight: 1.334, marginBottom: 16 }}>Metadata</h3>
      <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${COLORS.DIV}`, paddingTop: 16 }}>
        {[
          { l: "Guideline Version", v: row.guideline },
          { l: "Population Applicability", v: row.population },
          { l: "Last Reviewer", v: row.reviewer },
          { l: "Last Update", v: row.updated.split("–")[0].trim() },
        ].map(({ l, v }, i, arr) => (
          <div key={l} style={{ flex: 1, paddingRight: i < arr.length - 1 ? 24 : 0, paddingLeft: i > 0 ? 24 : 0, borderRight: i < arr.length - 1 ? `1px solid ${COLORS.DIV}` : "none" }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TS, marginBottom: 8 }}>{l}</p>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
