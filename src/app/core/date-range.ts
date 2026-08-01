import { DateRange } from './models';

/**
 * Zona horaria del negocio. Se toma la del navegador: el panel lo abre quien
 * atiende el local, asi que su reloj es el correcto para decidir a que dia
 * pertenece una venta de las 11 de la noche. El backend la exige (`tz`) y sin
 * ella agrupa en UTC, que en Ecuador (UTC-5) parte el dia en dos.
 */
export const BUSINESS_TZ =
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

/** Rango con el que arrancan el dashboard y el listado de ventas. */
export const DEFAULT_RANGE_DAYS = 30;

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const endOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

/**
 * Rango de dias civiles completos, del inicio del primero al fin del ultimo.
 *
 * `to` es el fin del dia y no "ahora" a proposito: asi el rango solo cambia
 * cuando cambia el dia, y el resource no se redispara en cada render.
 */
export function lastDays(days: number, today = new Date()): DateRange {
  const from = startOfDay(today);
  from.setDate(from.getDate() - (days - 1));
  return { from: from.toISOString(), to: endOfDay(today).toISOString() };
}

/**
 * Rango a partir de dos fechas del datepicker. El calendario devuelve las dos
 * a medianoche; sin extender la segunda al final del dia, el ultimo dia del
 * rango se consultaria vacio.
 */
export function rangeFromDates(from: Date, to: Date): DateRange {
  return { from: startOfDay(from).toISOString(), to: endOfDay(to).toISOString() };
}
