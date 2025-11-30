import { useState, useCallback } from 'react';
import { App } from 'dwv';

export const useDwvTools = (dwvApp: React.RefObject<App | null>) => {
  const [currentTool, setCurrentTool] = useState('WindowLevel');

  const activateTool = useCallback((tool: string) => {
    if (!dwvApp.current) return;

    try {
      dwvApp.current.setTool(tool);
      setCurrentTool(tool);
    } catch (err) {
      console.warn('Tool activation failed:', tool, err);
    }
  }, [dwvApp]);

  return { currentTool, activateTool };
};
