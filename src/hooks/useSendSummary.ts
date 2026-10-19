import { useCallback, useEffect, useState } from 'react';
import {
  getSummaryErrorMessage,
  isRetryableSummaryError,
} from '../features/email/summaryErrorMessages';
import { sendTaskSummary } from '../services/emailService';
import type { SummaryResult } from '../types/summary';
import { useAsyncAction } from './useAsyncAction';

export const SUMMARY_FEEDBACK_DURATION_MS = 6000;

export function useSendSummary() {
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [canRetry, setCanRetry] = useState(true);

  const send = useCallback(async () => {
    try {
      setResult(await sendTaskSummary());
    } catch (error) {
      setCanRetry(isRetryableSummaryError(error));
      throw error;
    }
  }, []);

  const { execute, reset, status, error, isLoading } = useAsyncAction(send, getSummaryErrorMessage);

  useEffect(() => {
    if (status !== 'success') return;

    const timeoutId = window.setTimeout(reset, SUMMARY_FEEDBACK_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [status, reset]);

  return {
    send: execute,
    status,
    error,
    canRetry,
    isSending: isLoading,
    result: status === 'success' ? result : null,
  };
}
