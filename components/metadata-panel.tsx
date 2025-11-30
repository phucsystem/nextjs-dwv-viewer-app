'use client';

import React, { useEffect, useState } from 'react';
import { useDwvContext } from '@/contexts/dwv-context';

interface MetadataPanelProps {
  visible: boolean;
  onClose: () => void;
}

interface DicomMetadata {
  patientName?: string;
  patientID?: string;
  studyDate?: string;
  modality?: string;
  rows?: number;
  columns?: number;
  pixelSpacing?: string;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ visible, onClose }) => {
  const { dwvApp } = useDwvContext();
  const [metadata, setMetadata] = useState<DicomMetadata>({});

  useEffect(() => {
    if (!visible || !dwvApp.current) return;

    try {
      const meta = dwvApp.current.getMeta?.();
      if (meta) {
        setMetadata({
          patientName: meta.PatientName || 'N/A',
          patientID: meta.PatientID || 'N/A',
          studyDate: meta.StudyDate || 'N/A',
          modality: meta.Modality || 'N/A',
          rows: meta.Rows,
          columns: meta.Columns,
          pixelSpacing: meta.PixelSpacing?.join(', ') || 'N/A'
        });
      }
    } catch (err) {
      console.error('Failed to get metadata:', err);
    }
  }, [visible, dwvApp]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (visible) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">DICOM Metadata</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Patient Name:</span>
            <span>{metadata.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Patient ID:</span>
            <span>{metadata.patientID}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Study Date:</span>
            <span>{metadata.studyDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Modality:</span>
            <span>{metadata.modality}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dimensions:</span>
            <span>{metadata.rows} × {metadata.columns}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pixel Spacing:</span>
            <span>{metadata.pixelSpacing}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
