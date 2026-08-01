import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';

import { DEFAULT_RANGE_DAYS, lastDays } from '../../core/date-range';
import { DateRange } from '../../core/models';
import { StatsService } from '../../core/stats.service';
import { ApexChart } from '../../shared/apex-chart';
import { RangeFilter } from '../../shared/range-filter';
import {
  CHART_COLORS,
  categoryOptions,
  dayLabel,
  formatMoney,
  paymentOptions,
  salesTrendOptions,
  topProductsOptions,
} from './charts';
import { KpiCard } from './kpi-card';

/**
 * El rango de fechas es la unica entrada del dashboard: cambiarlo redispara un
 * unico request (`/stats/dashboard` trae los KPIs y los cuatro cortes juntos) y
 * todo lo demas son `computed` sobre esa respuesta. Por eso no hay que
 * coordinar cinco llamadas ni existe forma de que un grafico quede mostrando un
 * rango distinto al de al lado.
 */
@Component({
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    MessageModule,
    SkeletonModule,
    ApexChart,
    RangeFilter,
    KpiCard,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly api = inject(StatsService);

  protected readonly range = signal<DateRange>(lastDays(DEFAULT_RANGE_DAYS));

  protected readonly stats = rxResource({
    params: () => this.range(),
    stream: ({ params }) => this.api.dashboard(params),
  });

  /** Rango sin ventas: es un estado propio, no "todavia cargando". */
  protected readonly isEmpty = computed(() => this.stats.value()?.kpis.count === 0);

  protected readonly kpis = computed(() => {
    const data = this.stats.value();
    if (!data) return [];

    const best = [...data.series].sort((a, b) => b.total - a.total)[0];
    const days = data.series.length;

    return [
      {
        label: 'Vendido',
        value: formatMoney(data.kpis.total),
        hint: days ? `en ${days} dias` : '',
        icon: 'pi pi-dollar',
        color: CHART_COLORS[0],
      },
      {
        label: 'Ventas',
        value: `${data.kpis.count}`,
        hint: days ? `${(data.kpis.count / days).toFixed(1)} por dia` : '',
        icon: 'pi pi-receipt',
        color: CHART_COLORS[1],
      },
      {
        label: 'Ticket promedio',
        value: formatMoney(data.kpis.avgTicket),
        hint: '',
        icon: 'pi pi-shopping-cart',
        color: CHART_COLORS[2],
      },
      {
        label: 'Mejor dia',
        value: best ? formatMoney(best.total) : '-',
        hint: best ? dayLabel(best.date) : '',
        icon: 'pi pi-star',
        color: CHART_COLORS[3],
      },
    ];
  });

  protected readonly trendChart = computed(() => {
    const data = this.stats.value();
    return data ? salesTrendOptions(data.series) : null;
  });

  protected readonly productsChart = computed(() => {
    const data = this.stats.value();
    return data ? topProductsOptions(data.topProducts) : null;
  });

  protected readonly categoryChart = computed(() => {
    const data = this.stats.value();
    return data ? categoryOptions(data.byCategory) : null;
  });

  protected readonly paymentChart = computed(() => {
    const data = this.stats.value();
    return data ? paymentOptions(data.byPayment) : null;
  });
}
