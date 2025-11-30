'use client';

import React, { useRef } from 'react';
import { useDwvContext } from '@/contexts/dwv-context';
import { useFileUpload } from '@/hooks/use-file-upload';

export const FileUpload: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { dwvApp, handleLoadStart, handleLoadEnd, handleError } = useDwvContext();

  const {
    isDragOver,
    selectedFiles,
    handleDrop,
    handleFileSelect,
    handleDragOver,
    handleDragLeave
  } = useFileUpload({
    dwvApp,
    onLoadStart: handleLoadStart,
    onLoadEnd: handleLoadEnd,
    onError: handleError
  });

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
        isDragOver ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".dcm,application/dicom"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center">
        <button
          onClick={handleBrowseClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Browse Files
        </button>
        <p className="mt-2 text-sm text-gray-400">
          or drag and drop DICOM files here
        </p>
        {selectedFiles.length > 0 && (
          <p className="mt-2 text-xs text-green-400">
            {selectedFiles.length} file(s) selected
          </p>
        )}
      </div>
    </div>
  );
};
