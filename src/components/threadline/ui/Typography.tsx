import React from 'react';
import { TYPE_SCALE, h1Style, subStyle } from '../constants';

interface TypographyProps {
  variant?: keyof typeof TYPE_SCALE | 'h1' | 'sub';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'BodyStandard', 
  children, 
  className = "", 
  style 
}) => {
  let baseStyle: React.CSSProperties = {};
  
  if (variant === 'h1') {
    baseStyle = h1Style;
  } else if (variant === 'sub') {
    baseStyle = subStyle;
  } else {
    baseStyle = TYPE_SCALE[variant as keyof typeof TYPE_SCALE] || TYPE_SCALE.BodyStandard;
  }

  const Tag = (variant === 'h1') ? 'h1' : 'div';

  return (
    <Tag style={{ ...baseStyle, ...style }} className={className}>
      {children}
    </Tag>
  );
};
