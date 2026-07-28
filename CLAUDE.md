# RestoPanel

Panel analitico web de RestoVentas. Aca van las decisiones e invariantes del
proyecto (el "por que"), no el changelog.

## Decisiones del proyecto

- **Angular 21, no 22.** El CLI de Angular 22 exige Node >= 22.22.3 y la maquina
  de desarrollo tiene 22.21.1. La 21 cubre todo lo que el panel necesita
  (standalone, signals, control flow nativo) y evitaba tocar el Node del
  sistema, que comparte con otros proyectos. Para subir a 22 hay que actualizar
  Node primero.
- **PrimeNG 21 + `@primeuix/themes@2`.** Las versiones importan y no son
  intercambiables: PrimeNG 22 y `@primeuix/themes@3` piden Angular 22 y
  `@primeuix/styled@^1`, mientras que la linea 21 usa `styled@^0.7`. Si `npm
  install primeng` resuelve a la ultima, rompe el arbol de dependencias.
  PrimeNG 21 tambien requiere `@angular/cdk` 21 como peer.
- **El tema define `darkModeSelector: '.app-dark'` desde el primer dia**, aunque
  el toggle llegue despues: cambiar ese selector una vez que hay componentes
  estilados obliga a revisar el tema entero.
- **Los estilos van en capas (`@layer theme, base, primeng`).** Sin eso, el
  reset de PrimeNG gana por especificidad contra las clases de layout propias y
  se termina peleando con `!important`.
- **`Shell` es una ruta, no el componente raiz.** `App` monta solo el
  `router-outlet`; el marco visual (barra + navegacion) vive en `layout/shell`
  como ruta padre. Asi el login puede quedar fuera del layout sin trucos.
- **La navegacion se declara una sola vez** (`navItems` en `Shell`) y se pinta
  con `ng-template` en la barra lateral de escritorio y en el drawer de movil.
  Duplicar el markup garantizaba que algun dia los dos menus dijeran cosas
  distintas.
- **Todas las vistas se cargan con `loadComponent`**, incluido el Shell. El
  bundle inicial no debe crecer con las features.

## Configuracion

- **La URL del backend NO se hardcodea.** Vive en `src/environments/`:
  `environment.development.ts` trae `http://localhost:3000` (el unico valor que
  no varia: en dev siempre es la maquina local) y `environment.ts`
  (produccion) la deja **vacia a proposito**. La define el despliegue; con el
  string vacio la app falla con un error explicito en el primer request, que es
  preferible a apuntar en silencio al host equivocado.
- Si el deploy necesita cambiar la URL **sin recompilar** (misma imagen en
  varios entornos), la salida no es hardcodear el valor sino cargar un
  `config.json` en runtime con `provideAppInitializer`. Se evaluo en la semana 2
  y se dejo para cuando el deploy lo pida.

## Backend

Consume `restoventas-backend` (NestJS). El endpoint del dashboard es
`GET /stats/dashboard?from&to&tz`, que devuelve KPIs, serie diaria y los cortes
por categoria, metodo de pago y top de productos **en una sola llamada**: el
filtro de fechas es una unica fuente de verdad y moverlo dispara un request, no
cinco. El parametro `tz` (zona IANA) no es opcional en la practica -- sin el,
las ventas de la noche se agrupan en el dia equivocado.

---

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
