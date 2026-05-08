/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS, ALL_CATS } from "../../constants";
import { Icon } from "../common/UIElements";

interface CreateConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; category: string; guideline: string }) => void;
}

const CATEGORY_GUIDELINES: Record<string, string[]> = {
  "Feeding & Eating": ["DSM-5-TR", "ICD-11"],
  "Neurodevelopmental": ["ICD-11", "DSM-5-TR"],
  "Anxiety & Fear-Related": ["DSM-5-TR", "ICD-11", "National Health Service (NHS)"],
  "Obsessive-Compulsive & Related": ["ICD-11", "WHO Guidelines"],
  "Trauma & Stress-Related": ["DSM-5-TR", "ICD-11"],
  "Mood Disorders": ["ICD-11", "DSM-5-TR", "Internal Expert Consensus"],
  "Psychotic Disorders": ["DSM-5-TR", "ICD-11"],
  "Personality Disorders": ["ICD-11", "DSM-5-TR"],
};

export function CreateConditionModal({ isOpen, onClose, onCreate }: CreateConditionModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(ALL_CATS[0]);
  const [guideline, setGuideline] = useState("");

  const availableGuidelines = useMemo(() => {
    return CATEGORY_GUIDELINES[category] || ["ICD-11", "DSM-5-TR"];
  }, [category]);

  // Sync guideline when category changes
  useState(() => {
    if (!guideline && availableGuidelines.length > 0) {
      setGuideline(availableGuidelines[0]);
    }
  });

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    const newGuidelines = CATEGORY_GUIDELINES[val] || ["ICD-11", "DSM-5-TR"];
    setGuideline(newGuidelines[0]);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name, category, guideline });
    // Reset and close
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 480,
                background: "white",
                borderRadius: 12,
                boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${COLORS.DIV}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 500, color: COLORS.TP }}>
                  Create New Condition
                </span>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Icon d={ICON_PATHS.close} size={20} color="black" />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 32 }}>
                
                {/* Condition Name */}
                <div style={{ position: "relative", width: "100%" }}>
                  <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "16px 12px" }}>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Major Depressive Disorder"
                      style={{ 
                        width: "100%", border: "none", outline: "none", 
                        fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "rgba(0,0,0,0.87)" 
                      }} 
                    />
                  </div>
                  <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)", letterSpacing: 0.15 }}>Condition name</p>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div style={{ position: "relative", width: "100%" }}>
                  <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "0 12px", display: "flex", alignItems: "center", position: "relative" }}>
                    <select 
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      style={{ 
                        width: "100%", border: "none", background: "transparent", padding: "16px 0", 
                        fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "rgba(0,0,0,0.87)",
                        appearance: "none", outline: "none", cursor: "pointer", zIndex: 2
                      }}
                    >
                      {ALL_CATS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, pointerEvents: "none", zIndex: 1 }}>
                      <Icon d={ICON_PATHS.chevD} size={10} color="rgba(0,0,0,0.56)" />
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px", zIndex: 3 }}>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)", letterSpacing: 0.15 }}>Category</p>
                  </div>
                </div>

                {/* Guideline Dropdown (Filtered) */}
                <div style={{ position: "relative", width: "100%" }}>
                  <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "0 12px", display: "flex", alignItems: "center", position: "relative" }}>
                    <select 
                      value={guideline}
                      onChange={(e) => setGuideline(e.target.value)}
                      style={{ 
                        width: "100%", border: "none", background: "transparent", padding: "16px 0", 
                        fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "rgba(0,0,0,0.87)",
                        appearance: "none", outline: "none", cursor: "pointer", zIndex: 2
                      }}
                    >
                      {availableGuidelines.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, pointerEvents: "none", zIndex: 1 }}>
                      <Icon d={ICON_PATHS.chevD} size={10} color="rgba(0,0,0,0.56)" />
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px", zIndex: 3 }}>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)", letterSpacing: 0.15 }}>Guideline</p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div style={{ 
                padding: "16px 24px", 
                borderTop: `1px solid ${COLORS.DIV}`, 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: 12,
                background: "#f1f5f9"
              }}>
                <button 
                  onClick={onClose} 
                  style={{ 
                    padding: "10px 24px", border: "none", background: "none", 
                    color: COLORS.P, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer" 
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  style={{ 
                    padding: "10px 24px", border: "none", borderRadius: 4, 
                    background: name.trim() ? COLORS.P : COLORS.GM, 
                    color: "white", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, 
                    cursor: name.trim() ? "pointer" : "not-allowed", 
                    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 1px 5px rgba(0,0,0,.12)" 
                  }}
                >
                  Create guidelines
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
