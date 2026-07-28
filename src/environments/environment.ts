/**
 * Configuracion de PRODUCCION. En dev la reemplaza
 * `environment.development.ts` (ver `fileReplacements` en angular.json).
 */
export const environment = {
  production: true,
  /**
   * URL base del backend. Vacia a proposito: cambia entre entornos, asi que la
   * define el despliegue y no puede quedar fijada en el repo. Con este valor la
   * app falla con un error explicito en el primer request, que es preferible a
   * apuntar en silencio al host equivocado.
   */
  apiUrl: '',
};
