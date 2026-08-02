import { computed, effect, Injectable, signal } from '@angular/core';

/**
 * Tema claro/oscuro. El trabajo pesado ya lo hace el preset de PrimeNG: aca
 * solo se alterna la clase que el tema declara como `darkModeSelector`
 * (`app.config.ts`), asi que ningun componente necesita saber que hay dos
 * temas -- todos pintan con variables `--p-*`.
 */

export type Theme = 'light' | 'dark';

/** La misma clave que lee el script anti-parpadeo de `index.html`. */
const STORAGE_KEY = 'restopanel.theme';

/** Tiene que coincidir con `darkModeSelector` del preset y con `index.html`. */
const DARK_CLASS = 'app-dark';

/**
 * localStorage es un limite de confianza (misma razon que en `auth.ts`): otra
 * pestaña o una extension pueden dejar cualquier string ahi. Se valida antes de
 * usarlo y, sin preferencia guardada, manda el sistema operativo.
 */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

/** El storage puede estar bloqueado (modo privado): no vale tumbar el toggle. */
function read(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persist(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sin persistencia el tema dura lo que la pestaña, que es aceptable.
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly current = signal(
    resolveTheme(read(), matchMedia('(prefers-color-scheme: dark)').matches),
  );

  readonly theme = this.current.asReadonly();
  readonly isDark = computed(() => this.current() === 'dark');

  constructor() {
    // Solo aplica la clase. Guardar aca tambien congelaria la preferencia del
    // sistema en el primer arranque: quien nunca toco el toggle debe seguir
    // al SO si lo cambia mañana.
    effect(() => {
      document.documentElement.classList.toggle(DARK_CLASS, this.isDark());
    });
  }

  toggle(): void {
    const next: Theme = this.current() === 'dark' ? 'light' : 'dark';
    this.current.set(next);
    persist(next);
  }
}
