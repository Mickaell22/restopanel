/** Configuracion de DESARROLLO local. */
export const environment = {
  production: false,
  /**
   * `restoventas-backend` corriendo en la misma maquina. Es el unico valor que
   * no varia entre entornos --  en dev siempre es la maquina local -- asi que
   * queda como default para que `npm start` funcione sin configurar nada.
   * Para apuntar a otro host (backend en la LAN, tunel), cambiar solo aca.
   */
  apiUrl: 'http://localhost:3000',
};
