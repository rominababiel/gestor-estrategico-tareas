import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from '../../src/components/tasks/TodoList';
import type { Task } from '../../src/types/task';
import { buildTask } from '../mocks/tasks';

function renderList(tasks: Task[], handlers: Partial<Parameters<typeof TodoList>[0]> = {}) {
  const props = {
    tasks,
    emptyMessage: 'Todavía no tenés tareas.',
    onToggle: vi.fn().mockResolvedValue(undefined),
    onUpdate: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
    ...handlers,
  };
  render(<TodoList {...props} />);
  return props;
}

describe('TodoList', () => {
  it('shows the empty message when there are no tasks', () => {
    renderList([]);

    expect(screen.getByText('Todavía no tenés tareas.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders every task with its title, description and date', () => {
    renderList([
      buildTask({ id: 'a', title: 'Comprar pan', description: 'Integral' }),
      buildTask({ id: 'b', title: 'Estudiar', description: '' }),
    ]);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Comprar pan')).toBeInTheDocument();
    expect(screen.getByText('Integral')).toBeInTheDocument();
    expect(screen.getAllByText('Creada el 17 oct 2026')).toHaveLength(2);
  });

  it('marks a task as completed', async () => {
    const task = buildTask();
    const { onToggle } = renderList([task]);

    await userEvent.click(screen.getByRole('checkbox', { name: /Marcar como completada/ }));

    expect(onToggle).toHaveBeenCalledWith(task);
  });

  it('shows completed tasks as checked', () => {
    renderList([buildTask({ completed: true })]);

    expect(screen.getByRole('checkbox', { name: /Marcar como pendiente/ })).toBeChecked();
  });

  it('asks for confirmation before deleting', async () => {
    const { onDelete } = renderList([buildTask()]);

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    const dialog = screen.getByRole('dialog', { name: 'Eliminar tarea' });

    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Eliminar' }));
    expect(onDelete).toHaveBeenCalledWith('task-1');
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const { onDelete } = renderList([buildTask()]);

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }),
    );

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the error inside the dialog when deleting fails', async () => {
    renderList([buildTask()], { onDelete: vi.fn().mockRejectedValue({ code: 'unavailable' }) });

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    const dialog = screen.getByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'No pudimos eliminar la tarea. Probá de nuevo.',
    );
  });

  it('edits a task inline', async () => {
    const { onUpdate } = renderList([buildTask({ title: 'Comprar pan' })]);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    const title = screen.getByLabelText('Título');
    await userEvent.clear(title);
    await userEvent.type(title, 'Comprar facturas');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onUpdate).toHaveBeenCalledWith('task-1', {
      title: 'Comprar facturas',
      description: 'Integral',
    });
  });
});
