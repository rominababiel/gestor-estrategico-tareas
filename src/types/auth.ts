export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export type Credentials = {
  email: string;
  password: string;
};

export type LoginFormValues = Credentials;

export type ForgotPasswordFormValues = {
  email: string;
};

export type RegisterFormValues = Credentials & {
  confirmPassword: string;
};

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}
