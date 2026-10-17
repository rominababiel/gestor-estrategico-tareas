import type { SummaryResult } from '../types/summary';
import { auth } from './firebase/auth';

const SEND_SUMMARY_ENDPOINT = '/api/send-summary';

export class SummaryRequestError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`Summary request failed: ${code}`);
    this.name = 'SummaryRequestError';
    this.code = code;
  }
}

function readErrorCode(body: unknown): string {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const { error } = body;
    if (typeof error === 'string') return error;
  }
  return 'unknown-error';
}

function isSummaryResult(body: unknown): body is SummaryResult {
  return (
    typeof body === 'object' &&
    body !== null &&
    'sentTo' in body &&
    typeof body.sentTo === 'string' &&
    'taskCount' in body &&
    typeof body.taskCount === 'number'
  );
}

export async function sendTaskSummary(): Promise<SummaryResult> {
  const user = auth.currentUser;
  if (!user) throw new SummaryRequestError('missing-token');

  const idToken = await user.getIdToken(true);

  let response: Response;
  try {
    response = await fetch(SEND_SUMMARY_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } catch {
    throw new SummaryRequestError('network-error');
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) throw new SummaryRequestError(readErrorCode(body));
  if (!isSummaryResult(body)) throw new SummaryRequestError('unknown-error');

  return body;
}
