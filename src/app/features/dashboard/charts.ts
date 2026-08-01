import { ApexOptions } from 'apexcharts';

import { DashboardStats, PAYMENT_LABELS } from '../../core/models';

/**
 * Constructores de opciones de ApexCharts. Son funciones puras (datos ->
 * opciones) para poder probarlas sin montar un componente ni un canvas.
 *
 * Los colores del texto y las grillas NO se fijan aca: se pintan por CSS en
 * `styles.scss` con las variables del tema, asi el modo oscuro no obliga a
 * reconstruir las opciones de cada grafico.
 */

/** Un color por serie, en el mismo orden en todos los graficos. */
export const CHART_COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
];

// Ecuador factura en dolares, con el formato de miles/decimales de USD.
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Mismo formato de moneda en los graficos y en las tarjetas de KPI. */
export const formatMoney = (value: number) => money.format(value);

/** Para los ejes: $1.2K en vez de $1,234.56, que no entra sin superponerse. */
const shortMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const MONTHS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/**
 * 'YYYY-MM-DD' -> '22 jul'.
 *
 * A mano y no con `Date`: `new Date('2026-07-22')` se parsea como medianoche
 * UTC y al formatearlo en un huso negativo (Ecuador es UTC-5) la etiqueta
 * retrocede un dia. El backend ya mando el dia civil correcto; solo hay que
 * mostrarlo.
 */
export function dayLabel(isoDay: string): string {
  const [, month, day] = isoDay.split('-');
  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ''}`.trim();
}

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Deja como mucho `max` porciones y suma el resto en "Otros": una dona con
 * quince categorias no se lee.
 *
 * Si sobra una sola categoria no se agrupa -- "Otros" con un unico elemento
 * esconde su nombre sin ganar nada.
 */
export function groupOthers(
  items: readonly { name: string; total: number }[],
  max = 5,
): { name: string; total: number }[] {
  const sorted = [...items].sort((a, b) => b.total - a.total);
  if (sorted.length <= max + 1) {
    return sorted.map(({ name, total }) => ({ name, total }));
  }
  const rest = sorted.slice(max).reduce((sum, item) => sum + item.total, 0);
  return [
    ...sorted.slice(0, max).map(({ name, total }) => ({ name, total })),
    { name: 'Otros', total: round2(rest) },
  ];
}

const base: ApexOptions = {
  chart: {
    fontFamily: 'inherit',
    height: '100%',
    toolbar: { show: false },
    background: 'transparent',
    animations: { enabled: true, speed: 400 },
  },
  colors: CHART_COLORS,
  dataLabels: { enabled: false },
  grid: { borderColor: 'transparent', strokeDashArray: 4 },
  tooltip: { y: { formatter: (value: number) => money.format(value) } },
};

/** Linea temporal: cuanto se vendio cada dia del rango. */
export function salesTrendOptions(
  series: DashboardStats['series'],
): ApexOptions {
  return {
    ...base,
    chart: { ...base.chart, type: 'area' },
    series: [{ name: 'Ventas', data: series.map((point) => point.total) }],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02 },
    },
    xaxis: {
      categories: series.map((point) => dayLabel(point.date)),
      // Con 90 dias no entran 90 etiquetas: Apex reparte las que caben.
      tickAmount: Math.min(series.length, 8),
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { formatter: (value: number) => shortMoney.format(value) } },
  };
}

/** Barras horizontales: los productos que mas unidades movieron. */
export function topProductsOptions(
  products: DashboardStats['topProducts'],
): ApexOptions {
  return {
    ...base,
    chart: { ...base.chart, type: 'bar' },
    // Se invierte porque Apex dibuja la primera categoria abajo y el top 1
    // tiene que quedar arriba.
    series: [
      { name: 'Unidades', data: [...products].reverse().map((p) => p.qty) },
    ],
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: '60%' },
    },
    xaxis: {
      categories: [...products].reverse().map((p) => p.name),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    tooltip: { y: { formatter: (value: number) => `${value} u.` } },
  };
}

/** Dona: reparto de la facturacion por categoria. */
export function categoryOptions(
  byCategory: DashboardStats['byCategory'],
): ApexOptions {
  const slices = groupOthers(byCategory);
  return {
    ...base,
    chart: { ...base.chart, type: 'donut' },
    series: slices.map((slice) => slice.total),
    labels: slices.map((slice) => slice.name),
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '62%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () =>
                money.format(slices.reduce((sum, s) => sum + s.total, 0)),
            },
          },
        },
      },
    },
  };
}

/** Barras radiales: que peso tiene cada metodo de pago sobre el total. */
export function paymentOptions(
  byPayment: DashboardStats['byPayment'],
): ApexOptions {
  const total = byPayment.reduce((sum, row) => sum + row.total, 0);
  // El `|| 1` solo evita dividir por cero en un rango sin ventas.
  const divisor = total || 1;
  return {
    ...base,
    chart: { ...base.chart, type: 'radialBar' },
    series: byPayment.map((row) => round2((row.total / divisor) * 100)),
    labels: byPayment.map((row) => PAYMENT_LABELS[row.method]),
    plotOptions: {
      radialBar: {
        hollow: { size: '35%' },
        track: { background: 'rgba(127, 127, 127, 0.15)' },
        dataLabels: {
          name: { fontSize: '0.875rem' },
          value: { formatter: (value: number) => `${value}%` },
          // Sin hover el centro muestra el total; al pasar por un anillo lo
          // reemplaza por el metodo y su porcentaje.
          total: {
            show: true,
            label: 'Facturado',
            formatter: () => formatMoney(total),
          },
        },
      },
    },
    legend: { show: true, position: 'bottom' },
    tooltip: { enabled: false },
  };
}
