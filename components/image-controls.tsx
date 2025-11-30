'use client';

import React from 'react';
import { useImageState } from '@/hooks/use-image-state';
import { App } from 'dwv';

interface ImageControlsProps {
  dwvApp: React.RefObject<App | null>;
}

export const ImageControls: React.FC<ImageControlsProps> = ({ dwvApp }) => {
  const { imageState } = useImageState(dwvApp);

  return (
    <div className="flex gap-3 items-center text-sm">
      <div className="px-2 py-1 bg-gray-700 rounded">
        🔍 Zoom: {imageState.zoom}%
      </div>
      <div className="px-2 py-1 bg-gray-700 rounded">
        WC: {imageState.windowCenter}
      </div>
      <div className="px-2 py-1 bg-gray-700 rounded">
        WW: {imageState.windowWidth}
      </div>
    </div>
  );
};
