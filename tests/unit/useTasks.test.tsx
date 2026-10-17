import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../src/features/auth/AuthContext';
import { useTasks } from '../../src/hooks/useTasks';
import * as taskService from '../../src/services/taskService';
import type { Task } from '../../src/types/task';
import { buildAuthValue } from '../mocks/auth';
import { buildTask } from '../mocks/tasks';

vi.mock('../../src/services/taskService', () => ({
  subscribeToUserTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

const subscribe = vi.mocked(taskService.subscribeToUserTasks);
const unsubscribe = vi.fn();

let emitTasks: (tasks: Task[]) => void;
let emitError: (error: Error) => void;

function wrapper({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={buildAuthValue()}>{children}</AuthContext.Provider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  subscribe.mockImplementation((_userId, onChange, onError) => {
    emitTasks = onChange;
    emitError = onError;
    return unsubscribe;
  });
});

describe('useTasks', () => {
  it('subscribes to the tasks of the logged user and starts loading', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    expect(subscribe).toHaveBeenCalledWith('user-1', expect.any(Function), expect.any(Function));
    expect(result.current.isLoading).toBe(true);
  });

  it('exposes the tasks received from Firestore', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => emitTasks([buildTask()]));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tasks).toHaveLength(1);
  });

  it('shows a readable message when the subscription fails', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => emitError(Object.assign(new Error('offline'), { code: 'unavailable' })));

    expect(result.current.error).toBe(
      'No pudimos cargar tus tareas. Revisá tu conexión y probá de nuevo.',
    );
  });

  it('subscribes again when retrying', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => emitError(Object.assign(new Error('offline'), { code: 'unavailable' })));
    act(() => result.current.retry());

    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
  });

  it('cancels the subscription on unmount', () => {
    const { unmount } = renderHook(() => useTasks(), { wrapper });

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('creates tasks for the logged user', async () => {
    vi.mocked(taskService.createTask).mockResolvedValue(undefined);
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(() => result.current.createTask({ title: 'Nueva', description: '' }));

    expect(taskService.createTask).toHaveBeenCalledWith('user-1', {
      title: 'Nueva',
      description: '',
    });
  });

  it('toggles the completed state', async () => {
    vi.mocked(taskService.updateTask).mockResolvedValue(undefined);
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(() => result.current.toggleTask(buildTask({ completed: false })));

    expect(taskService.updateTask).toHaveBeenCalledWith('task-1', { completed: true });
  });
});
