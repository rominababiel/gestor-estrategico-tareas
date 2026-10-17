export class MissingConfigError extends Error {
  constructor(names: string[]) {
    super(`Missing server environment variables: ${names.join(', ')}`);
    this.name = 'MissingConfigError';
  }
}

export function requireEnv<const T extends string>(names: readonly T[]): Record<T, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new MissingConfigError(missing);

  return Object.fromEntries(names.map((name) => [name, process.env[name]])) as Record<T, string>;
}
