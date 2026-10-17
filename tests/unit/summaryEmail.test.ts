// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildSummaryEmail, formatSummaryDate } from '../../api/_lib/summaryEmail.js';
import type { SummaryTask } from '../../api/_lib/tasks.js';

const createdAt = new Date('2026-10-17T12:00:00Z');
const tasks: SummaryTask[] = [
  { title: 'Renovar el DNI', description: '', completed: true, createdAt },
  {
    title: 'Pagar <expensas>',
    description: 'Antes del "20" & sin falta',
    completed: false,
    createdAt,
  },
  { title: 'Comprar regalo', description: '', completed: false, createdAt },
];
const generatedAt = new Date('2026-10-17T21:40:00Z');

describe('buildSummaryEmail', () => {
  it('includes the totals in the subject', () => {
    expect(buildSummaryEmail(tasks, generatedAt).subject).toBe(
      'Tu resumen de tareas · 3 tareas, 2 pendientes',
    );
  });

  it('escapes task content in the HTML', () => {
    const { html } = buildSummaryEmail(tasks, generatedAt);

    expect(html).toContain('Pagar &lt;expensas&gt;');
    expect(html).toContain('Antes del &quot;20&quot; &amp; sin falta');
    expect(html).not.toContain('<expensas>');
  });

  it('lists completed tasks after pending ones', () => {
    const { html, text } = buildSummaryEmail(tasks, generatedAt);

    expect(html.indexOf('Renovar el DNI')).toBeGreaterThan(html.indexOf('Comprar regalo'));
    expect(text.indexOf('[x] Renovar el DNI')).toBeGreaterThan(text.indexOf('[ ] Comprar regalo'));
  });

  it('builds a plain text version with the totals', () => {
    expect(buildSummaryEmail(tasks, generatedAt).text).toContain(
      'Todas: 3 · Pendientes: 2 · Completadas: 1',
    );
  });
});

describe('formatSummaryDate', () => {
  it('uses the Buenos Aires time zone', () => {
    expect(formatSummaryDate(generatedAt)).toBe('17 oct 2026, 18:40');
  });
});
