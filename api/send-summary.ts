import { getBearerToken, UnauthorizedError, verifyUser } from './_lib/auth.js';
import { MissingConfigError } from './_lib/env.js';
import { json } from './_lib/http.js';
import { EmailDeliveryError, RecipientNotAllowedError, sendEmail } from './_lib/ses.js';
import { buildSummaryEmail } from './_lib/summaryEmail.js';
import { getUserTasks } from './_lib/tasks.js';

async function sendSummary(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'method-not-allowed' }, 405, { Allow: 'POST' });
  }

  const idToken = getBearerToken(request);
  if (!idToken) return json({ error: 'missing-token' }, 401);

  try {
    const user = await verifyUser(idToken);
    if (!user.email || !user.emailVerified) return json({ error: 'email-not-verified' }, 403);

    const tasks = await getUserTasks(user.uid);
    if (tasks.length === 0) return json({ error: 'no-tasks' }, 400);

    await sendEmail({ to: user.email, ...buildSummaryEmail(tasks, new Date()) });

    return json({ sentTo: user.email, taskCount: tasks.length }, 200);
  } catch (error) {
    if (error instanceof UnauthorizedError) return json({ error: 'invalid-token' }, 401);

    console.error('send-summary failed:', error instanceof Error ? error.name : 'UnknownError');

    if (error instanceof MissingConfigError) return json({ error: 'server-misconfigured' }, 500);
    if (error instanceof RecipientNotAllowedError) {
      return json({ error: 'recipient-not-allowed' }, 403);
    }
    if (error instanceof EmailDeliveryError) return json({ error: 'email-failed' }, 502);
    return json({ error: 'internal-error' }, 500);
  }
}

export default { fetch: sendSummary };
