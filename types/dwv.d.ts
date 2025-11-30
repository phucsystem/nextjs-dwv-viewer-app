declare module 'dwv' {
  export type LoadStartEvent = { type: 'load-start' };
  export type LoadProgressEvent = { type: 'load-progress'; loaded: number };
  export type LoadEndEvent = { type: 'load-end' };
  export type ErrorEvent = {
    type: 'error';
    error?: { message?: string };
  };

  export type ZoomChangeEvent = { type: 'zoomchange'; zoom: number };
  export type WindowLevelChangeEvent = { type: 'windowlevelchange'; wc: number; ww: number };

  export type DwvEventMap = {
    'load-start': LoadStartEvent;
    'load-progress': LoadProgressEvent;
    'load-end': LoadEndEvent;
    error: ErrorEvent;
    zoomchange: ZoomChangeEvent;
    windowlevelchange: WindowLevelChangeEvent;
  };

  export class App {
    constructor(args?: unknown);
    init(options: unknown): void;
    setTool(name: string): void;
    setColourMap(name: string): void;
    addEventListener<K extends keyof DwvEventMap>(
      type: K,
      callback: (event: DwvEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof DwvEventMap>(
      type: K,
      callback: (event: DwvEventMap[K]) => void
    ): void;
    loadURLs(urls: string[]): void;
    loadFiles(files: File[]): void;
    render(): void;
    undo(): void;
    redo(): void;
    reset(): void;
    deleteDraws(): void;
    getMeta(): DicomMetadata;
    getLayerGroup(): LayerGroup;
  }

  export class LayerGroup {
    getActiveDrawLayer(): Layer | null;
  }

  export class Layer {
    setVisible(visible: boolean): void;
  }

  export interface DicomMetadata {
    PatientName?: string;
    PatientID?: string;
    StudyDate?: string;
    Modality?: string;
    Rows?: number;
    Columns?: number;
    PixelSpacing?: number[];
    [key: string]: unknown;
  }
}
