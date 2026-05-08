import React from 'react';
import { cardStyle, cardHeaderStyle, cardContentStyle, h1SmallStyle } from '../constants';

interface CardProps {
  title?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  headerAction, 
  children, 
  className = "", 
  style,
  noPadding = false
}) => {
  return (
    <div style={{ ...cardStyle, ...style }} className={className}>
      {title && (
        <div style={cardHeaderStyle}>
          <h2 style={h1SmallStyle}>{title}</h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div style={noPadding ? {} : cardContentStyle}>
        {children}
      </div>
    </div>
  );
};
