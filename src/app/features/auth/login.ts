import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../core/auth';

/**
 * `returnUrl` viene de la barra de direcciones, asi que es input no confiable:
 * sin este filtro, un link con `?returnUrl=//sitio.malo` convertiria el login en
 * un redirector abierto. Solo se aceptan rutas internas.
 */
export function safeReturnUrl(url: string | undefined): string {
  return url?.startsWith('/') && !url.startsWith('//') ? url : '/dashboard';
}

/** Traduce el fallo HTTP a algo que le sirva a quien esta mirando la pantalla. */
function loginError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'No se pudo iniciar sesion.';
  if (error.status === 401) return 'Correo o clave incorrectos.';
  // El backend limita a 5 intentos por minuto.
  if (error.status === 429) return 'Demasiados intentos. Espera un minuto.';
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  return 'No se pudo iniciar sesion. Intenta de nuevo.';
}

/**
 * Unica pantalla fuera del Shell: no tiene barra ni navegacion porque todavia
 * no hay a donde navegar.
 */
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
  ],
  template: `
    <main class="login">
      <form class="card" [formGroup]="form" (ngSubmit)="submit()">
        <h1><i class="pi pi-chart-bar" aria-hidden="true"></i> RestoPanel</h1>
        <p class="lead">Entra con tu cuenta de RestoVentas.</p>

        @if (error(); as message) {
          <p-message severity="error" [text]="message" />
        }

        <div class="field">
          <label for="email">Correo</label>
          <input
            pInputText
            id="email"
            type="email"
            autocomplete="username"
            formControlName="email"
            [attr.aria-invalid]="invalid('email')"
            aria-describedby="email-error"
          />
          @if (invalid('email')) {
            <small id="email-error" class="error">Escribe un correo valido.</small>
          }
        </div>

        <div class="field">
          <label for="password">Clave</label>
          <p-password
            inputId="password"
            formControlName="password"
            autocomplete="current-password"
            [feedback]="false"
            [toggleMask]="true"
            [fluid]="true"
            [inputStyleClass]="invalid('password') ? 'ng-invalid ng-dirty' : ''"
          />
          @if (invalid('password')) {
            <small class="error">La clave es obligatoria.</small>
          }
        </div>

        <p-button
          type="submit"
          label="Entrar"
          icon="pi pi-sign-in"
          [loading]="submitting()"
          [fluid]="true"
        />
      </form>
    </main>
  `,
  styles: `
    .login {
      display: grid;
      place-items: center;
      min-height: 100dvh;
      padding: 1.5rem;
      background: var(--p-content-background);
    }
    .card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: min(24rem, 100%);
      padding: 2rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: var(--p-border-radius-lg);
      background: var(--p-content-background);
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
      i {
        color: var(--p-primary-color);
      }
    }
    .lead {
      margin: 0;
      color: var(--p-text-muted-color);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    label {
      font-weight: 600;
    }
    .error {
      color: var(--p-red-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Llega por query param gracias a `withComponentInputBinding`. Es opcional de
   * verdad: cuando se entra a `/login` sin el param, el binding de rutas
   * escribe `undefined` encima de cualquier valor por defecto, asi que no sirve
   * poner `input('')` y confiar en el string vacio.
   */
  readonly returnUrl = input<string>();

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected invalid(control: 'email' | 'password'): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(safeReturnUrl(this.returnUrl())),
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(loginError(err));
      },
    });
  }

}
