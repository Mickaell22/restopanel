import { HttpErrorResponse, HttpInterceptorFn, HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse } from './models';

/**
 * Servicio, guard e interceptor viven juntos: son la misma responsabilidad
 * (la sesion) y separarlos en tres archivos solo agrega saltos para leer 60
 * lineas.
 */

const STORAGE_KEY = 'restopanel.session';

/**
 * localStorage es un limite de confianza: lo escribe el navegador y cualquier
 * extension o pestaña vieja puede dejar basura. Se valida la forma antes de
 * creer que hay sesion, si no un JSON corrupto rompe el arranque de la app.
 */
function readStoredSession(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as AuthResponse).accessToken === 'string' &&
      typeof (parsed as AuthResponse).user?.email === 'string'
    ) {
      return parsed as AuthResponse;
    }
  } catch {
    // JSON invalido o storage bloqueado (modo privado): se entra sin sesion.
  }
  localStorage.removeItem(STORAGE_KEY);
  return null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Fuente de verdad de la sesion; se hidrata del storage al arrancar. */
  private readonly session = signal(readStoredSession());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);

  /** Lo lee el interceptor en cada request. */
  token(): string | null {
    return this.session()?.accessToken ?? null;
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
          this.session.set(response);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.session.set(null);
  }
}

/** Protege el layout entero: sin sesion se va al login y se vuelve al entrar. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (
    auth.isLoggedIn() ||
    router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
  );
};

/**
 * Adjunta el JWT y cierra la sesion si el backend lo rechaza.
 *
 * El token solo se manda a `environment.apiUrl`: si algun dia se consume otra
 * API (mapas, imagenes), no se le filtra la credencial del panel.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();

  if (!token || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const authorized = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authorized).pipe(
    catchError((error: unknown) => {
      // 401 con token adjunto = token vencido o invalido (el JWT dura 7d).
      if (error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
