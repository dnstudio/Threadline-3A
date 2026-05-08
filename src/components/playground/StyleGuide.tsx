/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { COLORS, ICON_PATHS } from "../../constants";
import { Icon, StatusChip, GlChip, DUChip, FilterChip, SimpleDropdown, Accordion, Toggle } from "../common/UIElements";

export function StyleGuide() {
  const [selectedStatus, setSelectedStatus] = useState("Approved");

  return (
    <div style={{ padding: 48, background: "#fcfcfc", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 40, fontWeight: 300, color: COLORS.SG, marginBottom: 48 }}>UI Component Library</h1>

      {/* Chips & Badges */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.P, borderBottom: `1px solid ${COLORS.DIV}`, paddingBottom: 12, marginBottom: 24 }}>Chips & Badges</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Status Chips</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Approved", "In Review", "Draft", "Deprecated"].map(s => <StatusChip key={s} status={s} />)}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Guideline Labels</p>
            <div style={{ display: "flex", gap: 8 }}>
              <GlChip label="ICD-11" />
              <GlChip label="DSM-5-TR" />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Decision Unit Status</p>
            <div style={{ display: "flex", gap: 8 }}>
              <DUChip status="Active" />
              <DUChip status="Inactive" />
              <DUChip status="Pending" />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Filter Chips</p>
            <div style={{ display: "flex", gap: 8 }}>
              <FilterChip label="Anxiety" onRemove={() => {}} />
              <FilterChip label="ICD-11" onRemove={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.P, borderBottom: `1px solid ${COLORS.DIV}`, paddingBottom: 12, marginBottom: 24 }}>Controls</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48 }}>
          <div>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Dropdowns</p>
            <SimpleDropdown label="Status" value={selectedStatus} options={["Approved", "In Review", "Draft"]} onChange={setSelectedStatus} width={200} />
          </div>
          <div>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Toggles</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Toggle checked={true} onChange={() => {}} label="Structured Logic (JSON):" />
              <Toggle checked={false} onChange={() => {}} label="Inactive Switch Filter" />
            </div>
          </div>
          <div style={{ width: 400 }}>
            <p style={{ fontSize: 12, color: COLORS.TS, marginBottom: 16, textTransform: "uppercase" }}>Accordions</p>
            <Accordion title="Expanding Documentation Section">
              <p style={{ fontSize: 14, color: COLORS.TS, lineHeight: 1.6 }}>
                This is an example of the accordion component used throughout the application to organize large blocks of clinical text and guideline definitions.
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.P, borderBottom: `1px solid ${COLORS.DIV}`, paddingBottom: 12, marginBottom: 24 }}>Icons</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16 }}>
          {Object.entries(ICON_PATHS).map(([name, path]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 16, border: `1px solid ${COLORS.DIV}`, borderRadius: 8, background: "white" }}>
              <Icon d={path} size={24} color={COLORS.P} />
              <span style={{ fontSize: 11, color: COLORS.TS, textAlign: "center" }}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.P, borderBottom: `1px solid ${COLORS.DIV}`, paddingBottom: 12, marginBottom: 24 }}>Typography</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 400, color: COLORS.P }}>Headline 1 (32px)</h1>
            <p style={{ fontSize: 12, color: COLORS.TS }}>Used for main page titles.</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 400, color: COLORS.SG }}>Headline 2 (24px)</h2>
            <p style={{ fontSize: 12, color: COLORS.TS }}>Used for section headers.</p>
          </div>
          <div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, color: COLORS.TP, lineHeight: 1.6 }}>Body Text (15px)</p>
            <p style={{ fontSize: 12, color: COLORS.TS }}>Main reading text for descriptions and content.</p>
          </div>
          <div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.TS }}>Caption Text (13px)</p>
            <p style={{ fontSize: 12, color: COLORS.TS }}>Used for labels, metadata, and lower hierarchy information.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
