import React from "react";
import { InterpRow } from "./components";
import { Download as DownloadIcon, ArrowLeft as BackArrow } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, primaryBtn, BRAND_LIGHT, BRAND, h1Style, subStyle, cardStyle, cardHeaderStyle, cardContentStyle, TYPE_SCALE } from "./constants";

import { MOCK_CLIENTS } from "./mockData";

export function AssessmentResultScreen({ clientId, onBack, onGuidelinesClick }: { clientId: string, onBack: () => void, onGuidelinesClick?: () => void }) {
  const clientMeta = MOCK_CLIENTS.find(c => c.id === clientId) || MOCK_CLIENTS[0];
  
  return (
    <div style={{ padding: "0 0 64px" }}>
      <div style={{ ...cardStyle }}>
        {/* Header */}
        <div style={{ ...cardHeaderStyle, paddingBottom: 24 }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND, fontSize: 13, fontWeight: 600, padding: "0 0 12px", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
              <BackArrow size={16} /> Back to Assessments
            </button>
            <h1 style={{ ...h1Style, fontSize: 24, margin: "0 0 4px 0" }}>
              WHO-5 (World Health Organization-5 Well-Being Index)
            </h1>
            <p style={subStyle}>
              View and download assessment results and clinical reports for this client.
            </p>
          </div>
          <button style={{ ...primaryBtn, flexShrink: 0 }}><DownloadIcon size={18} /> Download Results</button>
        </div>

        <div style={cardContentStyle}>
          {/* Client info banner */}
          <div style={{ background: "#f1f5f9", border: `1px solid #f1f5f9`, borderRadius: 12, display: "flex", flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { label: "Client Name", value: clientMeta.name },
              { label: "Date Administered", value: "17 December 2025" },
              { label: "Date of Birth", value: "17 Dec 2001 (24y)" },
              { label: "Assessor", value: "Dr. Marcus Thorne" },
              { label: "Completion Time", value: "12 minutes" },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "16px 24px", minWidth: 160, borderRight: `1px solid #f1f5f9` }}>
                <div style={{ ...TYPE_SCALE.LabelMicro, marginBottom: 4 }}>{label}</div>
                <div style={{ ...TYPE_SCALE.HeadingSmall, fontWeight: 400 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Score table */}
          <div style={{ border: `1px solid #f1f5f9`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Poppins', sans-serif" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: `1px solid #f1f5f9` }}>
                  {["Metric", "Raw Score", "Percentile", "Descriptor"].map(h => (
                    <th key={h} style={{ padding: "16px 20px", textAlign: "left", ...TYPE_SCALE.LabelMicro }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "16px 20px", ...TYPE_SCALE.HeadingSmall }}>Total Score</td>
                  <td style={{ padding: "16px 20px", ...TYPE_SCALE.BodyStandard }}>42 / 60</td>
                  <td style={{ padding: "16px 20px", ...TYPE_SCALE.BodyStandard }}>70th</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Moderate</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interpretation section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
               <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY, margin: 0 }}>Clinical Interpretation</h2>
               <div style={{ height: 1, flex: 1, background: "#f1f5f9" }} />
            </div>
            <InterpRow 
              title="Overall Impression" 
              content="Liam's responses indicate a moderate level of well-being over the past two weeks. While several domains show resilience, there are specific areas related to sleep quality and daily energy levels that fall below the expected threshold for his age group." 
              defaultOpen={true} 
            />
            <InterpRow 
              title="Symptom Analysis" 
              content="The raw scores suggest a pattern of intermittent anxiety specifically triggered by academic deadlines. His 'Worry' thread scores were elevated (14/21), indicating a need for targeted mindfulness interventions." 
            />
            <InterpRow 
              title="Recommended Next Steps" 
              content="" 
              isNextStep={true} 
              editable={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
