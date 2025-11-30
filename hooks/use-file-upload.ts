import { useCallback, useState } from 'react';
import { App } from 'dwv';

interface UseFileUploadProps {
  dwvApp: React.RefObject<App | null>;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onError: (error: string) => void;
}

export const useFileUpload = ({
  dwvApp,
  onLoadStart,
  onLoadEnd,
  onError
}: UseFileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validateFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return null;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValid = file.name.endsWith('.dcm') ||
                     file.type === 'application/dicom';
      if (!isValid) {
        onError(`Invalid file: ${file.name} (expected .dcm)`);
      }
      return isValid;
    });

    return validFiles.length > 0 ? validFiles : null;
  }, [onError]);

  const loadFiles = useCallback((files: File[]) => {
    if (!dwvApp.current) {
      onError('DWV not initialized');
      return;
    }

    try {
      onLoadStart();
      setSelectedFiles(files);
      dwvApp.current.loadFiles(files);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to load files');
    }
  }, [dwvApp, onLoadStart, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles) {
      loadFiles(validFiles);
    }
  }, [validateFiles, loadFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = validateFiles(e.target.files);
    if (validFiles) {
      loadFiles(validFiles);
    }
  }, [validateFiles, loadFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return {
    isDragOver,
    selectedFiles,
    handleDrop,
    handleFileSelect,
    handleDragOver,
    handleDragLeave
  };
};
