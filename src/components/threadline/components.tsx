import React from 'react';
import { TYPE_SCALE } from './constants';

export { ThreadlineNavbar as Navbar } from './ThreadlineNavbar';
export { TabBar } from './TabBar';
export { Breadcrumbs } from './Breadcrumbs';
export { EntityCard } from './EntityCard';
export { AssessmentCard } from './AssessmentCard';
export { ReportSection } from './ReportSection';
export { InterpRow } from './InterpRow';
export { SysBadge } from '../common/SysBadge';
export { Toast } from '../common/Toast';

import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

// Compatibility exports
export const ThreadlineButton = Button;

export const ThreadlineText: React.FC<{ variant?: keyof typeof TYPE_SCALE, style?: React.CSSProperties, className?: string, children: React.ReactNode }> = ({ variant = 'BodyStandard', style, className = "", children }) => {
  return (
    <div style={{ ...TYPE_SCALE[variant], ...style }} className={className}>
      {children}
    </div>
  );
};

export const ConsentBadge = ({ yes }: { yes: boolean }) => {
  const status = yes ? 'completed' : 'missing';
  return <StatusBadge status={status as any} label={yes ? 'Yes' : 'No'} />;
};

export const ClinicianTag: React.FC<{ name: string }> = ({ name }) => (
  <StatusBadge status="clinician" label={name} className="normal-case" />
);

export function SignalBox({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="border border-slate-100 rounded-lg p-2.5 bg-white shadow-sm">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Candidate Signal</div>
        <div className="text-sm text-slate-900 font-normal">{title}</div>
      </div>
      <div className="border border-slate-100 rounded-lg p-2.5 bg-white shadow-sm">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Signal Description</div>
        <div className="text-sm text-slate-900 leading-relaxed min-h-[60px]">{description}</div>
      </div>
    </div>
  );
}
