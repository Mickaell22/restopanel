import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marca de RestoPanel: la R de RestoVentas con las barras del panel sobre el
 * tile indigo, el mismo icono que el favicon (`public/logo.svg`) y que el
 * lockup del README. Si cambia el glifo, cambia en los tres.
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
      <g fill="#ffffff" transform="translate(-126 0)">
        <rect x="352" y="300" width="118" height="424" />
        <path d="M464 300 A170 170 0 0 1 464 640 L464 528 A58 58 0 0 0 464 412 Z" />
        <path d="M452 508 L566 508 L680 724 L566 724 Z" />
        <rect x="716" y="524" width="56" height="200" rx="14" />
        <rect x="792" y="444" width="56" height="280" rx="14" />
        <rect x="868" y="364" width="56" height="360" rx="14" />
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
