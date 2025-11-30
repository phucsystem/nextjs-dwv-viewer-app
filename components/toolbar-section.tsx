'use client';

import React, { ReactNode } from 'react';

interface ToolbarSectionProps {
  label: string;
  children: ReactNode;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({ label, children }) => {
  return (
    <div className="flex gap-3 items-center">
      <span className="font-semibold text-gray-300">{label}:</span>
      {children}
    </div>
  );
};
