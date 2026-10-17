import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { requireEnv } from './env.js';

export class EmailDeliveryError extends Error {
  constructor(cause: unknown) {
    super('SES could not send the email', { cause });
    this.name = 'EmailDeliveryError';
  }
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

let client: SESv2Client | null = null;

function getConfig() {
  return requireEnv(['SES_REGION', 'SES_ACCESS_KEY_ID', 'SES_SECRET_ACCESS_KEY', 'SES_FROM_EMAIL']);
}

function getClient(config: ReturnType<typeof getConfig>): SESv2Client {
  client ??= new SESv2Client({
    region: config.SES_REGION,
    credentials: {
      accessKeyId: config.SES_ACCESS_KEY_ID,
      secretAccessKey: config.SES_SECRET_ACCESS_KEY,
    },
  });
  return client;
}

export async function sendEmail({ to, subject, html, text }: EmailMessage): Promise<void> {
  const config = getConfig();
  const command = new SendEmailCommand({
    FromEmailAddress: `Gestor de Tareas <${config.SES_FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: html, Charset: 'UTF-8' },
          Text: { Data: text, Charset: 'UTF-8' },
        },
      },
    },
  });

  try {
    await getClient(config).send(command);
  } catch (error) {
    throw new EmailDeliveryError(error);
  }
}
