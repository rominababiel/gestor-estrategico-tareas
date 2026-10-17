import { useCallback, useState } from 'react';
import { getTaskErrorMessage } from '../../features/tasks/taskErrorMessages';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { Task, TaskFormValues } from '../../types/task';
import { formatDate } from '../../utils/formatDate';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TodoForm } from './TodoForm';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  task: Task;
  onToggle: (task: Task) => Promise<void>;
  onUpdate: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TodoItem({ task, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const toggle = useAsyncAction(
    useCallback(() => onToggle(task), [onToggle, task]),
    getTaskErrorMessage,
  );
  const remove = useAsyncAction(
    useCallback(() => onDelete(task.id), [onDelete, task.id]),
    getTaskErrorMessage,
  );

  const closeDeleteDialog = () => {
    remove.reset();
    setIsConfirmingDelete(false);
  };

  const handleUpdate = async (values: TaskFormValues) => {
    await onUpdate(task.id, values);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className={styles.item}>
        <TodoForm
          initialValues={{ title: task.title, description: task.description }}
          submitLabel="Guardar"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`${styles.item} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.content}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={toggle.execute}
          disabled={toggle.isLoading}
          aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
        />
        <div className={styles.text}>
          <h3 className={styles.title}>{task.title}</h3>
          {task.description && <p className={styles.description}>{task.description}</p>}
          <p className={styles.meta}>Creada el {formatDate(task.createdAt)}</p>
        </div>
      </div>
      {toggle.error && <Alert>{toggle.error}</Alert>}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => setIsEditing(true)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => setIsConfirmingDelete(true)}>
          Eliminar
        </Button>
      </div>
      <ConfirmDialog
        isOpen={isConfirmingDelete}
        title="Eliminar tarea"
        message={`¿Seguro que querés eliminar "${task.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isConfirming={remove.isLoading}
        error={remove.error}
        onConfirm={remove.execute}
        onCancel={closeDeleteDialog}
      />
    </li>
  );
}
