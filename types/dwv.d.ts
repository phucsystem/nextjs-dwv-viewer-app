declare module 'dwv' {
  export type LoadStartEvent = { type: 'load-start' };
  export type LoadProgressEvent = { type: 'load-progress'; loaded: number };
  export type LoadEndEvent = { type: 'load-end' };
  export type ErrorEvent = {
    type: 'error';
    error?: { message?: string };
  };

  export type DwvEventMap = {
    'load-start': LoadStartEvent;
    'load-progress': LoadProgressEvent;
    'load-end': LoadEndEvent;
    error: ErrorEvent;
  };

  export class App {
    constructor(args?: unknown);
    init(options: unknown): void;
    setTool(name: string): void;
    addEventListener<K extends keyof DwvEventMap>(
      type: K,
      callback: (event: DwvEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof DwvEventMap>(
      type: K,
      callback: (event: DwvEventMap[K]) => void
    ): void;
    loadURLs(urls: string[]): void;
    render(): void;
  }
}
