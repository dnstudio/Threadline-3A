import React from 'react';
import { STATUS_CONFIG, TYPE_SCALE } from '../constants';

interface BadgeProps {
  status: keyof typeof STATUS_CONFIG;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, className = "", style, onClick }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['not-started'];
  
  return (
    <div 
      className={`px-2 py-0.5 rounded-md border inline-flex items-center justify-center ${className}`}
      onClick={onClick}
      style={{ 
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
        ...TYPE_SCALE.LabelMicro,
        textTransform: 'uppercase',
        ...style 
      }}
    >
      {label || config.label}
    </div>
  );
};
