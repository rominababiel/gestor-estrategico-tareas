import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/auth/AuthCard';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { LoginForm } from '../components/auth/LoginForm';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { ROUTES } from '../routes/paths';
import type { LoginFormValues } from '../types/auth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleSignIn = useGoogleSignIn();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);
    navigate(ROUTES.tasks, { replace: true });
  };

  return (
    <AuthCard
      title="Iniciar sesión"
      subtitle="Accedé a tus tareas"
      footer={
        <>
          ¿No tenés cuenta? <Link to={ROUTES.register}>Registrate</Link>
        </>
      }
    >
      <LoginForm onSubmit={handleLogin} />
      {googleSignIn.error && <Alert>{googleSignIn.error}</Alert>}
      <GoogleSignInButton onClick={googleSignIn.execute} isLoading={googleSignIn.isLoading} />
    </AuthCard>
  );
}
