import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Category, Product, ProductPayload } from './models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  list() {
    return this.http.get<Product[]>(this.base);
  }

  create(payload: ProductPayload) {
    return this.http.post<Product>(this.base, payload);
  }

  update(id: string, payload: Partial<ProductPayload>) {
    return this.http.patch<Product>(`${this.base}/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /**
   * Las categorias cuelgan de este servicio y no de uno propio: solo existen
   * para el selector del formulario de productos y son de solo lectura aca.
   */
  categories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }
}
