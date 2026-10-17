import { Link } from 'react-router-dom';
import { AuthCard } from '../components/auth/AuthCard';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../routes/paths';

export function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();

  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Te enviamos un link para elegir una nueva"
      footer={<Link to={ROUTES.login}>Volver a iniciar sesión</Link>}
    >
      <ForgotPasswordForm onSubmit={sendPasswordReset} />
    </AuthCard>
  );
}
