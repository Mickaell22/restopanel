import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sales',
  template: `
    <h1>Ventas</h1>
    <p class="lead">Historial de ventas con orden, filtro y detalle por ticket.</p>
  `,
  styles: `
    :host {
      display: block;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
    }
    .lead {
      margin: 0;
      color: var(--p-text-muted-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sales {}
