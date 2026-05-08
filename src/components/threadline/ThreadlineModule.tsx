import React, { useState, useEffect } from "react";
import { ClientListScreen } from "./ClientListScreen";
import { PatientListWorkspace } from "./PatientListWorkspace";
import { MainSessionListWorkspace } from "./MainSessionListWorkspace";
import { ResourcesWorkspace } from "./ResourcesWorkspace";
import { UsersWorkspace } from "./UsersWorkspace";
import { AssessmentListScreen } from "./AssessmentListScreen";
import { AssessmentResultScreen } from "./AssessmentResultScreen";

export function ThreadlineModule({ onGuidelinesClick, initialView = 'clients' }: { onGuidelinesClick?: () => void, key?: React.Key, initialView?: 'clients' | 'patients' | 'sessions' | 'resources' | 'users' }) {
  const [view, setView] = useState<'clients' | 'list' | 'result' | 'patients' | 'sessions' | 'resources' | 'users'>(initialView);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  useEffect(() => {
	setView(initialView);
  }, [initialView]);

  return (
    <div style={{ background: "#fcfcfc", minHeight: "100vh" }}>
      {view === 'clients' ? (
        <ClientListScreen onSelectClient={(id) => {
          setSelectedClientId(id);
          setView('list');
        }} />
      ) : view === 'patients' ? (
        <PatientListWorkspace />
      ) : view === 'sessions' ? (
        <MainSessionListWorkspace />
      ) : view === 'resources' ? (
        <ResourcesWorkspace />
      ) : view === 'users' ? (
        <UsersWorkspace />
      ) : view === 'list' ? (
        <AssessmentListScreen 
          clientId={selectedClientId || "125566"} 
          onBack={() => setView('clients')} 
        />
      ) : null}
    </div>
  );
}
