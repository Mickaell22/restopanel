import { Routes } from '@angular/router';

/**
 * Todas las vistas van por `loadComponent`: cada una es su propio chunk y el
 * bundle inicial se queda solo con el shell. Cuelgan de una ruta padre vacia
 * que monta el Shell (toolbar + nav), asi la pantalla de login que viene
 * despues puede vivir fuera de el sin heredar el layout.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard | RestoPanel',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'ventas',
        title: 'Ventas | RestoPanel',
        loadComponent: () =>
          import('./features/sales/sales').then((m) => m.Sales),
      },
      {
        path: 'productos',
        title: 'Productos | RestoPanel',
        loadComponent: () =>
          import('./features/products/products').then((m) => m.Products),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
