import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('respeta la preferencia guardada por encima del sistema', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('sigue al sistema cuando nadie eligio todavia', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('ignora la basura que otra pestaña pudo dejar en el storage', () => {
    expect(resolveTheme('', true)).toBe('dark');
    expect(resolveTheme('DARK', false)).toBe('light');
    expect(resolveTheme('{"theme":"dark"}', false)).toBe('light');
  });
});
