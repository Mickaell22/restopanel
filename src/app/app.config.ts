import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: los parametros de ruta llegan como input() al
    // componente, sin inyectar ActivatedRoute solo para leer un id.
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          // El toggle claro/oscuro alterna esta clase en <html>. Se define aca
          // y no el dia del toggle porque cambiarla despues obliga a revisar
          // el tema entero.
          darkModeSelector: '.app-dark',
          // Los estilos del tema entran en capas ordenadas: asi una clase de
          // layout propia no pierde contra el reset de PrimeNG por
          // especificidad.
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
