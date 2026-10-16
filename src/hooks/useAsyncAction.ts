import { useCallback, useState } from 'react';
import type { AsyncStatus } from '../types/async';

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
  getErrorMessage: (error: unknown) => string,
) {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setStatus('loading');
      setError(null);

      try {
        await action(...args);
        setStatus('success');
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
        setStatus('error');
      }
    },
    [action, getErrorMessage],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { execute, reset, status, error, isLoading: status === 'loading' };
}
