import type { SummaryTask } from './tasks.js';

export interface SummaryEmail {
  subject: string;
  html: string;
  text: string;
}

const APP_NAME = 'Gestor de Tareas';
const FOOTER =
  'Recibiste este email porque pediste un resumen desde Gestor de Tareas. Si no fuiste vos, podés ignorarlo.';

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function formatSummaryDate(date: Date): string {
  const parts = dateFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${get('day')} ${get('month').replace('.', '')} ${get('year')}, ${get('hour')}:${get('minute')}`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

function sortForSummary(tasks: SummaryTask[]): SummaryTask[] {
  return [...tasks.filter((task) => !task.completed), ...tasks.filter((task) => task.completed)];
}

function totalBox(value: number, label: string, highlighted = false): string {
  const background = highlighted ? '#e2edf0' : '#f3f2ef';
  const color = highlighted ? '#1f4654' : '#1a1a19';
  const labelColor = highlighted ? '#1f4654' : '#5e5c57';

  return `<td width="33%" style="background:${background};border-radius:12px;padding:14px;text-align:center"><div style="font-size:26px;font-weight:bold;color:${color}">${value}</div><div style="font-size:13px;color:${labelColor}">${label}</div></td>`;
}

function taskRow(task: SummaryTask): string {
  const label = task.completed
    ? '<div style="font-size:12px;font-weight:bold;color:#2e6a80;letter-spacing:.04em">✓ COMPLETADA</div>'
    : '<div style="font-size:12px;font-weight:bold;color:#5e5c57;letter-spacing:.04em">PENDIENTE</div>';
  const titleStyle = task.completed
    ? 'font-size:16px;padding-top:4px;color:#5e5c57;text-decoration:line-through'
    : 'font-size:16px;font-weight:bold;padding-top:4px';
  const description = task.description.trim()
    ? `<div style="font-size:14px;line-height:1.5;color:#45443f;padding-top:2px">${escapeHtml(task.description)}</div>`
    : '';

  return `<tr><td style="border-top:1px solid #e0ded8;padding:14px 0">${label}<div style="${titleStyle}">${escapeHtml(task.title)}</div>${description}</td></tr>`;
}

function buildHtml(tasks: SummaryTask[], pending: number, completed: number, date: string) {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#f3f2ef">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f2ef;padding:32px 12px">
<tr><td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;color:#1a1a19">
<tr><td style="padding:0 8px 20px;font-size:16px;font-weight:bold">● ${APP_NAME}</td></tr>
<tr><td style="background:#ffffff;border-radius:16px;padding:28px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
<tr><td style="font-size:24px;font-weight:bold;line-height:1.2;padding-bottom:8px">Hola, este es tu resumen</td></tr>
<tr><td style="font-size:15px;line-height:1.5;color:#5e5c57;padding-bottom:24px">Estas son tus tareas al ${date}.</td></tr>
<tr><td style="padding-bottom:24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:6px 0"><tr>${totalBox(tasks.length, 'Todas')}${totalBox(pending, 'Pendientes')}${totalBox(completed, 'Completadas', true)}</tr></table>
</td></tr>
${sortForSummary(tasks).map(taskRow).join('\n')}
</table>
</td></tr>
<tr><td style="padding:20px 8px 0;font-size:12px;line-height:1.5;color:#5e5c57">${FOOTER}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function textTask(task: SummaryTask): string {
  const line = `${task.completed ? '[x]' : '[ ]'} ${task.title}`;
  return task.description.trim() ? `${line}\n    ${task.description}` : line;
}

function buildText(tasks: SummaryTask[], pending: number, completed: number, date: string) {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const sections = [
    APP_NAME.toUpperCase(),
    'Hola, este es tu resumen.',
    `Estas son tus tareas al ${date}.`,
    `Todas: ${tasks.length} · Pendientes: ${pending} · Completadas: ${completed}`,
  ];

  if (pendingTasks.length > 0)
    sections.push(`PENDIENTES\n${pendingTasks.map(textTask).join('\n')}`);
  if (completedTasks.length > 0) {
    sections.push(`COMPLETADAS\n${completedTasks.map(textTask).join('\n')}`);
  }
  sections.push(`--\n${FOOTER}`);

  return sections.join('\n\n');
}

export function buildSummaryEmail(tasks: SummaryTask[], generatedAt: Date): SummaryEmail {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const date = formatSummaryDate(generatedAt);

  return {
    subject: `Tu resumen de tareas · ${pluralize(tasks.length, 'tarea', 'tareas')}, ${pluralize(pending, 'pendiente', 'pendientes')}`,
    html: buildHtml(tasks, pending, completed, date),
    text: buildText(tasks, pending, completed, date),
  };
}
