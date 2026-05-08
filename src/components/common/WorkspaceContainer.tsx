import React from 'react';

// Using inline fallback values if constants aren't available, but we'll import them.
import { DIVIDER } from '../threadline/constants';

interface WorkspaceContainerProps {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  sidebarWidth?: number;
  height?: number | string;
}

export function WorkspaceContainer({ 
  sidebarContent, 
  mainContent, 
  sidebarWidth = 280,
  height = 800
}: WorkspaceContainerProps) {
  return (
    <div style={{ 
      background: "white", 
      border: `1px solid #f1f5f9`, 
      borderRadius: 16, 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      overflow: "hidden", 
      display: "flex", 
      flexDirection: "row",
      height: height, 
      position: "relative" 
    }}>
      {/* Sidebar Area */}
      <div style={{ 
        width: sidebarWidth, 
        borderRight: `1px solid ${DIVIDER}`, 
        background: "#fcfcfc", 
        overflowY: "auto", 
        display: "flex", 
        flexDirection: "column",
        flexShrink: 0
      }}>
        {sidebarContent}
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden",
        background: "#fcfcfc"
      }}>
        {mainContent}
      </div>
    </div>
  );
}
