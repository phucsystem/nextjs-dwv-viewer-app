'use client';

import { useEffect, useRef, useState } from 'react';
import * as dwv from 'dwv';

const TOOL_GROUPS = {
  Navigation: [
    { id: 'WindowLevel', label: 'W/L' },
    { id: 'ZoomAndPan', label: 'Zoom/Pan' },
    { id: 'Scroll', label: 'Scroll' }
  ],
  Draw: [
    { id: 'Ruler', label: 'Ruler' },
    { id: 'Protractor', label: 'Angle' },
    { id: 'Ellipse', label: 'Ellipse' },
    { id: 'Rectangle', label: 'Rectangle' },
    { id: 'FreeHand', label: 'Freehand' },
    { id: 'Roi', label: 'ROI' },
    { id: 'Arrow', label: 'Arrow' }
  ],
  Filters: [
    { id: 'Threshold', label: 'Threshold' },
    { id: 'Sharpen', label: 'Sharpen' },
    { id: 'Smoothing', label: 'Smooth' },
    { id: 'Invert', label: 'Invert' },
    { id: 'HistogramEqualization', label: 'Histogram' }
  ]
};

const DwvViewer = () => {
  const [currentTool, setCurrentTool] = useState('WindowLevel');
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const dwvApp = useRef<dwv.App | null>(null);

  useEffect(() => {
    const app = new dwv.App();
    dwvApp.current = app;

    const options = {
      tools: {
        Scroll: {},
        ZoomAndPan: {},
        WindowLevel: {},
        Draw: {
          shape: [
            'Ruler',
            'Protractor',
            'Ellipse',
            'Rectangle',
            'FreeHand',
            'Roi',
            'Arrow'
          ]
        },
        Filter: {
          filter: [
            'Threshold',
            'Sharpen',
            'Smoothing',
            'HistogramEqualization',
            'Invert'
          ]
        }
      },
      dataViewConfigs: {
        '*': [{
          divId: 'dwv-image',
          layers: ['image', 'draw', 'info'],
          orientationMarkers: true,
          scaleBar: true
        }]
      }
    };

    app.init(options);
    app.setTool('WindowLevel');

    const handleLoadStart = () => {
      setLoading(true);
      setError(null);
    };

    const handleLoadProgress = (e: dwv.LoadProgressEvent) => {
      setLoadProgress(e.loaded);
    };

    const handleLoadEnd = () => {
      setLoading(false);
      app.render();
    };

    const handleError = (e: dwv.ErrorEvent) => {
      setLoading(false);
      setError(e.error?.message || 'Failed to load DICOM');
    };

    app.addEventListener('load-start', handleLoadStart);
    app.addEventListener('load-progress', handleLoadProgress);
    app.addEventListener('load-end', handleLoadEnd);
    app.addEventListener('error', handleError);

    const url = 'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm';
    app.loadURLs([url]);

    return () => {
      app.removeEventListener('load-start', handleLoadStart);
      app.removeEventListener('load-progress', handleLoadProgress);
      app.removeEventListener('load-end', handleLoadEnd);
      app.removeEventListener('error', handleError);
      dwvApp.current = null;
    };
  }, []);

  const activateTool = (tool: string) => {
    if (!dwvApp.current) return;
    try {
      dwvApp.current.setTool(tool);
      setCurrentTool(tool);
    } catch (err) {
      console.warn('Tool error:', err);
    }
  };

  const handleUndo = () => dwvApp.current?.undo?.();
  const handleRedo = () => dwvApp.current?.redo?.();
  const handleReset = () => dwvApp.current?.reset?.();

  const handleLoadExample = () => {
    if (dwvApp.current) {
      const url = 'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm';
      dwvApp.current.loadURLs([url]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-4">DWV Viewer (Full Toolbar)</h2>

        <div className="bg-gray-800 p-3 rounded-lg shadow-lg mb-4 flex flex-wrap gap-6">

          <div className="flex gap-3 items-center">
            <span className="font-semibold text-gray-300">Tools:</span>
            {TOOL_GROUPS.Navigation.map(t => (
              <button
                key={t.id}
                onClick={() => activateTool(t.id)}
                className={`px-3 py-1 rounded ${currentTool === t.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <span className="font-semibold text-gray-300">Draw:</span>
            {TOOL_GROUPS.Draw.map(t => (
              <button
                key={t.id}
                onClick={() => activateTool('Draw:' + t.id)}
                className={`px-3 py-1 rounded ${currentTool === 'Draw:' + t.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <span className="font-semibold text-gray-300">Filters:</span>
            {TOOL_GROUPS.Filters.map(t => (
              <button
                key={t.id}
                onClick={() => activateTool('Filter:' + t.id)}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center ml-auto">
            <button onClick={handleLoadExample} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded">Load Example</button>
            <button onClick={handleUndo} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Undo</button>
            <button onClick={handleRedo} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Redo</button>
            <button onClick={handleReset} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded">Reset</button>
          </div>

        </div>

        <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700 h-[700px]">

          {loading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10">
              <p>Loading DICOM…</p>
              <div className="w-64 bg-gray-700 h-2 rounded mt-3">
                <div className="h-full bg-blue-500" style={{ width: `${loadProgress}%` }} />
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 text-red-400 p-6 text-center">
              {error}
            </div>
          )}

          <div id="dwv-image" className="w-full h-full"></div>

        </div>

      </div>
    </div>
  );
};

export default DwvViewer;
