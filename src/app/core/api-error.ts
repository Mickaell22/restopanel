import { HttpErrorResponse } from '@angular/common/http';

/**
 * Saca el mensaje que manda NestJS (`{ message: string | string[] }`) para
 * mostrarlo tal cual: los errores utiles del backend son suyos, no genericos
 * ("Ya existe un producto con ese nombre", "el producto tiene ventas
 * asociadas"). Si no hay nada legible, cae en el texto por defecto.
 */
export function apiMessage(error: unknown, fallback = 'Algo salio mal.'): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  if (error.status === 0) return 'No se pudo conectar con el servidor.';

  const message: unknown = error.error?.message;
  if (typeof message === 'string') return message;
  // class-validator devuelve un array con un error por campo.
  if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  return fallback;
}
