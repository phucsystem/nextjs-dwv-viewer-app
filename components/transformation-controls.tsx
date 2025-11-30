'use client';

import React from 'react';
import { useImageState } from '@/hooks/use-image-state';
import { App } from 'dwv';

const COLORMAPS = ['grey', 'hot', 'rainbow', 'viridis'];

interface TransformationControlsProps {
  dwvApp: React.RefObject<App | null>;
}

export const TransformationControls: React.FC<TransformationControlsProps> = ({ dwvApp }) => {
  const { imageState, setColormap, rotate, flip, resetTransforms } = useImageState(dwvApp);

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => rotate('left')}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        title="Rotate left"
      >
        ↶
      </button>
      <button
        onClick={() => rotate('right')}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        title="Rotate right"
      >
        ↷
      </button>
      <button
        onClick={() => flip('horizontal')}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        title="Flip horizontal"
      >
        ⇄
      </button>
      <button
        onClick={() => flip('vertical')}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        title="Flip vertical"
      >
        ⇅
      </button>

      <select
        value={imageState.colormap}
        onChange={(e) => setColormap(e.target.value)}
        className="px-2 py-1 bg-gray-700 rounded text-sm"
      >
        {COLORMAPS.map(cm => (
          <option key={cm} value={cm}>
            {cm.charAt(0).toUpperCase() + cm.slice(1)}
          </option>
        ))}
      </select>

      <button
        onClick={resetTransforms}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        title="Reset transforms"
      >
        ⟲
      </button>

      <style jsx>{`
        #dwv-image {
          transform:
            rotate(${imageState.rotation}deg)
            scaleX(${imageState.flipH ? -1 : 1})
            scaleY(${imageState.flipV ? -1 : 1});
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
};
