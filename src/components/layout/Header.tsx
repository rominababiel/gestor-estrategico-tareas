import { Button } from '../ui/Button';
import { APP_NAME, BrandMark } from './Brand';
import styles from './Header.module.css';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function Header({ userEmail, onLogout, isLoggingOut }: HeaderProps) {
  return (
    <header className={styles.header}>
      <BrandMark className={styles.mark} />
      <div className={styles.identity}>
        <span className={styles.name}>{APP_NAME}</span>
        {userEmail && <span className={styles.email}>{userEmail}</span>}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className={styles.logout}
        onClick={onLogout}
        isLoading={isLoggingOut}
        loadingText="Cerrando…"
      >
        Cerrar sesión
      </Button>
    </header>
  );
}
