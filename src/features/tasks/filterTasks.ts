import type { Task, TaskCounts, TaskFilter } from '../../types/task';

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'pending':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    case 'all':
      return tasks;
  }
}

export function countTasks(tasks: Task[]): TaskCounts {
  const completed = tasks.filter((task) => task.completed).length;
  return { all: tasks.length, pending: tasks.length - completed, completed };
}
