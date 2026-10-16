import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TasksPage } from '../pages/TasksPage';
import { ROUTES } from './paths';

const router = createBrowserRouter([
  { path: ROUTES.home, element: <Navigate to={ROUTES.tasks} replace /> },
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.register, element: <RegisterPage /> },
  {
    element: <Layout />,
    children: [{ path: ROUTES.tasks, element: <TasksPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
