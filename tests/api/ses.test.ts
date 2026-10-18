// @vitest-environment node
import { SESv2Client } from '@aws-sdk/client-sesv2';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailDeliveryError, RecipientNotAllowedError, sendEmail } from '../../api/_lib/ses.js';

const message = { to: 'romi@example.com', subject: 'Resumen', html: '<p>Hola</p>', text: 'Hola' };

function sesError(name: string, text: string) {
  return Object.assign(new Error(text), { name });
}

beforeEach(() => {
  vi.stubEnv('SES_REGION', 'us-east-1');
  vi.stubEnv('SES_ACCESS_KEY_ID', 'test-key');
  vi.stubEnv('SES_SECRET_ACCESS_KEY', 'test-secret');
  vi.stubEnv('SES_FROM_EMAIL', 'sender@example.com');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('sendEmail', () => {
  it('reports an unverified recipient as not allowed', async () => {
    vi.spyOn(SESv2Client.prototype, 'send').mockRejectedValue(
      sesError('MessageRejected', 'Email address is not verified.'),
    );

    await expect(sendEmail(message)).rejects.toBeInstanceOf(RecipientNotAllowedError);
  });

  it('reports any other SES failure as a delivery error', async () => {
    vi.spyOn(SESv2Client.prototype, 'send').mockRejectedValue(
      sesError('AccessDeniedException', 'Not authorized'),
    );

    await expect(sendEmail(message)).rejects.toBeInstanceOf(EmailDeliveryError);
  });
});
