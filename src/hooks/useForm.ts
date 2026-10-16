import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { FormErrors, FormValues } from '../types/form';
import { hasErrors } from '../utils/validators';

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
  onSubmit: (values: T) => Promise<void>;
  getErrorMessage: (error: unknown) => string;
  resetOnSuccess?: boolean;
}

export function useForm<T extends FormValues>({
  initialValues,
  validate,
  onSubmit,
  getErrorMessage,
  resetOnSuccess = false,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field: keyof T = event.target.name;
    const { value } = event.target;

    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(values);
      if (resetOnSuccess) setValues(initialValues);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, submitError, isSubmitting, handleChange, handleSubmit };
}
