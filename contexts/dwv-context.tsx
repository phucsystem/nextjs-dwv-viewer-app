'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { App } from 'dwv';
import { useDwvApp } from '@/hooks/use-dwv-app';
import { useDwvTools } from '@/hooks/use-dwv-tools';
import { useDwvLoading } from '@/hooks/use-dwv-loading';

interface DwvContextValue {
  dwvApp: React.RefObject<App | null>;
  currentTool: string;
  activateTool: (tool: string) => void;
  loading: boolean;
  loadProgress: number;
  error: string | null;
  handleLoadStart: () => void;
  handleLoadProgress: (progress: number) => void;
  handleLoadEnd: () => void;
  handleError: (errorMsg: string) => void;
  resetLoading: () => void;
}

const DwvContext = createContext<DwvContextValue | null>(null);

export const DwvProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dwvApp = useDwvApp();
  const { currentTool, activateTool } = useDwvTools(dwvApp);
  const loadingState = useDwvLoading();

  const value: DwvContextValue = {
    dwvApp,
    currentTool,
    activateTool,
    ...loadingState
  };

  return <DwvContext.Provider value={value}>{children}</DwvContext.Provider>;
};

export const useDwvContext = () => {
  const context = useContext(DwvContext);
  if (!context) {
    throw new Error('useDwvContext must be used within DwvProvider');
  }
  return context;
};
