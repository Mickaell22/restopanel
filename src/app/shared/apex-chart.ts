import {
  Directive,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';

/**
 * Monta un grafico de ApexCharts sobre el elemento anfitrion.
 *
 * ponytail: se usa `apexcharts` directo en vez de `ng-apexcharts` porque el
 * wrapper expone una decena de @Input sueltos (series, chart, xaxis, yaxis,
 * ...) y cada grafico terminaba con quince bindings en la plantilla. Aca entra
 * un solo objeto `ApexOptions`, que ademas es lo que devuelven los `computed`
 * del dashboard. Techo conocido: no expone los eventos del grafico (click en
 * una barra, zoom); si algun dia hacen falta, se agrega un `output()` que
 * reenvie `chart.events` o se vuelve al wrapper.
 */
@Directive({ selector: '[appApexChart]' })
export class ApexChart {
  readonly options = input.required<ApexOptions>({ alias: 'appApexChart' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private chart: ApexCharts | null = null;

  constructor() {
    effect(() => {
      const options = this.options();
      if (this.chart) {
        // redrawPaths=true: al cambiar el rango cambia la cantidad de puntos y
        // sin redibujar los trazos quedan restos de la serie anterior.
        void this.chart.updateOptions(options, true, true);
        return;
      }
      this.chart = new ApexCharts(this.host, options);
      void this.chart.render();
    });

    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }
}
