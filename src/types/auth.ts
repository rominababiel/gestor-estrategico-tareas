export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type Credentials = {
  email: string;
  password: string;
};

export type LoginFormValues = Credentials;

export type RegisterFormValues = Credentials & {
  confirmPassword: string;
};

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}
