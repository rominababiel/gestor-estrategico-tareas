import { Link } from 'react-router-dom';
import { AuthCard } from '../components/auth/AuthCard';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { LoginForm } from '../components/auth/LoginForm';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { ROUTES } from '../routes/paths';

export function LoginPage() {
  const { login } = useAuth();
  const googleSignIn = useGoogleSignIn();

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
      <LoginForm onSubmit={login} />
      {googleSignIn.error && <Alert>{googleSignIn.error}</Alert>}
      <GoogleSignInButton onClick={googleSignIn.execute} isLoading={googleSignIn.isLoading} />
    </AuthCard>
  );
}
