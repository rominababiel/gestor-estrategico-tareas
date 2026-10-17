import { describe, expect, it } from 'vitest';
import { getRedirectPath } from '../../src/routes/redirect';
import { formatDate } from '../../src/utils/formatDate';

describe('formatDate', () => {
  it('formats as day, short month and year', () => {
    expect(formatDate(new Date(2026, 9, 17))).toBe('17 oct 2026');
  });
});

describe('getRedirectPath', () => {
  it('returns the protected route the user tried to open', () => {
    expect(getRedirectPath({ from: '/tasks?filter=pending' })).toBe('/tasks?filter=pending');
  });

  it('ignores external URLs', () => {
    expect(getRedirectPath({ from: 'https://evil.example.com' })).toBe('/tasks');
  });

  it('ignores protocol-relative URLs', () => {
    expect(getRedirectPath({ from: '//evil.example.com' })).toBe('/tasks');
  });

  it('ignores public-only routes', () => {
    expect(getRedirectPath({ from: '/login' })).toBe('/tasks');
  });

  it('defaults to tasks without state', () => {
    expect(getRedirectPath(null)).toBe('/tasks');
  });
});
