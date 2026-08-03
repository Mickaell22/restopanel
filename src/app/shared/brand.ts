import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marca de RestoPanel: las barras blancas sobre el tile indigo, el mismo icono
 * que el favicon (`public/logo.svg`) y que el lockup del README.
 *
 * Va inline y no como `<img>` para que se pinte en el mismo request que el HTML
 * y para que el tile tome el primario del tema; existe como componente porque
 * lo usan la barra del shell y el login, y dos copias del path se separan el
 * dia que alguien retoca una.
 */
@Component({
  selector: 'app-brand',
  template: `
    <svg
      viewBox="0 0 1024 1024"
      [attr.width]="size()"
      [attr.height]="size()"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="1024" height="1024" rx="230" fill="currentColor" />
      <g fill="#ffffff">
        <rect x="257" y="512" width="130" height="250" rx="24" />
        <rect x="447" y="382" width="130" height="380" rx="24" />
        <rect x="637" y="262" width="130" height="500" rx="24" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      color: var(--p-primary-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Brand {
  /** Lado del tile en px; el SVG es cuadrado. */
  readonly size = input(28);
}
