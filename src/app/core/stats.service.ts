import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { BUSINESS_TZ } from './date-range';
import { DashboardStats, DateRange } from './models';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);

  /**
   * Todo el dashboard en una sola llamada: KPIs, serie diaria y los tres
   * cortes. Es a proposito -- mover el filtro de fechas dispara un request, no
   * cinco, y los cinco graficos no pueden quedar mostrando rangos distintos.
   */
  dashboard(range: DateRange) {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/stats/dashboard`, {
      params: { ...range, tz: BUSINESS_TZ },
    });
  }
}
