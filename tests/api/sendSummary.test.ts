// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthorizedError, verifyUser } from '../../api/_lib/auth.js';
import { EmailDeliveryError, RecipientNotAllowedError, sendEmail } from '../../api/_lib/ses.js';
import { getUserTasks, type SummaryTask } from '../../api/_lib/tasks.js';
import handler from '../../api/send-summary.js';

vi.mock('../../api/_lib/auth.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/auth.js')>()),
  verifyUser: vi.fn(),
}));

vi.mock('../../api/_lib/ses.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/ses.js')>()),
  sendEmail: vi.fn(),
}));

vi.mock('../../api/_lib/tasks.js', () => ({ getUserTasks: vi.fn() }));

const verifiedUser = { uid: 'user-1', email: 'romi@example.com', emailVerified: true };
const tasks: SummaryTask[] = [
  { title: 'Comprar pan', description: '', completed: false, createdAt: new Date() },
];

function request(method = 'POST', token: string | null = 'valid-token') {
  return new Request('https://example.com/api/send-summary', {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

async function call(req: Request) {
  const response = await handler.fetch(req);
  return { status: response.status, body: await response.json() };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.mocked(verifyUser).mockResolvedValue(verifiedUser);
  vi.mocked(getUserTasks).mockResolvedValue(tasks);
  vi.mocked(sendEmail).mockResolvedValue(undefined);
});

describe('POST /api/send-summary', () => {
  it('rejects methods other than POST', async () => {
    const response = await handler.fetch(request('GET'));

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('rejects requests without a token', async () => {
    expect(await call(request('POST', null))).toEqual({
      status: 401,
      body: { error: 'missing-token' },
    });
    expect(verifyUser).not.toHaveBeenCalled();
  });

  it('rejects invalid tokens', async () => {
    vi.mocked(verifyUser).mockRejectedValue(new UnauthorizedError());

    expect(await call(request())).toEqual({ status: 401, body: { error: 'invalid-token' } });
  });

  it('rejects users without a verified email', async () => {
    vi.mocked(verifyUser).mockResolvedValue({ ...verifiedUser, emailVerified: false });

    expect(await call(request())).toEqual({ status: 403, body: { error: 'email-not-verified' } });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('rejects users without tasks', async () => {
    vi.mocked(getUserTasks).mockResolvedValue([]);

    expect(await call(request())).toEqual({ status: 400, body: { error: 'no-tasks' } });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('sends the summary to the email of the token', async () => {
    expect(await call(request())).toEqual({
      status: 200,
      body: { sentTo: 'romi@example.com', taskCount: 1 },
    });
    expect(getUserTasks).toHaveBeenCalledWith('user-1');
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'romi@example.com',
        subject: 'Tu resumen de tareas · 1 tarea, 1 pendiente',
      }),
    );
  });

  it('answers 502 without internal details when SES fails', async () => {
    vi.mocked(sendEmail).mockRejectedValue(new EmailDeliveryError(new Error('AccessDenied')));

    expect(await call(request())).toEqual({ status: 502, body: { error: 'email-failed' } });
  });

  it('answers 403 when the SES sandbox rejects the recipient', async () => {
    vi.mocked(sendEmail).mockRejectedValue(new RecipientNotAllowedError());

    expect(await call(request())).toEqual({
      status: 403,
      body: { error: 'recipient-not-allowed' },
    });
  });

  it('answers 500 for unexpected errors', async () => {
    vi.mocked(getUserTasks).mockRejectedValue(new Error('Firestore down'));

    expect(await call(request())).toEqual({ status: 500, body: { error: 'internal-error' } });
  });
});
