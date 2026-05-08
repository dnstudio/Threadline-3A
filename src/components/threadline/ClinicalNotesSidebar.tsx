import React, { useState } from "react";
import { StickyNote, ChevronRight, ChevronLeft, Calendar, Plus, MessageSquare, Link as LinkIcon, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_CLIENT_DATA } from "./mockData";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, primaryBtn, outlineBtn, TYPE_SCALE } from "./constants";

interface ClinicalNote {
  id: string;
  date: string;
  content: string;
  sessionId?: string;
  type: 'session' | 'standalone';
}

export function ClinicalNotesSidebar() {
  const { activeAssessmentId } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  
  // Use clientId "125566" as default for the demo assessment view if not specified
  const clientId = "125566";
  const clientData = MOCK_CLIENT_DATA[clientId];
  
  const [standaloneNotes, setStandaloneNotes] = useState<ClinicalNote[]>([]);

  if (!clientData) return null;

  // Convert sessions to notes
  const sessionNotes: ClinicalNote[] = clientData.sessions.map((s, idx) => ({
    id: `session-note-${idx}`,
    date: s.date,
    content: s.notes,
    sessionId: String(idx),
    type: 'session'
  }));

  const allNotes = [...sessionNotes, ...standaloneNotes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    
    const newNote: ClinicalNote = {
      id: `standalone-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: newNoteContent,
      type: 'standalone'
    };
    
    setStandaloneNotes([newNote, ...standaloneNotes]);
    setNewNoteContent("");
    setIsAdding(false);
  };

  return (
    <div style={{
      position: "fixed",
      right: isOpen ? 0 : 0,
      top: 64, // below navbar
      bottom: 0,
      zIndex: 101, // one above compare sidebar if needed
      display: "flex",
      pointerEvents: "none"
    }}>
      {/* Toggle Button */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "360px",
        height: "100%",
        transform: "none" // Touch the edge of the screen
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "#4f46e5", // Indigo for notes
            color: "white",
            border: "none",
            borderRadius: "8px 0 0 8px",
            padding: "16px 8px",
            cursor: "pointer",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          <div style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap"
          }}>
            Clinical Notes
          </div>
          <StickyNote size={18} />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              width: 360,
              background: "white",
              borderLeft: `1px solid ${DIVIDER}`,
              boxShadow: "-4px 0 16px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              pointerEvents: "auto"
            }}
          >
            <div style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${DIVIDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <StickyNote size={20} color="#4f46e5" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY }}>Clinical Notes</h2>
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                style={{ 
                  background: isAdding ? "#fee2e2" : "#eef2ff", 
                  color: isAdding ? "#ef4444" : "#4f46e5",
                  border: "none", 
                  borderRadius: 6, 
                  padding: "6px 10px", 
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                {isAdding ? "Cancel" : <><Plus size={14} /> New Note</>}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginBottom: 24, overflow: "hidden" }}
                  >
                    <div style={{ 
                      padding: 16, 
                      borderRadius: 12, 
                      border: `1.5px solid ${BRAND}`, 
                      background: "#fdfdfd",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                         New Clinical Entry
                      </div>
                      <textarea 
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Type clinical observation or summary..."
                        style={{
                          width: "100%",
                          minHeight: 120,
                          border: "none",
                          background: "transparent",
                          fontSize: 14,
                          lineHeight: 1.6,
                          outline: "none",
                          resize: "vertical",
                          color: TEXT_PRIMARY,
                          fontFamily: 'inherit'
                        }}
                        autoFocus
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${DIVIDER}` }}>
                        <button 
                          onClick={() => setIsAdding(false)}
                          style={{ 
                            ...outlineBtn,
                            height: 36,
                            padding: "0 16px",
                            fontSize: 13
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveNote}
                          style={{ 
                            ...primaryBtn, 
                            background: "#4f46e5", 
                            height: 36, 
                            padding: "0 16px",
                            fontSize: 13
                          }}
                        >
                          <Save size={14} /> Save Note
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {allNotes.map((note) => (
                  <div key={note.id} style={{
                    position: "relative",
                    padding: 16,
                    borderRadius: 12,
                    border: `1px solid ${DIVIDER}`,
                    background: note.type === 'session' ? "#fff" : "#fafbff",
                    transition: "transform 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, ...TYPE_SCALE.LabelMicro }}>
                        <Calendar size={13} />
                        {note.date}
                      </div>
                      <div style={{ 
                        fontSize: 9, 
                        fontWeight: 700, 
                        padding: "2px 8px", 
                        borderRadius: 20,
                        background: note.type === 'session' ? "#f1f5f9" : "#e0e7ff",
                        color: note.type === 'session' ? "#475569" : "#4338ca",
                        textTransform: "uppercase"
                      }}>
                        {note.type === 'session' ? 'Session Linked' : 'Stand-alone'}
                      </div>
                    </div>
                    
                    <div style={{ 
                      fontSize: 14, 
                      lineHeight: 1.6, 
                      color: TEXT_PRIMARY,
                      marginBottom: note.type === 'session' ? 12 : 0 
                    }}>
                      {note.content}
                    </div>

                    {note.type === 'session' && (
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 8, 
                        paddingTop: 12, 
                        borderTop: `1px dashed ${DIVIDER}`,
                        marginTop: 4
                      }}>
                        <LinkIcon size={12} color="#6366f1" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1" }}>
                          Linked to Session: {clientData.sessions[parseInt(note.sessionId!)].focus}
                        </span>
                        <ChevronRight size={12} color="#6366f1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, borderTop: `1px solid ${DIVIDER}`, background: "#f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, ...TYPE_SCALE.LabelMicro }}>
                <MessageSquare size={14} />
                <span>Quick-access notes for evaluation support</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
