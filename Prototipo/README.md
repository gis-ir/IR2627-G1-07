# Prototipo funcional — Chamorro Servicios Cofrades

Prototipo del segundo entregable (grupo IR-G1-07). Todas las pantallas están hechas en HTML, CSS y JavaScript sin librerías, con datos simulados de la Semana Santa de 2027.

## Qué hay en esta carpeta

| Archivo o carpeta | Qué es |
|---|---|
| `index.html` | Presentación con todas las pantallas, interactivas, en marco de navegador o de móvil. Se pasa con las flechas del teclado. |
| `portal.html` | Portal web para todos los perfiles: coordinador, administrador, hermandades y trabajadores. |
| `app.html` | Versión HTML de la app móvil, también para todos los perfiles (para la presentación y para probarla en el navegador del móvil). |
| `app-trabajador.html` | Redirige a `app.html` (se mantiene para no romper enlaces antiguos). |
| `app-react-native/` | Código de la app móvil en React Native con Expo, con los cuatro perfiles. Ver su README. |
| `css/`, `js/` | Estilos y lógica compartidos. `js/datos.js` tiene los datos de ejemplo. |

## Cómo abrirlo

Basta con abrir `index.html` o `portal.html` en el navegador. Si el navegador bloquea algo al abrirlo como archivo, sirve la carpeta con un servidor local, por ejemplo `python -m http.server` dentro de esta carpeta, y entra en `http://localhost:8000`.

Cuentas de prueba (contraseña `demo` en todas):

- Coordinador: `luis@chamorrocofrades.es`
- Administrador: `admin@chamorrocofrades.es`
- Hermandad: `secretaria@hdadestrella.es`
- Trabajador: `juan.perez@correo.es`

Las cuatro cuentas sirven tanto en el portal como en la app. En las dos pantallas de inicio de sesión hay botones para entrar directamente con cada una.

## Cada perfil en cada canal

| Perfil | Portal web (ordenador) | App móvil (calle) |
|---|---|---|
| Coordinador | Todo: eventos, cuadrantes, presupuestos, personal, tablón | Bajas urgentes (alertar y asignar), confirmaciones y recordatorios, tablón, capacitaciones, consulta de presupuestos y personal |
| Administrador | Lo del coordinador, más usuarios, auditoría y estado del sistema | Lo del coordinador, más activar cuentas, auditoría y estado del sistema |
| Hermandad | Solicitudes, presupuestos, cuadrante del cortejo, incidencias e historial | Lo mismo: solicitar, aceptar o rechazar presupuestos y seguir el cortejo |
| Trabajador | Turnos, cuadrante completo en grande, disponibilidad, avisos y perfil | Turnos, confirmación, bajas, alertas de cobertura, disponibilidad, avisos y perfil |

Las tareas largas de edición (generar un cuadrante, elaborar un presupuesto, editar usuarios) solo están en el portal.

Los cambios se guardan en el navegador (localStorage) y se comparten entre el portal y la app HTML: si un trabajador comunica una baja en la app o en el portal, aparece en «Bajas urgentes» del coordinador en los dos canales. El botón «Restablecer datos de demostración» del inicio de sesión vuelve a los datos iniciales.

## Pantallas y casos de uso

37 pantallas y vistas cubren los 33 casos de uso del ERS. Las marcadas como nuevas no tenían mockup o se han rehecho.

| Pantalla | Perfil | Mockup | Casos de uso |
|---|---|---|---|
| Inicio de sesión | Todos los perfiles | MOCK-006 | CU-026, CU-031 |
| Registrar una hermandad | Hermandad | Nueva | CU-026 |
| Panel principal | Coordinador | MOCK-007 | CU-018, CU-019 |
| Añadir evento con trabajo | Coordinador | MOCK-023 | CU-010 |
| Cuadrantes vigentes | Coordinador | MOCK-008 | CU-006, CU-007 |
| Generar cuadrante | Coordinador | MOCK-008 | CU-006, CU-007, CU-008 |
| Exportar cuadrante | Coordinador | Nueva | CU-009 |
| Cobertura de bajas urgentes | Coordinador | MOCK-002 (rehecha) | CU-012, CU-013, CU-015 |
| Seguimiento de acuses | Coordinador | MOCK-011 | CU-017, CU-018 |
| Publicar aviso en el tablón | Coordinador | MOCK-012 | CU-019 |
| Seguimiento de presupuestos | Coordinador | MOCK-013 | CU-022, CU-025 |
| Elaborar presupuesto | Coordinador | MOCK-003 (rehecha) | CU-021, CU-022 |
| Exportar a contabilidad | Coordinador | MOCK-013 | CU-025 |
| Catálogo de personal | Coordinador | MOCK-009 | CU-001, CU-003 |
| Matriz de disponibilidad | Coordinador | MOCK-009 | CU-003 |
| Ficha del trabajador | Coordinador | MOCK-024 | CU-001, CU-003 |
| Validar capacitaciones | Coordinador | MOCK-010 | CU-002 |
| Usuarios y permisos | Administrador | MOCK-022 | CU-030 |
| Registro de auditoría | Administrador | MOCK-022 (rehecha) | CU-032 |
| Estado del sistema | Administrador | Nueva | CU-033 |
| Panel de la hermandad | Hermandad | MOCK-019 | CU-028 |
| Solicitar un servicio | Hermandad | MOCK-005 (rehecha) | CU-027 |
| Revisar presupuesto | Hermandad | MOCK-020 | CU-023 |
| Cuadrante del cortejo | Hermandad | MOCK-021 | CU-024, CU-028 |
| Historial de servicios | Hermandad | MOCK-019 (rehecha) | CU-029 |
| Acceso y mis turnos | Trabajador | MOCK-006 (rehecha) | CU-031, CU-016 |
| Detalle del servicio y baja | Trabajador | MOCK-014, MOCK-016 | CU-016, CU-017, CU-011 |
| Cobertura urgente y disponibilidad | Trabajador | MOCK-017, MOCK-015 | CU-014, CU-004 |
| Tablón de avisos y perfil | Trabajador | MOCK-025, MOCK-018 | CU-020, CU-005, CU-002 |
| Mis turnos en el ordenador | Trabajador (portal) | Nueva | CU-016, CU-017, CU-011, CU-014 |
| Cuadrante del servicio en grande | Trabajador (portal) | Nueva | CU-016 |
| Disponibilidad, avisos y perfil | Trabajador (portal) | MOCK-015 (rehecha) | CU-004, CU-020, CU-005 |
| Hoy y bajas urgentes | Coordinador (app) | Nueva | CU-018, CU-012, CU-013, CU-015 |
| Cuadrantes y más | Coordinador (app) | Nueva | CU-016, CU-018, CU-019, CU-002 |
| Administración en el móvil | Administrador (app) | Nueva | CU-032, CU-033, CU-030 |
| Solicitudes y cortejo | Hermandad (app) | Nueva | CU-028, CU-024 |
| Presupuestos y nueva solicitud | Hermandad (app) | Nueva | CU-023, CU-027 |
