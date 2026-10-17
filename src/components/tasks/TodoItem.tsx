import { useCallback, useState } from 'react';
import {
  getDeleteTaskErrorMessage,
  getSaveChangeErrorMessage,
} from '../../features/tasks/taskErrorMessages';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { Task, TaskFormValues } from '../../types/task';
import { formatDate } from '../../utils/formatDate';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Spinner } from '../ui/Spinner';
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
    getSaveChangeErrorMessage,
  );
  const remove = useAsyncAction(
    useCallback(() => onDelete(task.id), [onDelete, task.id]),
    getDeleteTaskErrorMessage,
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
      <li className={`${styles.item} ${styles.editing}`}>
        <TodoForm
          initialValues={{ title: task.title, description: task.description }}
          submitLabel="Guardar"
          submittingLabel="Guardando…"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  const classNames = [
    styles.item,
    task.completed && styles.completed,
    toggle.error && styles.hasError,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className={styles.check}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={toggle.execute}
          disabled={toggle.isLoading}
          aria-busy={toggle.isLoading || undefined}
          aria-label={`Marcar como ${task.completed ? 'pendiente' : 'completada'}: ${task.title}`}
        />
        <svg
          className={styles.checkIcon}
          width="13"
          height="13"
          viewBox="0 0 14 14"
          aria-hidden="true"
        >
          <polyline points="2.5,7.5 5.5,10.5 11.5,3.5" fill="none" strokeWidth="2.2" />
        </svg>
        {toggle.isLoading && (
          <span className={styles.toggling}>
            <Spinner size="md" />
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && <p className={styles.description}>{task.description}</p>}
        <div className={styles.footer}>
          <p className={styles.meta}>Creada el {formatDate(task.createdAt)}</p>
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button variant="dangerGhost" size="sm" onClick={() => setIsConfirmingDelete(true)}>
              Eliminar
            </Button>
          </div>
        </div>
        {toggle.error && <Alert className={styles.error}>{toggle.error}</Alert>}
      </div>
      <ConfirmDialog
        isOpen={isConfirmingDelete}
        title="Eliminar tarea"
        message={`¿Seguro que querés eliminar "${task.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmingLabel="Eliminando…"
        isConfirming={remove.isLoading}
        error={remove.error}
        onConfirm={remove.execute}
        onCancel={closeDeleteDialog}
      />
    </li>
  );
}
