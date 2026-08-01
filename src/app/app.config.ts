import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { authInterceptor } from './core/auth';
import { routes } from './app.routes';

/**
 * Aura con el primario en indigo, por dos razones:
 *
 * 1. Accesibilidad: el emerald 500 que trae Aura de fabrica con texto blanco
 *    encima da ~2.5:1 de contraste y AXE lo marca (WCAG AA pide 4.5:1). El
 *    indigo 600 llega a 5.8:1.
 * 2. Coherencia: es el mismo color con el que abre la paleta de los graficos
 *    (`CHART_COLORS`), asi el panel se ve de una sola pieza.
 *
 * En oscuro se invierte: color claro (400) sobre texto oscuro, que es como se
 * consigue el contraste cuando el fondo es negro.
 */
const RestoAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
      },
    },
  },
  components: {
    // La opcion no elegida del selector de rango viene en surface.500 sobre
    // surface.100: 3.5:1, por debajo del 4.5:1 que pide WCAG AA. Un escalon
    // mas oscuro lo resuelve sin tocar el resto del tema.
    togglebutton: {
      colorScheme: {
        light: { root: { color: '{surface.600}' } },
        dark: { root: { color: '{surface.300}' } },
      },
    },
  },
});

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
        preset: RestoAura,
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
