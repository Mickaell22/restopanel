import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
}

/**
 * Marco de la aplicacion: barra superior, navegacion y area de contenido.
 *
 * La navegacion se declara una sola vez (`navItems`) y se pinta en dos lugares
 * via ng-template: la barra lateral fija de escritorio y el drawer de movil.
 * Duplicar el markup era la otra opcion y garantizaba que algun dia los dos
 * menus dijeran cosas distintas.
 */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    ButtonModule,
    DrawerModule,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  /** Solo aplica al drawer de movil; en escritorio la barra esta siempre. */
  protected readonly menuOpen = signal(false);

  protected readonly navItems: readonly NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-chart-line', path: '/dashboard' },
    { label: 'Ventas', icon: 'pi pi-receipt', path: '/ventas' },
    { label: 'Productos', icon: 'pi pi-box', path: '/productos' },
  ];
}
