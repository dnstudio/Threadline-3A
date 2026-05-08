import React from "react";
import { AlertCircle, FileText, Upload, AlertTriangle } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, primaryBtn, outlineBtn } from "../threadline/constants";

interface DocumentCompletenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingDocuments: string[];
  onProceed: () => void;
  onUploadNow: () => void;
}

export function DocumentCompletenessModal({ isOpen, onClose, missingDocuments, onProceed, onUploadNow }: DocumentCompletenessModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", 
      justifyContent: "center", zIndex: 3000
    }}>
      <div 
        style={{
          background: "white", borderRadius: 12, width: "100%", maxWidth: 520, 
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          overflow: "hidden"
        }}
      >
        <div style={{ padding: "24px 32px", background: "#fffbeb", borderBottom: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#fef3c7", padding: 10, borderRadius: "50%", color: "#b45309" }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#92400e" }}>Incomplete Documentation</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: 14, color: "#b45309" }}>Some required files are missing for this assessment.</p>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          <p style={{ fontSize: 15, color: TEXT_PRIMARY, marginBottom: 20, fontWeight: 500 }}>
            The following required documents have not been uploaded:
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {missingDocuments.map((doc) => (
              <div key={doc} style={{ 
                display: "flex", alignItems: "center", gap: 12, 
                padding: "12px 16px", background: "#f9fafb", borderRadius: 8,
                border: `1px solid ${DIVIDER}`
              }}>
                <FileText size={18} color={TEXT_SECONDARY} />
                <span style={{ fontSize: 14, color: TEXT_PRIMARY, fontWeight: 500 }}>{doc.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>

          <div style={{ 
            padding: 16, background: "#f3f4f6", borderRadius: 8, 
            display: "flex", gap: 12, marginBottom: 0
          }}>
            <AlertCircle size={20} color={TEXT_SECONDARY} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5 }}>
              Proceeding without these documents may result in a less accurate or incomplete AI analysis.
            </p>
          </div>
        </div>

        <div style={{ padding: "24px 32px", borderTop: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button 
            onClick={onProceed}
            style={{ 
              background: "none", border: "none", color: "#6b7280", 
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Proceed with missing documents
          </button>
          
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{ ...outlineBtn, padding: "10px 20px" }}>
              Cancel
            </button>
            <button 
              onClick={onUploadNow}
              style={{ ...primaryBtn, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8 }}
            >
              <Upload size={16} /> Upload Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
