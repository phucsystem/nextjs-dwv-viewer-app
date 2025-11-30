import { useState, useCallback } from 'react';

export const useDwvLoading = () => {
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
    setLoadProgress(0);
  }, []);

  const handleLoadProgress = useCallback((progress: number) => {
    setLoadProgress(progress);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    setLoadProgress(100);
  }, []);

  const handleError = useCallback((errorMsg: string) => {
    setLoading(false);
    setError(errorMsg);
  }, []);

  const resetLoading = useCallback(() => {
    setLoading(false);
    setLoadProgress(0);
    setError(null);
  }, []);

  return {
    loading,
    loadProgress,
    error,
    handleLoadStart,
    handleLoadProgress,
    handleLoadEnd,
    handleError,
    resetLoading
  };
};
