import React, { useState } from "react";
import { Search, Download } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, outlineBtn, cardStyle, cardContentStyle, h1Style, subStyle } from "./constants";
import { MultiDropdown } from "../common/UIElements";

export function ResourcesWorkspace() {
  const [selectedCats, setSelectedCats] = useState<string[]>(["All"]);
  const categories = ["All", "User Guides", "Templates", "Brochures", "Consumer Handouts", "White Papers"];
  
  const toggleCat = (cat: string) => {
    if (cat === "All") setSelectedCats(["All"]);
    else {
      const next = selectedCats.includes(cat) ? selectedCats.filter(c => c !== cat) : [...selectedCats.filter(c => c !== "All"), cat];
      setSelectedCats(next.length === 0 ? ["All"] : next);
    }
  };

  const resources = [
    { title: "Worry Management Toolkit", desc: "Evidence-based techniques for managing anxiety", type: "User Guide" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Templates" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Brochures" },
    { title: "Worry Management Toolkit", desc: "Evidence-based techniques for managing anxiety", type: "White Papers" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "User Guide" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Consumer Handouts" },
    { title: "Worry Management Toolkit", desc: "Evidence-based techniques for managing anxiety", type: "Templates" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "User Guide" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Brochures" },
  ];

  return (
    <div style={{ padding: "32px 0 64px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={h1Style}>Resources</h1>
          <p style={subStyle}>Evidence-informed resources for clinicians.</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MultiDropdown 
              label="Categories" 
              value={selectedCats} 
              options={categories} 
              onToggle={toggleCat} 
              width={240} 
            />
          </div>

          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input 
              type="text" 
              placeholder="Search Resources" 
              style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${DIVIDER}`, borderRadius: 4, fontSize: 14, outline: "none" }} 
            />
          </div>
        </div>

        {/* Grid */}
        <div style={cardContentStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {resources.map((r, idx) => (
          <div 
            key={idx} 
            style={{ 
              border: `1px solid ${DIVIDER}`, borderRadius: 12, padding: 24, background: "white", 
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20, minHeight: 180 
            }}
          >
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: TEXT_PRIMARY, margin: "0 0 8px" }}>{r.title}</h3>
              <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid #f1f5f9` }}>
              <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{r.type}</span>
              <button style={{ ...outlineBtn, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                Download <Download size={14} />
              </button>
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>
    </div>
  );
}

