/**
 * Espejo del contrato de `restoventas-backend`. Un solo archivo porque son
 * interfaces planas que siempre se leen juntas; si crece, se parte por dominio.
 *
 * Ojo con las fechas: viajan como string ISO en el JSON, no como `Date`.
 */

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly user: AuthUser;
}

export interface Category {
  readonly id: string;
  readonly name: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly active: boolean;
  readonly categoryId: string | null;
  /** Viene poblada en `GET /products`; el backend hace LEFT JOIN. */
  readonly category: Category | null;
}

export interface ProductPayload {
  readonly name: string;
  readonly price: number;
  readonly categoryId: string | null;
  readonly active: boolean;
}

export interface SaleItem {
  readonly id: string;
  readonly productId: string;
  readonly qty: number;
  readonly unitPrice: number;
  readonly subtotal: number;
  /** Solo en el detalle (`GET /sales/:id`); el listado no trae el producto. */
  readonly product?: Product;
}

export interface Sale {
  readonly id: string;
  readonly createdAt: string;
  readonly total: number;
  readonly paymentMethod: PaymentMethod;
  readonly items: readonly SaleItem[];
}

/** Rango de consulta: instantes ISO con zona, como los espera el backend. */
export interface DateRange {
  readonly from: string;
  readonly to: string;
}

export interface DashboardStats {
  readonly range: { from: string | null; to: string | null; tz: string };
  readonly kpis: { total: number; count: number; avgTicket: number };
  /** `date` es el dia civil (YYYY-MM-DD) en la zona pedida, sin huecos. */
  readonly series: readonly { date: string; total: number; count: number }[];
  readonly byCategory: readonly {
    categoryId: string | null;
    name: string;
    total: number;
    qty: number;
  }[];
  readonly byPayment: readonly {
    method: PaymentMethod;
    total: number;
    count: number;
  }[];
  readonly topProducts: readonly {
    productId: string;
    name: string;
    qty: number;
    revenue: number;
  }[];
}

/** Etiquetas en español de los metodos de pago que devuelve el backend. */
export const PAYMENT_LABELS: Readonly<Record<PaymentMethod, string>> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  other: 'Otro',
};
