import { useRef, useEffect } from 'react';
import * as dwv from 'dwv';

export const useDwvApp = () => {
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
          shape: ['Ruler', 'Protractor', 'Ellipse', 'Rectangle', 'FreeHand', 'Roi', 'Arrow']
        },
        Filter: {
          filter: ['Threshold', 'Sharpen', 'Smoothing', 'HistogramEqualization', 'Invert']
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

    return () => {
      dwvApp.current = null;
    };
  }, []);

  return dwvApp;
};
