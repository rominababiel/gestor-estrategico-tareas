import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TodoForm } from '../../src/components/tasks/TodoForm';

describe('TodoForm', () => {
  it('does not submit an empty task and shows the error', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar tarea' }));

    expect(screen.getByText('El título es obligatorio.')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit a title with only spaces', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Título'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar tarea' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the values and clears the form', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Título'), 'Comprar pan');
    await userEvent.type(screen.getByLabelText('Descripción'), 'Integral');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar tarea' }));

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Comprar pan', description: 'Integral' });
    expect(screen.getByLabelText('Título')).toHaveValue('');
    expect(screen.getByLabelText('Descripción')).toHaveValue('');
  });

  it('clears the field error when the user types', async () => {
    render(<TodoForm onSubmit={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Agregar tarea' }));
    await userEvent.type(screen.getByLabelText('Título'), 'A');

    expect(screen.queryByText('El título es obligatorio.')).not.toBeInTheDocument();
  });

  it('shows a readable error when saving fails and keeps the values', async () => {
    const onSubmit = vi.fn().mockRejectedValue({ code: 'permission-denied' });
    render(<TodoForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Título'), 'Comprar pan');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar tarea' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No tenés permiso para realizar esta acción.',
    );
    expect(screen.getByLabelText('Título')).toHaveValue('Comprar pan');
  });

  it('edits an existing task and allows cancelling', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();
    render(
      <TodoForm
        initialValues={{ title: 'Comprar pan', description: '' }}
        submitLabel="Guardar"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const title = screen.getByLabelText('Título');
    await userEvent.clear(title);
    await userEvent.type(title, 'Comprar facturas');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Comprar facturas', description: '' });

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
