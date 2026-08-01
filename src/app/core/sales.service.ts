import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { DateRange, Sale } from './models';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sales`;

  /** El backend no pagina: ordena por fecha desc y devuelve el rango entero. */
  list(range: DateRange) {
    return this.http.get<Sale[]>(this.base, { params: { ...range } });
  }

  /** Unica forma de saber que producto es cada item: el listado no lo trae. */
  detail(id: string) {
    return this.http.get<Sale>(`${this.base}/${id}`);
  }
}
