import React from 'react';
import { primaryBtn, outlineBtn } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  icon, 
  children, 
  style,
  ...props 
}) => {
  const baseStyle = variant === 'primary' ? primaryBtn : outlineBtn;
  
  const ghostStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background 0.2s',
  };

  const finalStyle = {
    ...(variant === 'ghost' ? ghostStyle : baseStyle),
    ...style,
  };

  return (
    <button style={finalStyle} {...props}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};
