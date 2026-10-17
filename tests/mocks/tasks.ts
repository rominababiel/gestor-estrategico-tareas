import type { Task } from '../../src/types/task';

export function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    userId: 'user-1',
    title: 'Comprar pan',
    description: 'Integral',
    completed: false,
    createdAt: new Date(2026, 9, 17),
    updatedAt: new Date(2026, 9, 17),
    ...overrides,
  };
}
