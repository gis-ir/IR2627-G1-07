# App móvil (React Native + Expo)

Prototipo funcional de la app móvil de Chamorro Servicios Cofrades. La usan los cuatro perfiles: trabajadores, coordinador, administrador y hermandades. Cada uno ve sus propias pestañas al iniciar sesión. Usa datos simulados guardados en el móvil, los mismos de ejemplo que el portal web del prototipo.

## Cómo ejecutarla

1. Instala [Node.js](https://nodejs.org) (versión LTS).
2. En esta carpeta (`Prototipo/app-react-native`):
   ```bash
   npm install
   npx expo start -c --tunnel
   ```
   `-c` borra la caché de Metro y `--tunnel` permite abrir la app desde el móvil aunque no esté en la misma wifi que el ordenador (la primera vez puede pedir instalar `@expo/ngrok`; di que sí). Si el móvil y el ordenador comparten wifi, basta con `npx expo start -c`. Si Expo avisa de que alguna versión no coincide con el SDK, ejecuta `npx expo install --fix`.
3. Escanea el código QR con la app **Expo Go** (Android: desde la propia app; iPhone: con la cámara), o pulsa `a` para abrir el emulador de Android.

La misma app, en su versión HTML, se puede abrir en el navegador del móvil en https://chamorro-cofrades.netlify.app/app.html. El resto del prototipo está descrito en el README general del repositorio.

Cuentas de prueba (contraseña `demo` en todas). En la pantalla de inicio de sesión hay un botón para cada una:

| Perfil | Correo |
|---|---|
| Trabajador | `juan.perez@correo.es` (también `carlos.b@correo.es`) |
| Coordinador | `luis@chamorrocofrades.es` |
| Administrador | `admin@chamorrocofrades.es` |
| Hermandad | `secretaria@hdadestrella.es` |

En la misma pantalla puedes restablecer los datos de demostración.

## Pestañas por perfil

| Perfil | Pestañas | Más pantallas |
|---|---|---|
| Trabajador | Turnos, Disponibilidad, Avisos, Perfil | Detalle del servicio, Comunicar baja, Alerta de cobertura, Aviso, Notificaciones |
| Coordinador | Hoy, Bajas, Cuadrantes, Más | Detalle de baja (alertar o asignar), Cuadrante (recordar acuses), Tablón, Presupuestos, Personal, Ficha, Capacitaciones, Eventos |
| Administrador | Las del coordinador | Además: Usuarios, Auditoría, Estado del sistema (desde «Más») |
| Hermandad | Inicio, Cortejo, Presupuestos, Más | Presupuesto (aceptar o rechazar), Solicitar servicio, Historial |

## Pantallas y casos de uso

| Pantalla | Archivo | Mockup | Casos de uso |
|---|---|---|---|
| Inicio de sesión | `LoginScreen.js` | MOCK-006 | CU-031 |
| Mis turnos | `TurnosScreen.js` | MOCK-004 | CU-016 |
| Detalle del servicio | `DetalleScreen.js` | MOCK-014 | CU-016, CU-017 |
| Comunicar baja | `BajaScreen.js` | MOCK-016 | CU-011 |
| Alerta de cobertura urgente | `AlertaScreen.js` | MOCK-017 | CU-014 |
| Disponibilidad | `DisponibilidadScreen.js` | MOCK-015 | CU-004 |
| Tablón de avisos y aviso | `AvisosScreen.js` | MOCK-025 | CU-020 |
| Notificaciones | `AvisosScreen.js` | MOCK-017, MOCK-025 | CU-013, CU-018 |
| Mi perfil | `PerfilScreen.js` | MOCK-018 | CU-005, CU-002 |
| Hoy, bajas, cuadrantes | `GestionScreens.js` | MOCK-036, MOCK-037 | CU-012, CU-013, CU-015, CU-016, CU-018 |
| Más, tablón, personal, capacitaciones, eventos | `GestionMasScreens.js` | MOCK-037 | CU-002, CU-003, CU-019 |
| Presupuestos y detalle del presupuesto (el coordinador los consulta; la hermandad los acepta o rechaza) | `GestionMasScreens.js` | MOCK-037, MOCK-040 | CU-022, CU-023 |
| Usuarios, auditoría, estado del sistema | `GestionMasScreens.js` | MOCK-038 | CU-030, CU-032, CU-033 |
| Inicio, cortejo, solicitar servicio, más e historial de la hermandad | `HermandadScreens.js` | MOCK-039, MOCK-040 | CU-024, CU-027, CU-028, CU-029 |

## Estructura

```
App.js                      navegación: una pila y una barra inferior por perfil
src/tema.js                 colores (los mismos del portal web)
src/datos/semilla.js        datos de ejemplo
src/datos/Almacen.js        estado de la app, consultas y acciones (equivalen a llamadas a la API)
src/componentes/            botones, chips, tarjetas, filas, cabecera, iconos
src/pantallas/              pantallas agrupadas por perfil
```

## Limitaciones del prototipo

- No hay servidor: lo que se hace en el móvil se guarda solo en ese móvil y no llega al portal web. En la versión real, cada función de `Almacen.js` llamaría a la API del sistema. (La versión HTML, `app.html`, sí comparte datos con el portal porque los dos usan el mismo navegador.)
- Las tareas largas de edición (generar cuadrantes, elaborar presupuestos, editar usuarios) se hacen en el portal web; la app lo indica en esas pantallas.
- Las notificaciones push se simulan con la lista de notificaciones de la app.
- La cuenta atrás de las ofertas de sustitución es orientativa (los datos de ejemplo están fechados en la Semana Santa de 2027).
