export type FormValues = Record<string, string>;

export type FormErrors<T extends FormValues> = Partial<Record<keyof T, string>>;
