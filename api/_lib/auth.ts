import { getAdminAuth } from './firebaseAdmin.js';

export class UnauthorizedError extends Error {
  constructor() {
    super('Invalid or expired ID token');
    this.name = 'UnauthorizedError';
  }
}

export interface VerifiedUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  const match = header?.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function verifyUser(idToken: string): Promise<VerifiedUser> {
  const adminAuth = getAdminAuth();

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: decoded.email_verified === true,
    };
  } catch {
    throw new UnauthorizedError();
  }
}
