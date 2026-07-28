import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Raiz de la aplicacion: solo monta el router. El marco visual (barra, nav)
 * vive en Shell, que es una ruta, para que las pantallas sin layout -- el
 * login que viene despues -- puedan quedar fuera de el.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
