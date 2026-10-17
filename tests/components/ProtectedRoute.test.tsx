import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthContext } from '../../src/features/auth/AuthContext';
import { ProtectedRoute } from '../../src/routes/ProtectedRoute';
import type { AuthContextValue } from '../../src/types/auth';
import { buildAuthValue } from '../mocks/auth';

function renderAt(path: string, auth: AuthContextValue) {
  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <p>Mis tareas</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('ProtectedRoute', () => {
  it('shows a loader while the session is being checked', () => {
    renderAt('/tasks', buildAuthValue({ user: null, isLoading: true }));

    expect(screen.getByRole('status', { name: 'Verificando sesión' })).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument();
  });

  it('redirects to login without a session', () => {
    renderAt('/tasks', buildAuthValue({ user: null }));

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    expect(screen.queryByText('Mis tareas')).not.toBeInTheDocument();
  });

  it('shows the protected page with a session', () => {
    renderAt('/tasks', buildAuthValue());

    expect(screen.getByText('Mis tareas')).toBeInTheDocument();
  });
});
