# RestoPanel

Panel analítico web de las ventas que captura la app móvil **RestoVentas**.
Angular 21 (standalone + signals), PrimeNG y ApexCharts.

> El README de portafolio (capturas, GIF y stack) llega en el Día 7 del plan
> (`semana-2-angular.md`).

## Requisitos

El panel no funciona solo: consume `restoventas-backend` (NestJS) y **exige
login**, así que hace falta:

1. El backend corriendo en `http://localhost:3000` (`npm run start:dev`).
2. Un usuario con datos. En el backend: `npm run seed`, que crea el usuario de
   `SEED_EMAIL`/`SEED_PASSWORD` y ~3.900 ventas de ejemplo.

La URL del backend no está hardcodeada: sale de `src/environments/`. En
producción se define en el despliegue (ver `CLAUDE.md`).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
