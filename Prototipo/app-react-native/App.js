/* Chamorro Servicios Cofrades — app móvil del trabajador (prototipo funcional) */
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
import TurnosScreen from './src/pantallas/TurnosScreen';
import DetalleScreen from './src/pantallas/DetalleScreen';
import BajaScreen from './src/pantallas/BajaScreen';
import AlertaScreen from './src/pantallas/AlertaScreen';
import DisponibilidadScreen from './src/pantallas/DisponibilidadScreen';
import { AvisosScreen, AvisoScreen, NotificacionesScreen } from './src/pantallas/AvisosScreen';
import PerfilScreen from './src/pantallas/PerfilScreen';

const Pila = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const tema = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.papel, primary: C.morado } };

function Pestanas() {
  const api = useAlmacen();
  const ofertas = api.ofertasPendientes().length > 0;
  const sinLeer = api.avisos().some(v => !v.leidos.includes(api.yo.id));
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: C.morado,
      tabBarInactiveTintColor: C.tinta3,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      tabBarIcon: ({ color }) => <IconoTab nombre={route.name} color={color} punto={(route.name === 'Turnos' && ofertas) || (route.name === 'Avisos' && sinLeer)} />
    })}>
      <Tabs.Screen name="Turnos" component={TurnosScreen} />
      <Tabs.Screen name="Disponibilidad" component={DisponibilidadScreen} />
      <Tabs.Screen name="Avisos" component={AvisosScreen} />
      <Tabs.Screen name="Perfil" component={PerfilScreen} />
    </Tabs.Navigator>
  );
}

function Raiz() {
  const api = useAlmacen();
  if (!api) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.morado }}><ActivityIndicator color="#fff" /></View>;
  return (
    <NavigationContainer theme={tema}>
      <StatusBar style="light" />
      <Pila.Navigator screenOptions={{ headerShown: false }}>
        {!api.s.sesion ? (
          <Pila.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Pila.Screen name="Inicio" component={Pestanas} />
            <Pila.Screen name="Detalle" component={DetalleScreen} />
            <Pila.Screen name="Baja" component={BajaScreen} />
            <Pila.Screen name="Alerta" component={AlertaScreen} options={{ presentation: 'modal' }} />
            <Pila.Screen name="Aviso" component={AvisoScreen} />
            <Pila.Screen name="Notificaciones" component={NotificacionesScreen} />
          </>
        )}
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
