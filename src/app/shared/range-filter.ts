import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';

import { DEFAULT_RANGE_DAYS, lastDays, rangeFromDates } from '../core/date-range';
import { DateRange } from '../core/models';

/**
 * Filtro de fechas compartido por el dashboard y el listado de ventas.
 *
 * Escribe sobre un unico `model` de rango: quien lo usa tiene una sola fuente
 * de verdad y no necesita coordinar atajos y calendario por separado.
 */
@Component({
  selector: 'app-range-filter',
  imports: [ReactiveFormsModule, SelectButtonModule, DatePickerModule],
  template: `
    <div class="range-filter">
      <p-selectbutton
        [options]="presets"
        [formControl]="preset"
        optionLabel="label"
        optionValue="days"
        [allowEmpty]="false"
        ariaLabelledBy="range-filter-label"
      />
      <p-datepicker
        [formControl]="dates"
        selectionMode="range"
        dateFormat="dd/mm/yy"
        placeholder="Rango a medida"
        inputId="range-filter-dates"
        [readonlyInput]="true"
        [showIcon]="true"
        [maxDate]="today"
      />
      <span id="range-filter-label" class="sr-only">Rango de fechas</span>
      <label for="range-filter-dates" class="sr-only">Rango de fechas a medida</label>
    </div>
  `,
  styles: `
    .range-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilter {
  /** El rango vive en el padre; este componente solo lo empuja. */
  readonly range = model.required<DateRange>();

  protected readonly today = new Date();

  protected readonly presets = [
    { label: '7 dias', days: 7 },
    { label: '30 dias', days: 30 },
    { label: '90 dias', days: 90 },
  ];

  // El valor inicial tiene que coincidir con el rango con el que arranca el
  // padre; por eso los dos salen de DEFAULT_RANGE_DAYS.
  protected readonly preset = new FormControl<number | null>(DEFAULT_RANGE_DAYS);
  protected readonly dates = new FormControl<Date[] | null>(null);

  constructor() {
    this.preset.valueChanges.pipe(takeUntilDestroyed()).subscribe((days) => {
      if (days === null) return;
      // emitEvent:false para no rebotar de vuelta al atajo recien elegido.
      this.dates.setValue(null, { emitEvent: false });
      this.range.set(lastDays(days));
    });

    this.dates.valueChanges.pipe(takeUntilDestroyed()).subscribe((dates) => {
      // El calendario emite tambien con el primer click, con `to` todavia nulo.
      const [from, to] = dates ?? [];
      if (!from || !to) return;
      this.preset.setValue(null, { emitEvent: false });
      this.range.set(rangeFromDates(from, to));
    });
  }
}
