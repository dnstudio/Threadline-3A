/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COLORS, ICON_PATHS } from "../../constants";
import { Icon, StatusChip, GlChip } from "../common/UIElements";
import { Condition, SortField, SortDirection } from "../../types";
import { ReactNode } from "react";

interface ConditionTableProps {
  paged: Condition[];
  sortField: SortField;
  sortOrder: SortDirection;
  onSort: (field: SortField) => void;
  onRowClick: (row: Condition) => void;
}

export function ConditionTable({ paged, sortField, sortOrder, onSort, onRowClick }: ConditionTableProps) {
  const TH = ({ children, field, w }: { children: ReactNode; field?: SortField; w?: number }) => {
    const isSorted = sortField === field;
    return (
      <th onClick={() => field && onSort(field)} style={{
        width: w, minWidth: w, padding: "0 16px", height: 56, textAlign: "left", fontFamily: "'Poppins',sans-serif",
        fontWeight: 500, fontSize: 13, color: COLORS.TP, letterSpacing: .17, cursor: field ? "pointer" : "default",
        background: "rgba(140,145,164,0.05)", borderBottom: `1px solid ${COLORS.DIV}`, userSelect: "none", whiteSpace: "nowrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {children}
          {field && <Icon d={sortOrder === "asc" ? ICON_PATHS.sortD : ICON_PATHS.sortU} size={14} color={isSorted ? COLORS.P : "rgba(0,0,0,0.3)"} />}
        </div>
      </th>
    );
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: 330 }} />
        <col style={{ width: 140 }} />
        <col style={{ width: 280 }} />
        <col style={{ width: 130 }} />
        <col style={{ width: 180 }} />
      </colgroup>
      <thead>
        <tr>
          <TH field="name">Condition Name</TH>
          <TH field="status">Status</TH>
          <TH field="category">Category</TH>
          <TH field="code">Guideline</TH>
          <TH field="updated">Last Updated</TH>
        </tr>
      </thead>
      <tbody>
        {paged.map(row => (
          <tr key={row.id} onClick={() => onRowClick(row)} style={{ borderBottom: `1px solid ${COLORS.DIV}`, cursor: "pointer", transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(6,48,44,0.025)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.P, fontWeight: 500 }}>{row.name}</span></td>
            <td style={{ padding: "14px 16px" }}><StatusChip status={row.status} /></td>
            <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{row.category}</span></td>
            <td style={{ padding: "14px 16px" }}><GlChip label={row.code} /></td>
            <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP }}>{row.updated}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
