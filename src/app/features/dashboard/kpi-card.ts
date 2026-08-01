import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Tarjeta de un indicador: etiqueta, valor grande y un pie opcional. */
@Component({
  selector: 'app-kpi-card',
  template: `
    <article class="kpi">
      <span class="kpi-icon" [style.background-color]="tint()" [style.color]="color()">
        <i [class]="icon()" aria-hidden="true"></i>
      </span>
      <div class="kpi-body">
        <p class="kpi-label">{{ label() }}</p>
        <p class="kpi-value">{{ value() }}</p>
        @if (hint()) {
          <p class="kpi-hint">{{ hint() }}</p>
        }
      </div>
    </article>
  `,
  styles: `
    .kpi {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: 100%;
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-border-radius-lg);
      background: var(--p-content-background);
    }
    .kpi-icon {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      font-size: 1.125rem;
    }
    .kpi-body {
      min-width: 0;
    }
    p {
      margin: 0;
    }
    .kpi-label {
      color: var(--p-text-muted-color);
      font-size: 0.875rem;
    }
    .kpi-value {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.2;
    }
    .kpi-hint {
      color: var(--p-text-muted-color);
      font-size: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
  readonly color = input.required<string>();
  readonly hint = input('');

  /** Mismo color del icono al 12% para el circulo de fondo. */
  protected readonly tint = computed(() => `${this.color()}1f`);
}
