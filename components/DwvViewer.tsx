'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as dwv from 'dwv';

const DwvViewer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // dwv may not have complete TypeScript definitions, so we use any for the app instance
  const dwvApp = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // initialize app
    const app = new dwv.App();
    console.log('dwv exports:', Object.keys(dwv));
    dwvApp.current = app;

    // config options
    const options = {
      tools: {
        'Scroll': {},
        'ZoomAndPan': {},
        'WindowLevel': {}
      },
      dataViewConfigs: { '*': [{ divId: 'dwv-container' }] }
    };

    // initialize
    app.init(options);
    
    // set WindowLevel as default tool
    app.setTool('WindowLevel');

    // event listeners
    const handleLoadStart = () => {
      setLoading(true);
      setError(null);
    };

    const handleLoadProgress = (event: any) => {
      setLoadProgress(event.loaded);
    };

    const handleLoadEnd = () => {
      setLoading(false);
      console.log('Load complete');
      // Ensure the view is updated/rendered
      app.render();
    };

    const handleError = (event: any) => {
      setLoading(false);
      setError(event.error?.message || 'An error occurred while loading DICOM');
      console.error('Error loading DICOM:', event);
    };

    app.addEventListener('load-start', handleLoadStart);
    app.addEventListener('load-progress', handleLoadProgress);
    app.addEventListener('load-end', handleLoadEnd);
    app.addEventListener('error', handleError);

    // load DICOM file
    try {
      const sampleUrl = 'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm';
      app.loadURLs([sampleUrl]);
    } catch (err: any) {
      console.error('Load URLs error:', err);
      setError(err.message);
    }

    // cleanup
    return () => {
      if (dwvApp.current) {
        dwvApp.current.removeEventListener('load-start', handleLoadStart);
        dwvApp.current.removeEventListener('load-progress', handleLoadProgress);
        dwvApp.current.removeEventListener('load-end', handleLoadEnd);
        dwvApp.current.removeEventListener('error', handleError);
        // dwv doesn't strictly have a destroy method in all versions, but we clear the ref
        dwvApp.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-4xl mb-4 bg-gray-800 p-4 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-bold mb-2">DICOM Web Viewer</h2>
        <div className="flex gap-4 text-sm">
          <p>Current Tool: <span className="font-mono bg-gray-700 px-2 py-1 rounded">WindowLevel</span></p>
          <p className="text-gray-400">Drag on image to adjust brightness/contrast</p>
        </div>
      </div>

      <div className="relative w-full max-w-4xl h-[600px] bg-black border border-gray-700 rounded-lg overflow-hidden shadow-xl">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white">
            <div className="mb-2">Loading DICOM...</div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-400">{loadProgress}%</div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 text-red-500 p-4 text-center">
            <div>
              <p className="text-lg font-bold mb-2">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* DWV Container */}
        <div 
          id="dwv-container" 
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default DwvViewer;

