import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>Dashboard</h1>
    <p class="lead">KPIs y graficos de ventas sobre el rango de fechas elegido.</p>
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
export class Dashboard {}
