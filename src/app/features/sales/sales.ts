import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { DEFAULT_RANGE_DAYS, lastDays } from '../../core/date-range';
import { DateRange, PAYMENT_LABELS, Sale } from '../../core/models';
import { SalesService } from '../../core/sales.service';
import { RangeFilter } from '../../shared/range-filter';

/**
 * Fila de la tabla. Es un modelo aplanado a proposito: `p-table` ordena y
 * filtra por el valor del campo, asi que el metodo de pago tiene que llegar ya
 * traducido ("Efectivo") o buscar "efectivo" no encontraria nada.
 */
interface SaleRow {
  readonly id: string;
  readonly createdAt: string;
  readonly total: number;
  readonly method: string;
  readonly items: number;
}

@Component({
  selector: 'app-sales',
  imports: [
    CurrencyPipe,
    DatePipe,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    SkeletonModule,
    RangeFilter,
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sales {
  private readonly api = inject(SalesService);

  protected readonly range = signal<DateRange>(lastDays(DEFAULT_RANGE_DAYS));

  protected readonly sales = rxResource({
    params: () => this.range(),
    stream: ({ params }) => this.api.list(params),
  });

  protected readonly rows = computed<SaleRow[]>(() =>
    (this.sales.value() ?? []).map((sale) => ({
      id: sale.id,
      // Se deja el string ISO: ordenado alfabeticamente ya queda cronologico.
      createdAt: sale.createdAt,
      total: sale.total,
      method: PAYMENT_LABELS[sale.paymentMethod],
      items: sale.items.length,
    })),
  );

  protected readonly total = computed(() =>
    this.rows().reduce((sum, row) => sum + row.total, 0),
  );

  /**
   * Detalles cacheados por venta. El listado no trae el nombre de los
   * productos (solo el `productId`), asi que el detalle se pide al desplegar la
   * fila y no antes: son ~1.000 ventas por rango y traerlas expandidas seria
   * tirar abajo la vista para mirar dos.
   */
  protected readonly details = signal<Record<string, Sale>>({});

  protected loadDetail(row: SaleRow): void {
    if (this.details()[row.id]) return;
    this.api.detail(row.id).subscribe((sale) => {
      this.details.update((cache) => ({ ...cache, [sale.id]: sale }));
    });
  }
}
