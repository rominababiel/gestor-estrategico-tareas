import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTasks } from '../../src/hooks/useTasks';
import { TasksPage } from '../../src/pages/TasksPage';
import { sendTaskSummary, SummaryRequestError } from '../../src/services/emailService';
import { buildTask } from '../mocks/tasks';

vi.mock('../../src/hooks/useTasks', () => ({ useTasks: vi.fn() }));

vi.mock('../../src/services/emailService', () => ({
  sendTaskSummary: vi.fn(),
  SummaryRequestError: class SummaryRequestError extends Error {
    readonly code: string;
    constructor(code: string) {
      super(code);
      this.code = code;
    }
  },
}));

function mockTasks(tasks = [buildTask()]) {
  vi.mocked(useTasks).mockReturnValue({
    tasks,
    isLoading: false,
    error: null,
    createTask: vi.fn(),
    updateTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
    retry: vi.fn(),
  });
}

const getSummaryButton = () => screen.getByRole('button', { name: /Enviar resumen/ });

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Enviar resumen', () => {
  it('is disabled when there are no tasks', () => {
    mockTasks([]);
    render(<TasksPage />);

    expect(getSummaryButton()).toBeDisabled();
  });

  it('shows the confirmation after sending the summary', async () => {
    mockTasks([buildTask({ id: 'a' }), buildTask({ id: 'b' })]);
    vi.mocked(sendTaskSummary).mockResolvedValue({ sentTo: 'romi@example.com', taskCount: 2 });
    render(<TasksPage />);

    await userEvent.click(getSummaryButton());

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Te enviamos el resumen de tus 2 tareas a romi@example.com.',
    );
    expect(screen.getByRole('button', { name: 'Enviado' })).toBeInTheDocument();
  });

  it('hides the confirmation after a few seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockTasks();
    vi.mocked(sendTaskSummary).mockResolvedValue({ sentTo: 'romi@example.com', taskCount: 1 });
    render(<TasksPage />);

    await userEvent.click(getSummaryButton());
    await screen.findByText('Te enviamos el resumen de tu tarea a romi@example.com.');
    act(() => vi.advanceTimersByTime(6000));

    expect(
      screen.queryByText('Te enviamos el resumen de tu tarea a romi@example.com.'),
    ).not.toBeInTheDocument();
  });

  it('shows a readable error when the serverless function fails', async () => {
    mockTasks();
    vi.mocked(sendTaskSummary).mockRejectedValue(new SummaryRequestError('email-failed'));
    render(<TasksPage />);

    await userEvent.click(getSummaryButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos enviar el resumen. Probá de nuevo en unos minutos.',
    );
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('explains when the recipient is not enabled for sending', async () => {
    mockTasks();
    vi.mocked(sendTaskSummary).mockRejectedValue(new SummaryRequestError('recipient-not-allowed'));
    render(<TasksPage />);

    await userEvent.click(getSummaryButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Por ahora el envío solo está habilitado para emails autorizados.',
    );
  });

  it('asks to verify the email when the function rejects an unverified account', async () => {
    mockTasks();
    vi.mocked(sendTaskSummary).mockRejectedValue(new SummaryRequestError('email-not-verified'));
    render(<TasksPage />);

    await userEvent.click(getSummaryButton());

    expect(await screen.findByRole('alert')).toHaveTextContent('Primero verificá tu email');
  });
});
