import { getAuthErrorMessage } from '../features/auth/authErrorMessages';
import { useAsyncAction } from './useAsyncAction';
import { useAuth } from './useAuth';

export function useGoogleSignIn() {
  const { loginWithGoogle } = useAuth();
  return useAsyncAction(loginWithGoogle, getAuthErrorMessage);
}
