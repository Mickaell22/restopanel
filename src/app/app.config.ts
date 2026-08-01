import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { authInterceptor } from './core/auth';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Un solo interceptor: adjunta el JWT y cierra la sesion ante un 401.
    provideHttpClient(withInterceptors([authInterceptor])),
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
