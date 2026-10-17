import { describe, expect, it } from 'vitest';
import { countTasks, filterTasks } from '../../src/features/tasks/filterTasks';
import { buildTask } from '../mocks/tasks';

const tasks = [
  buildTask({ id: 'a', completed: false }),
  buildTask({ id: 'b', completed: true }),
  buildTask({ id: 'c', completed: false }),
];

describe('filterTasks', () => {
  it('returns every task for "all"', () => {
    expect(filterTasks(tasks, 'all')).toHaveLength(3);
  });

  it('returns only pending tasks', () => {
    expect(filterTasks(tasks, 'pending').map((task) => task.id)).toEqual(['a', 'c']);
  });

  it('returns only completed tasks', () => {
    expect(filterTasks(tasks, 'completed').map((task) => task.id)).toEqual(['b']);
  });
});

describe('countTasks', () => {
  it('counts tasks by status', () => {
    expect(countTasks(tasks)).toEqual({ all: 3, pending: 2, completed: 1 });
  });

  it('returns zeros for an empty list', () => {
    expect(countTasks([])).toEqual({ all: 0, pending: 0, completed: 0 });
  });
});
