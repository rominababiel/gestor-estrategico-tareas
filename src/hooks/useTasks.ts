import { useCallback, useEffect, useState } from 'react';
import { getLoadTasksErrorMessage } from '../features/tasks/taskErrorMessages';
import {
  createTask as createTaskInService,
  deleteTask as deleteTaskInService,
  subscribeToUserTasks,
  updateTask as updateTaskInService,
} from '../services/taskService';
import type { Task, TaskFormValues } from '../types/task';
import { useAuth } from './useAuth';

interface TasksState {
  userId: string | null;
  attempt: number;
  tasks: Task[];
  error: string | null;
}

const INITIAL_STATE: TasksState = { userId: null, attempt: 0, tasks: [], error: null };

export function useTasks() {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [state, setState] = useState<TasksState>(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!userId) return;

    return subscribeToUserTasks(
      userId,
      (tasks) => setState({ userId, attempt, tasks, error: null }),
      (error) => setState({ userId, attempt, tasks: [], error: getLoadTasksErrorMessage(error) }),
    );
  }, [userId, attempt]);

  const retry = useCallback(() => setAttempt((previous) => previous + 1), []);

  const createTask = useCallback(
    async (values: TaskFormValues) => {
      if (!userId) throw new Error('Cannot create a task without an authenticated user');
      await createTaskInService(userId, values);
    },
    [userId],
  );

  const updateTask = useCallback(
    (taskId: string, values: TaskFormValues) => updateTaskInService(taskId, values),
    [],
  );

  const toggleTask = useCallback(
    (task: Task) => updateTaskInService(task.id, { completed: !task.completed }),
    [],
  );

  const deleteTask = useCallback((taskId: string) => deleteTaskInService(taskId), []);

  const isCurrentUserState = state.userId === userId && state.attempt === attempt;

  return {
    tasks: isCurrentUserState ? state.tasks : [],
    error: isCurrentUserState ? state.error : null,
    isLoading: Boolean(userId) && !isCurrentUserState,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    retry,
  };
}
