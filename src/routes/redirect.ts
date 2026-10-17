import { ROUTES } from './paths';

const PUBLIC_ONLY_PATHS: readonly string[] = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];

export function getRedirectPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const { from } = state;
    if (
      typeof from === 'string' &&
      from.startsWith('/') &&
      !from.startsWith('//') &&
      !PUBLIC_ONLY_PATHS.includes(from)
    ) {
      return from;
    }
  }
  return ROUTES.tasks;
}
