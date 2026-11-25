/* Chamorro Servicios Cofrades — app móvil (prototipo funcional)
   Todos los perfiles entran en la app: trabajadores, coordinador, administrador y hermandades.
   Cada perfil tiene su barra inferior de pestañas. */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AlmacenProvider, useAlmacen } from './src/datos/Almacen';
import { C } from './src/tema';
import { IconoTab } from './src/componentes/Iconos';
import LoginScreen from './src/pantallas/LoginScreen';
/* Trabajador */
import TurnosScreen from './src/pantallas/TurnosScreen';
import DetalleScreen from './src/pantallas/DetalleScreen';
import BajaScreen from './src/pantallas/BajaScreen';
import AlertaScreen from './src/pantallas/AlertaScreen';
import DisponibilidadScreen from './src/pantallas/DisponibilidadScreen';
import { AvisosScreen, AvisoScreen, NotificacionesScreen } from './src/pantallas/AvisosScreen';
import PerfilScreen from './src/pantallas/PerfilScreen';
/* Coordinador y administrador */
import { HoyScreen, BajasScreen, BajaScreen2, CuadrantesScreen, CuadranteScreen } from './src/pantallas/GestionScreens';
import { MasScreen, TablonGScreen, PresupuestosScreen, PresupuestoScreen, PersonalScreen, FichaScreen, CapacitacionesScreen, EventosScreen, UsuariosScreen, AuditoriaScreen, SistemaScreen } from './src/pantallas/GestionMasScreens';
/* Hermandad */
import { HermInicioScreen, CortejoScreen, SolicitarScreen, HermMasScreen, HistorialScreen } from './src/pantallas/HermandadScreens';

const Pila = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const tema = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.papel, primary: C.morado } };

function opcionesTabs(puntos) {
  return ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: C.morado,
    tabBarInactiveTintColor: C.tinta3,
    tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
    tabBarIcon: ({ color }) => <IconoTab nombre={route.name} color={color} punto={!!puntos[route.name]} />
  });
}

function PestanasTrabajador() {
  const api = useAlmacen();
  const puntos = { Turnos: api.ofertasPendientes().length > 0, Avisos: api.avisos().some(v => !v.leidos.includes(api.yo.id)) };
  return (
    <Tabs.Navigator screenOptions={opcionesTabs(puntos)}>
      <Tabs.Screen name="Turnos" component={TurnosScreen} />
      <Tabs.Screen name="Disponibilidad" component={DisponibilidadScreen} />
      <Tabs.Screen name="Avisos" component={AvisosScreen} />
      <Tabs.Screen name="Perfil" component={PerfilScreen} />
    </Tabs.Navigator>
  );
}

function PestanasGestion() {
  const api = useAlmacen();
  const puntos = { Bajas: api.s.bajas.some(b => b.estado === 'Abierta') };
  return (
    <Tabs.Navigator screenOptions={opcionesTabs(puntos)}>
      <Tabs.Screen name="Hoy" component={HoyScreen} />
      <Tabs.Screen name="Bajas" component={BajasScreen} />
      <Tabs.Screen name="Cuadrantes" component={CuadrantesScreen} />
      <Tabs.Screen name="Más" component={MasScreen} />
    </Tabs.Navigator>
  );
}

function PestanasHermandad() {
  const api = useAlmacen();
  const puntos = { Presupuestos: api.s.presupuestos.some(p => p.estado === 'Enviado' && api.solicitud(p.solicitud).hermandad === api.sesion.hermandad) };
  return (
    <Tabs.Navigator screenOptions={opcionesTabs(puntos)}>
      <Tabs.Screen name="Inicio" component={HermInicioScreen} />
      <Tabs.Screen name="Cortejo" component={CortejoScreen} />
      <Tabs.Screen name="Presupuestos" component={PresupuestosScreen} />
      <Tabs.Screen name="Más" component={HermMasScreen} />
    </Tabs.Navigator>
  );
}

function Raiz() {
  const api = useAlmacen();
  if (!api) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.morado }}><ActivityIndicator color="#fff" /></View>;
  const rol = api.sesion ? api.sesion.rol : null;
  return (
    <NavigationContainer theme={tema}>
      <StatusBar style="light" />
      <Pila.Navigator screenOptions={{ headerShown: false }}>
        {!rol && <Pila.Screen name="Login" component={LoginScreen} />}
        {rol === 'Trabajador' && <>
          <Pila.Screen name="Inicio" component={PestanasTrabajador} />
          <Pila.Screen name="Detalle" component={DetalleScreen} />
          <Pila.Screen name="Baja" component={BajaScreen} />
          <Pila.Screen name="Alerta" component={AlertaScreen} options={{ presentation: 'modal' }} />
          <Pila.Screen name="Aviso" component={AvisoScreen} />
          <Pila.Screen name="Notificaciones" component={NotificacionesScreen} />
        </>}
        {(rol === 'Coordinador' || rol === 'Administrador') && <>
          <Pila.Screen name="InicioGestion" component={PestanasGestion} />
          <Pila.Screen name="BajaDetalle" component={BajaScreen2} />
          <Pila.Screen name="Cuadrante" component={CuadranteScreen} />
          <Pila.Screen name="TablonG" component={TablonGScreen} />
          <Pila.Screen name="PresupuestosG" component={PresupuestosScreen} />
          <Pila.Screen name="Presupuesto" component={PresupuestoScreen} />
          <Pila.Screen name="Personal" component={PersonalScreen} />
          <Pila.Screen name="Ficha" component={FichaScreen} />
          <Pila.Screen name="Capacitaciones" component={CapacitacionesScreen} />
          <Pila.Screen name="Eventos" component={EventosScreen} />
          <Pila.Screen name="Usuarios" component={UsuariosScreen} />
          <Pila.Screen name="Auditoria" component={AuditoriaScreen} />
          <Pila.Screen name="Sistema" component={SistemaScreen} />
        </>}
        {rol === 'Hermandad' && <>
          <Pila.Screen name="InicioHermandad" component={PestanasHermandad} />
          <Pila.Screen name="Presupuesto" component={PresupuestoScreen} />
          <Pila.Screen name="Solicitar" component={SolicitarScreen} />
          <Pila.Screen name="Historial" component={HistorialScreen} />
        </>}
      </Pila.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AlmacenProvider>
        <Raiz />
      </AlmacenProvider>
    </SafeAreaProvider>
  );
}
