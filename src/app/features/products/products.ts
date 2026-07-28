import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products',
  template: `
    <h1>Productos</h1>
    <p class="lead">Alta, edicion y baja del catalogo del local.</p>
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
export class Products {}
