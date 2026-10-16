import { Button } from '../ui/Button';
import styles from './Header.module.css';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function Header({ userEmail, onLogout, isLoggingOut }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <span className={styles.brand}>Gestor de tareas</span>
        <div className={styles.user}>
          {userEmail && <span className={styles.email}>{userEmail}</span>}
          <Button variant="ghost" onClick={onLogout} isLoading={isLoggingOut}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
