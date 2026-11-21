# App del trabajador (React Native + Expo)

Prototipo funcional de la app móvil de Chamorro Servicios Cofrades para los trabajadores (acólitos, pertigueros, aguadores, encendedores y auxiliares de cortejo). Usa datos simulados guardados en el móvil, los mismos de ejemplo que el portal web del prototipo.

## Cómo ejecutarla

1. Instala [Node.js](https://nodejs.org) (versión LTS).
2. En esta carpeta:
   ```bash
   npm install
   npx expo install --fix   # ajusta las versiones a la del SDK de Expo instalado
   npx expo start
   ```
3. Escanea el código QR con la app **Expo Go** (Android o iOS), o pulsa `a` para abrir el emulador de Android.

Cuenta de prueba: `juan.perez@correo.es` con contraseña `demo`. También vale `carlos.b@correo.es`. En la pantalla de inicio de sesión puedes restablecer los datos de demostración.

## Pantallas y casos de uso

| Pantalla | Archivo | Mockup | Casos de uso |
|---|---|---|---|
| Inicio de sesión | `LoginScreen.js` | MOCK-006 | CU-031 |
| Mis turnos | `TurnosScreen.js` | nueva | CU-016 |
| Detalle del servicio | `DetalleScreen.js` | MOCK-014 | CU-016, CU-017 |
| Comunicar baja | `BajaScreen.js` | MOCK-016 | CU-011 |
| Alerta de cobertura urgente | `AlertaScreen.js` | MOCK-017 | CU-014 |
| Disponibilidad | `DisponibilidadScreen.js` | MOCK-015 | CU-004 |
| Tablón de avisos y aviso | `AvisosScreen.js` | MOCK-025 | CU-020 |
| Notificaciones | `AvisosScreen.js` | nueva | CU-013, CU-018 |
| Mi perfil | `PerfilScreen.js` | MOCK-018 | CU-005, CU-002 |

## Estructura

```
App.js                      navegación: pila + barra inferior de 4 pestañas
src/tema.js                 colores (los mismos del portal web)
src/datos/semilla.js        datos de ejemplo
src/datos/Almacen.js        estado de la app y acciones (equivalen a llamadas a la API)
src/componentes/            botones, chips, tarjetas, cabecera, iconos
src/pantallas/              una pantalla por archivo
```

## Limitaciones del prototipo

- No hay servidor: lo que hace el trabajador se guarda solo en su móvil y no llega al portal web del coordinador. En la versión real, cada función de `Almacen.js` llamaría a la API del sistema.
- Las notificaciones push se simulan con la lista de notificaciones de la app.
- La cuenta atrás de las ofertas de sustitución es orientativa (los datos de ejemplo están fechados en la Semana Santa de 2027).
