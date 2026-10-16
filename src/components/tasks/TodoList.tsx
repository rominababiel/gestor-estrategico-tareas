import type { Task, TaskFormValues } from '../../types/task';
import { TodoItem } from './TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  tasks: Task[];
  emptyMessage: string;
  onToggle: (task: Task) => Promise<void>;
  onUpdate: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TodoList({ tasks, emptyMessage, onToggle, onUpdate, onDelete }: TodoListProps) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
