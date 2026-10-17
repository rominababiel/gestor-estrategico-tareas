import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import type { AuthUser, Credentials } from '../types/auth';
import { auth } from './firebase/auth';

const googleProvider = new GoogleAuthProvider();

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
  };
}

function getCurrentUser(): User {
  if (!auth.currentUser) throw new Error('No authenticated user');
  return auth.currentUser;
}

export async function registerWithEmail({ email, password }: Credentials): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await sendEmailVerification(user).catch(() => undefined);
}

export async function loginWithEmail({ email, password }: Credentials): Promise<void> {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function loginWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider);
}

export function sendVerificationEmail(): Promise<void> {
  return sendEmailVerification(getCurrentUser());
}

export async function reloadCurrentUser(): Promise<AuthUser> {
  const user = getCurrentUser();
  await user.reload();
  return toAuthUser(user);
}

export function sendPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email.trim());
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => callback(user ? toAuthUser(user) : null));
}
