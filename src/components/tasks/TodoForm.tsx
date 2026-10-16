import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '../../features/tasks/taskConstraints';
import { getTaskErrorMessage } from '../../features/tasks/taskErrorMessages';
import { useForm } from '../../hooks/useForm';
import type { TaskFormValues } from '../../types/task';
import { validateTaskForm } from '../../utils/validators';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import styles from './TodoForm.module.css';

const EMPTY_TASK: TaskFormValues = { title: '', description: '' };

interface TodoFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialValues?: TaskFormValues;
  submitLabel?: string;
  onCancel?: () => void;
}

export function TodoForm({
  onSubmit,
  initialValues,
  submitLabel = 'Agregar tarea',
  onCancel,
}: TodoFormProps) {
  const isEditing = Boolean(initialValues);
  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: initialValues ?? EMPTY_TASK,
    validate: validateTaskForm,
    onSubmit,
    getErrorMessage: getTaskErrorMessage,
    resetOnSuccess: !isEditing,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}
      <Input
        label="Título"
        name="title"
        maxLength={TASK_TITLE_MAX_LENGTH}
        value={values.title}
        onChange={handleChange}
        error={errors.title}
      />
      <TextArea
        label="Descripción"
        name="description"
        maxLength={TASK_DESCRIPTION_MAX_LENGTH}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />
      <div className={styles.actions}>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
