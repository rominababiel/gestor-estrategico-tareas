import { AuthProvider } from './features/auth/AuthProvider';
import { AppRouter } from './routes/AppRouter';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
