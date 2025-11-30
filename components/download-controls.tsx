'use client';

import React, { useCallback } from 'react';
import { useDwvContext } from '@/contexts/dwv-context';

export const DownloadControls: React.FC = () => {
  const { dwvApp } = useDwvContext();

  const downloadImage = useCallback((format: 'png' | 'jpeg') => {
    const canvas = document.querySelector('#dwv-image canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `dicom-export-${timestamp}.${format}`;
    link.href = dataUrl;
    link.click();
  }, [dwvApp]);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => downloadImage('png')}
        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
      >
        📥 PNG
      </button>
      <button
        onClick={() => downloadImage('jpeg')}
        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
      >
        📥 JPEG
      </button>
    </div>
  );
};
