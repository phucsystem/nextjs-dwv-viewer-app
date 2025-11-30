'use client';

import React, { useState } from 'react';
import { useDwvContext } from '@/contexts/dwv-context';

export const LayerControls: React.FC = () => {
  const { dwvApp } = useDwvContext();
  const [layers, setLayers] = useState({
    image: true,
    draw: true,
    info: true
  });

  const toggleLayer = (layerName: 'image' | 'draw' | 'info') => {
    if (!dwvApp.current) return;

    const newState = !layers[layerName];
    setLayers(prev => ({ ...prev, [layerName]: newState }));

    // Get layer and toggle visibility
    const layerId = `${layerName}Layer`;
    const layer = dwvApp.current.getLayerGroup().getActiveDrawLayer?.();
    if (layer) {
      layer.setVisible(newState);
      dwvApp.current.render();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => toggleLayer('image')}
        className={`px-2 py-1 rounded text-sm ${
          layers.image ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        Image
      </button>
      <button
        onClick={() => toggleLayer('draw')}
        className={`px-2 py-1 rounded text-sm ${
          layers.draw ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        Draw
      </button>
      <button
        onClick={() => toggleLayer('info')}
        className={`px-2 py-1 rounded text-sm ${
          layers.info ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        Info
      </button>
    </div>
  );
};
