import React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// REGULATORY NOTE: This display standard is the test basis for Scenario S9-B (RISK-009). Do not change without updating the test protocol.

export type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const configs = {
    high: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle2,
      label: "High confidence"
    },
    medium: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      icon: AlertCircle,
      label: "Uncertain"
    },
    low: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: XCircle,
      label: "Low confidence"
    }
  };

  const { bg, text, icon: Icon, label } = configs[confidence];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}

export function mapScoreToConfidence(score: number): ConfidenceLevel {
  if (score >= 0.75) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}
