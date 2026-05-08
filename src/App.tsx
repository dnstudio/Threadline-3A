/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { ConditionList } from "./components/conditions/ConditionList";
import { ConditionDetail } from "./components/conditions/ConditionDetail";
import { StyleGuide } from "./components/playground/StyleGuide";
import { ThreadlineModule } from "./components/threadline/ThreadlineModule";
import { MainSessionListWorkspace } from "./components/threadline/MainSessionListWorkspace";
import { MainAssessmentListWorkspace } from "./components/threadline/MainAssessmentListWorkspace";
import { MainDocumentListWorkspace } from "./components/threadline/MainDocumentListWorkspace";
import { GlobalModals } from "./components/threadline/Modals";
import { FeatureToggleModal } from "./components/modals/FeatureToggleModal";
import { FeatureToggleProvider, useFeatureFlags } from "./contexts/FeatureToggleContext";
import { Condition } from "./types";
import { ALL_CONDITIONS } from "./constants";
import { Button } from "./components/common/Button";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./components/threadline/mockData";
import { Settings, X as CloseIcon } from "lucide-react";

export default function App() {
  return (
    <FeatureToggleProvider>
      <AppContent />
    </FeatureToggleProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState<Condition[]>(() => [...ALL_CONDITIONS]);
  const [showMockData, setShowMockData] = useState(false);
  const [showFeatureToggles, setShowFeatureToggles] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDebugMinimized, setIsDebugMinimized] = useState(true);

  const handleCreateCondition = (data: { name: string; category: string; guideline: string }) => {
    const newCondition: Condition = {
      id: Math.max(...conditions.map(c => c.id), 0) + 1,
      name: data.name,
      category: data.category,
      guideline: data.guideline,
      code: "NEW",
      status: "Draft",
      updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + " – " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      population: "N/A",
      reviewer: "Current User",
      overview: "Newly created condition guideline.",
      refs: []
    };
    setConditions([newCondition, ...conditions]);
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.startsWith('/conditions')) return 'Conditions';
    if (path.startsWith('/clients')) return 'Clients';
    if (path.startsWith('/patients')) return 'Patients';
    if (path.startsWith('/sessions')) return 'Sessions';
    if (path.startsWith('/assessments')) return 'Assessments';
    if (path.startsWith('/documents')) return 'Documents';
    if (path.startsWith('/resources')) return 'Resources';
    if (path.startsWith('/users')) return 'Users';
    return 'Clients';
  };

  const isPlayground = location.pathname === '/playground';

  const { activeCount, useGroupedTabs, setUseGroupedTabs, flags, setFlag } = useFeatureFlags();

  return (
    <div className="font-sans bg-[#fcfcfc] min-h-screen relative">

      {showMockData && (
        <div 
          className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowMockData(false)}
        >
          <div 
            className="bg-white p-6 rounded-xl max-h-[80vh] overflow-y-auto w-full max-w-4xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mock Client Data</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMockData(false)}>
                <CloseIcon size={20} />
              </Button>
            </div>
            <pre className="text-xs p-4 bg-gray-50 rounded-lg overflow-x-auto">
              {JSON.stringify({ MOCK_CLIENTS, MOCK_CLIENT_DATA }, null, 2)}
            </pre>
            <div className="mt-6 flex justify-end">
              <Button variant="brand" onClick={() => setShowMockData(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {!isPlayground && (
        <Navbar 
          onClientsClick={() => navigate('/clients')}
          onPatientsClick={() => navigate('/patients')}
          onSessionsClick={() => navigate('/sessions')}
          onAssessmentsClick={() => navigate('/assessments')}
          onDocumentsClick={() => navigate('/documents')}
          onResourcesClick={() => navigate('/resources')}
          onUsersClick={() => navigate('/users')}
          onConditionsClick={() => navigate('/conditions')}
          onAvatarClick={() => setShowFeatureToggles(true)}
          activeItem={getActiveItem()}
          isAdminView={isAdminView}
        />
      )}

      <div className="px-[60px] pb-8 mt-8 max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/clients" replace />} />
              <Route path="/playground" element={<StyleGuide />} />
              <Route path="/conditions" element={
                <ConditionList
                  conditions={conditions}
                  onCreateCondition={handleCreateCondition}
                  onRowClick={(row) => navigate(`/conditions/${row.id}`)}
                />
              } />
              <Route path="/conditions/:id" element={<ConditionDetailWrapper conditions={conditions} />} />
              <Route path="/clients/*" element={<ThreadlineModule initialView="clients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/patients/*" element={<ThreadlineModule initialView="patients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/sessions" element={<MainSessionListWorkspace />} />
              <Route path="/assessments" element={<MainAssessmentListWorkspace />} />
              <Route path="/documents" element={<MainDocumentListWorkspace />} />
              <Route path="/resources/*" element={<ThreadlineModule initialView="resources" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/users/*" element={<ThreadlineModule initialView="users" onGuidelinesClick={() => navigate('/conditions')} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Debug Menu */}
      <div className={`fixed bottom-6 right-6 flex items-center gap-2 z-[1000] p-1.5 bg-white rounded-full shadow-lg border border-slate-200 transition-all duration-300 ${isDebugMinimized ? 'max-w-[44px]' : 'max-w-[1200px] overflow-hidden'}`}>
         <Button 
           variant={isDebugMinimized ? 'brand' : 'ghost'}
           size="sm"
           onClick={() => setIsDebugMinimized(!isDebugMinimized)}
           className="w-8 h-8 p-0 rounded-full shrink-0"
           title={isDebugMinimized ? "Show Debug Menu" : "Minimize Debug Menu"}
         >
           {isDebugMinimized ? <Settings size={14} /> : <CloseIcon size={14} />}
         </Button>
         
         {!isDebugMinimized && (
           <div className="flex items-center gap-2 pr-2">
              <Button 
                variant={showFeatureToggles ? 'brand' : 'ghost'}
                size="sm"
                onClick={() => setShowFeatureToggles(true)}
                className="rounded-full px-4 h-8 text-xs flex gap-2"
              >
                Features 
                {activeCount > 0 && (
                  <span className={`rounded-full px-1.5 min-w-[18px] text-[10px] font-bold ${showFeatureToggles ? 'bg-white text-[#06302c]' : 'bg-[#06302c] text-white'}`}>
                    {activeCount}
                  </span>
                )}
              </Button>
              <Button 
                variant={isPlayground ? 'brand' : 'ghost'}
                size="sm"
                onClick={() => { navigate(isPlayground ? '/conditions' : '/playground'); }}
                className="rounded-full px-4 h-8 text-xs"
              >
                {isPlayground ? "App" : "Style Guide"}
              </Button>
              {!isPlayground && (
                <Button 
                  variant={isAdminView ? 'brand' : 'ghost'}
                  size="sm"
                  onClick={() => setIsAdminView(!isAdminView)}
                  className="rounded-full px-4 h-8 text-xs"
                >
                  Admin: {isAdminView ? "ON" : "OFF"}
                </Button>
              )}
              {!isPlayground && (
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMockData(true)}
                  className="rounded-full px-4 h-8 text-xs"
                >
                  Mock
                </Button>
              )}
              <Button 
                variant="brand"
                size="sm"
                onClick={() => setUseGroupedTabs(!useGroupedTabs)}
                className="rounded-full px-4 h-8 text-xs opacity-90"
              >
                Nav: {useGroupedTabs ? "Grouped" : "Classic"}
              </Button>
              <Button 
                variant={flags.FEATURE_COMPACT_HUD ? 'brand' : 'outline'}
                size="sm"
                onClick={() => setFlag("FEATURE_COMPACT_HUD", !flags.FEATURE_COMPACT_HUD)}
                className="rounded-full px-4 h-8 text-xs border-[#06302c]"
              >
                HUD: {flags.FEATURE_COMPACT_HUD ? "Compact" : "Normal"}
              </Button>
           </div>
         )}
      </div>

      <GlobalModals />
      <FeatureToggleModal isOpen={showFeatureToggles} onClose={() => setShowFeatureToggles(false)} />
    </div>
  );
}

import { useParams } from "react-router-dom";
function ConditionDetailWrapper({ conditions }: { conditions: Condition[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const condition = conditions.find(c => c.id === Number(id));
  if (!condition) return <Navigate to="/conditions" replace />;
  return <ConditionDetail row={condition} onBack={() => navigate('/conditions')} />;
}
