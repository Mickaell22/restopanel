import { dayLabel, groupOthers } from './charts';

describe('dayLabel', () => {
  it('formatea el dia civil sin correrlo de huso', () => {
    // Si esto se hiciera con `new Date('2026-07-01')`, en UTC-5 diria "30 jun".
    expect(dayLabel('2026-07-01')).toBe('1 jul');
    expect(dayLabel('2026-12-31')).toBe('31 dic');
  });
});

describe('groupOthers', () => {
  const item = (name: string, total: number) => ({ name, total });

  it('ordena por total y deja las categorias tal cual si entran', () => {
    const result = groupOthers([item('A', 10), item('B', 30)]);
    expect(result).toEqual([item('B', 30), item('A', 10)]);
  });

  it('agrupa la cola en "Otros" cuando sobra mas de una', () => {
    const result = groupOthers(
      [1, 2, 3, 4, 5, 6, 7].map((n) => item(`C${n}`, n * 10)),
    );
    expect(result.map((r) => r.name)).toEqual([
      'C7', 'C6', 'C5', 'C4', 'C3', 'Otros',
    ]);
    expect(result.at(-1)?.total).toBe(30); // 20 + 10
  });

  it('no crea un "Otros" de un solo elemento', () => {
    const result = groupOthers([1, 2, 3, 4, 5, 6].map((n) => item(`C${n}`, n)));
    expect(result).toHaveLength(6);
    expect(result.map((r) => r.name)).not.toContain('Otros');
  });

  it('redondea la suma de la cola a dos decimales', () => {
    const items = [
      item('A', 100), item('B', 90), item('C', 80), item('D', 70),
      item('E', 60), item('F', 0.1), item('G', 0.2),
    ];
    expect(groupOthers(items).at(-1)?.total).toBe(0.3);
  });
});
