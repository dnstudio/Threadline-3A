/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS, ALL_CATS } from "../../constants";
import { Icon, FilterChip, SimpleDropdown, MultiDropdown } from "../common/UIElements";

interface FilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  catFilters: string[];
  toggleCat: (cat: string) => void;
  catOpen: boolean;
  setCatOpen: (o: boolean) => void;
}

export function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
  catFilters, toggleCat,
  catOpen, setCatOpen
}: FilterBarProps) {
  return (
    <div style={{ padding: "24px 24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <SimpleDropdown
            label="Status"
            value={statusFilter}
            options={["All Status", "Approved", "In Review", "Deprecated", "Draft"]}
            onChange={setStatusFilter}
            width={200}
          />

          <MultiDropdown
            label="Categories"
            value={catFilters}
            options={ALL_CATS}
            onToggle={toggleCat}
            width={240}
          />
        </div>

        <div style={{ position: "relative", width: 320 }}>
          <Icon d={ICON_PATHS.search} size={20} color={COLORS.TS} style={{ position: "absolute", left: 12, top: 12 }} />
          <input
            placeholder="Search conditions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: 44, padding: "0 12px 0 44px",
              border: `1px solid ${COLORS.DIV}`, borderRadius: 4,
              fontFamily: "'Poppins',sans-serif", fontSize: 14, color: COLORS.TP,
              outline: "none", transition: "border-color .15s"
            }}
            onFocus={e => e.currentTarget.style.borderColor = COLORS.P}
            onBlur={e => e.currentTarget.style.borderColor = COLORS.DIV}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {catFilters.map(cat => (
          <FilterChip key={cat} label={cat} onRemove={() => toggleCat(cat)} />
        ))}
        {catFilters.length > 0 && (
          <button
            onClick={() => toggleCat("CLEAR_ALL")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins',sans-serif", fontSize: 13, color: COLORS.P,
              fontWeight: 500, padding: "4px 8px"
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
