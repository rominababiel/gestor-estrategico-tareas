import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TasksPage } from '../pages/TasksPage';
import { ROUTES } from './paths';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

const router = createBrowserRouter([
  { path: ROUTES.home, element: <Navigate to={ROUTES.tasks} replace /> },
  {
    path: ROUTES.login,
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: ROUTES.register,
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ path: ROUTES.tasks, element: <TasksPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
