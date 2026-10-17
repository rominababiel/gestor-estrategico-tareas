export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFormValues = {
  title: string;
  description: string;
};

export type TaskUpdate = Partial<Pick<Task, 'title' | 'description' | 'completed'>>;

export type TaskFilter = 'all' | 'pending' | 'completed';

export type TaskCounts = Record<TaskFilter, number>;
