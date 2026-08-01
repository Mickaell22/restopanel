import { safeReturnUrl } from './login';

describe('safeReturnUrl', () => {
  it('respeta una ruta interna', () => {
    expect(safeReturnUrl('/ventas')).toBe('/ventas');
    expect(safeReturnUrl('/productos?q=cola')).toBe('/productos?q=cola');
  });

  it('cae al dashboard si no hay param', () => {
    // El binding de rutas escribe `undefined` cuando se entra a /login pelado.
    expect(safeReturnUrl(undefined)).toBe('/dashboard');
    expect(safeReturnUrl('')).toBe('/dashboard');
  });

  it('no redirige fuera del sitio', () => {
    expect(safeReturnUrl('//sitio.malo')).toBe('/dashboard');
    expect(safeReturnUrl('https://sitio.malo')).toBe('/dashboard');
    expect(safeReturnUrl('javascript:alert(1)')).toBe('/dashboard');
  });
});
