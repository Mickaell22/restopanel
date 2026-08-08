/**
 * Configuracion de PRODUCCION. En dev la reemplaza
 * `environment.development.ts` (ver `fileReplacements` en angular.json).
 */
export const environment = {
  production: true,
  /**
   * URL base del backend, relativa al propio origen: el reverse proxy que sirve
   * este bundle enruta /api al backend (ver `Caddyfile`). Antes era una cadena
   * vacia esperando que el despliegue inyectara el host real, pero Angular
   * resuelve `environment` en build-time: la imagen habria quedado atada a un
   * dominio. Relativo, la misma imagen sirve en local, en el VPS y en cualquier
   * dominio futuro.
   *
   * De paso arregla el interceptor del token, que decide con
   * `url.startsWith(environment.apiUrl)`: con '' eso era siempre verdadero y el
   * JWT se adjuntaba a cualquier request saliente.
   */
  apiUrl: '/api',
};
