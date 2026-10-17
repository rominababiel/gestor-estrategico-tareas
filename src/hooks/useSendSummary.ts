import { useCallback, useEffect, useState } from 'react';
import { getSummaryErrorMessage } from '../features/email/summaryErrorMessages';
import { sendTaskSummary } from '../services/emailService';
import type { SummaryResult } from '../types/summary';
import { useAsyncAction } from './useAsyncAction';

export const SUMMARY_FEEDBACK_DURATION_MS = 6000;

export function useSendSummary() {
  const [result, setResult] = useState<SummaryResult | null>(null);

  const send = useCallback(async () => {
    setResult(await sendTaskSummary());
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
    isSending: isLoading,
    result: status === 'success' ? result : null,
  };
}
