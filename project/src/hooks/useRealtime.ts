import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Patient } from '../lib/types';

export function useRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Polling is handled by react-query's refetchInterval
    // This hook can be used for future real-time features if needed
    return () => {
      // Cleanup if needed
    };
  }, [queryClient]);
}
