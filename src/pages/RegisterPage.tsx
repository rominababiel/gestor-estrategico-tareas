import { Link } from 'react-router-dom';
import { AuthCard } from '../components/auth/AuthCard';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { ROUTES } from '../routes/paths';
import type { RegisterFormValues } from '../types/auth';

export function RegisterPage() {
  const { register } = useAuth();
  const googleSignIn = useGoogleSignIn();

  const handleRegister = ({ email, password }: RegisterFormValues) => register({ email, password });

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Registrate para gestionar tus tareas"
      footer={
        <>
          ¿Ya tenés cuenta? <Link to={ROUTES.login}>Iniciá sesión</Link>
        </>
      }
    >
      <RegisterForm onSubmit={handleRegister} />
      {googleSignIn.error && <Alert>{googleSignIn.error}</Alert>}
      <GoogleSignInButton onClick={googleSignIn.execute} isLoading={googleSignIn.isLoading} />
    </AuthCard>
  );
}
