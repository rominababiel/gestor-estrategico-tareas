import { vi } from 'vitest';
import type { AuthContextValue, AuthUser } from '../../src/types/auth';

export const testUser: AuthUser = {
  uid: 'user-1',
  email: 'romi@example.com',
  displayName: null,
  emailVerified: true,
};

export function buildAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: testUser,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    loginWithGoogle: vi.fn(),
    sendPasswordReset: vi.fn(),
    sendVerificationEmail: vi.fn(),
    refreshUser: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}
