import { Outlet } from 'react-router-dom';
import { getAuthErrorMessage } from '../../features/auth/authErrorMessages';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useAuth } from '../../hooks/useAuth';
import { EmailVerificationNotice } from '../auth/EmailVerificationNotice';
import { Alert } from '../ui/Alert';
import { Header } from './Header';
import styles from './Layout.module.css';

export function Layout() {
  const { user, logout, sendVerificationEmail, refreshUser } = useAuth();
  const logoutAction = useAsyncAction(logout, getAuthErrorMessage);

  return (
    <div className={styles.layout}>
      <Header
        userEmail={user?.email ?? null}
        onLogout={logoutAction.execute}
        isLoggingOut={logoutAction.isLoading}
      />
      <main className={styles.main}>
        {logoutAction.error && <Alert>{logoutAction.error}</Alert>}
        {user && !user.emailVerified && (
          <EmailVerificationNotice
            email={user.email}
            onResend={sendVerificationEmail}
            onRefresh={refreshUser}
          />
        )}
        <Outlet />
      </main>
    </div>
  );
}
