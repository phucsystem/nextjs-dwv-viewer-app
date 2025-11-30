import { useState, useEffect, useCallback } from 'react';
import { App } from 'dwv';

interface ImageState {
  zoom: number;
  windowCenter: number;
  windowWidth: number;
  rotation: number; // degrees: 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  colormap: string;
}

export const useImageState = (dwvApp: React.RefObject<App | null>) => {
  const [imageState, setImageState] = useState<ImageState>({
    zoom: 100,
    windowCenter: 0,
    windowWidth: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    colormap: 'grey'
  });

  useEffect(() => {
    if (!dwvApp.current) return;

    const app = dwvApp.current;

    const handleZoomChange = (event: any) => {
      setImageState(prev => ({ ...prev, zoom: Math.round(event.zoom * 100) }));
    };

    const handleWLChange = (event: any) => {
      setImageState(prev => ({
        ...prev,
        windowCenter: Math.round(event.wc),
        windowWidth: Math.round(event.ww)
      }));
    };

    app.addEventListener('zoomchange', handleZoomChange);
    app.addEventListener('windowlevelchange', handleWLChange);

    return () => {
      app.removeEventListener('zoomchange', handleZoomChange);
      app.removeEventListener('windowlevelchange', handleWLChange);
    };
  }, [dwvApp]);

  const setColormap = useCallback((colormap: string) => {
    if (!dwvApp.current) return;
    dwvApp.current.setColourMap(colormap);
    setImageState(prev => ({ ...prev, colormap }));
  }, [dwvApp]);

  const rotate = useCallback((direction: 'left' | 'right') => {
    setImageState(prev => {
      const delta = direction === 'right' ? 90 : -90;
      return { ...prev, rotation: (prev.rotation + delta) % 360 };
    });
  }, []);

  const flip = useCallback((axis: 'horizontal' | 'vertical') => {
    setImageState(prev => ({
      ...prev,
      flipH: axis === 'horizontal' ? !prev.flipH : prev.flipH,
      flipV: axis === 'vertical' ? !prev.flipV : prev.flipV
    }));
  }, []);

  const resetTransforms = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      rotation: 0,
      flipH: false,
      flipV: false
    }));
  }, []);

  return {
    imageState,
    setColormap,
    rotate,
    flip,
    resetTransforms
  };
};
