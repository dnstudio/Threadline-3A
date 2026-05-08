import React from "react";
import { Edit3, Copy, Link } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, outlineBtn, BRAND, h1Style, subStyle, cardStyle, cardHeaderStyle, cardContentStyle, TYPE_SCALE } from "./constants";
import { StatusBadge } from "../common/StatusBadge";

import { SectionHeader } from "../common/SectionHeader";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_CLIENTS } from "./mockData";

export function ProfileWorkspace() {
  const { activeClientId } = useFeatureFlags();
  const clientMeta = MOCK_CLIENTS.find(c => c.id === activeClientId);

  return (
    <div style={{ padding: "0 0 64px" }}>
      <SectionHeader 
        title="Client Profile"
        subtitle={`${clientMeta?.name || "Client"} #${clientMeta?.id || ""}`}
        small={true}
        actions={
          <button style={{ ...outlineBtn, display: "flex", alignItems: "center", gap: 8 }}>
            <Edit3 size={16} /> Edit Profile
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "External ID", value: "125566" },
                { label: "Phone Number", value: "+61 412 345 678" },
                { label: "Referred By", value: "Dr. Alicia Smith" },
                { label: "Consent Obtained", value: "Yes (Digital)" },
                { label: "Email Address", value: "liam.osullivan@example.com" },
                { label: "Last Session", value: "19/03/2025" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                  <div className="text-sm font-normal text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Clinicians</div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="clinician" label="Primary Clinician" className="text-[11px]" />
              <StatusBadge status="required" label="Secondary Clinician" className="text-[11px]" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[400px] flex flex-col gap-5">
          {/* Meeting Room Link Card */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Meeting Room Link</h2>
            <p className="text-xs text-slate-500 mb-4 font-mono">Started 1:43:14 AM</p>
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Client Join link</div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 relative">
                <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  readOnly 
                  value="https://telehealth.threadline.com.au/join/{sessionId}?.." 
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-600 focus:outline-none" 
                />
              </div>
              <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                <Copy size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mb-5 italic">Share this link with your patient to join the session</p>
            
            <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              Join Session As Clinician
            </button>
          </div>

          {/* Consent Link Card */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Consent Link</h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Your privacy is incredibly important to us! Click here to discover how we manage your consent.</p>
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Consent link</div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  readOnly 
                  value="https://telehealth.threadline.com.au/consent/{sessionId}?.." 
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-600 focus:outline-none" 
                />
              </div>
              <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

