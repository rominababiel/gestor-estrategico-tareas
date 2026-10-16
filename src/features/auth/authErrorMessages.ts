const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'El email o la contraseña son incorrectos.',
  'auth/invalid-login-credentials': 'El email o la contraseña son incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'El email o la contraseña son incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta registrada con ese email.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Esperá unos minutos e intentá de nuevo.',
  'auth/network-request-failed':
    'No hay conexión. Revisá tu conexión a internet e intentá de nuevo.',
  'auth/popup-closed-by-user':
    'Se cerró la ventana de Google antes de completar el inicio de sesión.',
  'auth/cancelled-popup-request':
    'Se cerró la ventana de Google antes de completar el inicio de sesión.',
  'auth/popup-blocked':
    'El navegador bloqueó la ventana de Google. Habilitá las ventanas emergentes.',
  'auth/account-exists-with-different-credential':
    'Ya existe una cuenta con ese email registrada con otro método de inicio de sesión.',
};

export const DEFAULT_AUTH_ERROR_MESSAGE = 'Ocurrió un error inesperado. Intentá de nuevo.';

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

export function getAuthErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  return (code && AUTH_ERROR_MESSAGES[code]) || DEFAULT_AUTH_ERROR_MESSAGE;
}
