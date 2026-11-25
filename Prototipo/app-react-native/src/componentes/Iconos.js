/* Iconos dibujados con vistas (sin dependencias de librerías de iconos) */
import React from 'react';
import { View, Text } from 'react-native';
import { C } from '../tema';

/* Cirio: llama, vela y base, el mismo motivo que la marca del portal */
export function Cirio({ alto = 30 }) {
  const u = alto / 40;
  return (
    <View style={{ width: 18 * u, height: alto, alignItems: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={{ width: 7 * u, height: 11 * u, backgroundColor: C.oroCirio, borderTopLeftRadius: 4 * u, borderTopRightRadius: 4 * u, borderBottomLeftRadius: 3.5 * u, borderBottomRightRadius: 3.5 * u }} />
      <View style={{ width: 8 * u, height: 22 * u, marginTop: 2 * u, backgroundColor: '#F4EEDD', borderRadius: 1.5 * u }} />
      <View style={{ width: 14 * u, height: 3 * u, backgroundColor: C.oroCirio, borderRadius: u }} />
    </View>
  );
}

/* Glifos simples para la barra inferior */
const GLIFO = { Turnos: '▦', Disponibilidad: '◷', Avisos: '✉', Perfil: '◉', Hoy: '⌂', Bajas: '△', Cuadrantes: '▦', 'Más': '⋯', Inicio: '⌂', Cortejo: '☰', Presupuestos: '€' };
export function IconoTab({ nombre, color, punto }) {
  return (
    <View>
      <Text style={{ fontSize: 20, color, lineHeight: 24 }}>{GLIFO[nombre]}</Text>
      {punto ? <View style={{ position: 'absolute', top: 0, right: -6, width: 8, height: 8, borderRadius: 4, backgroundColor: C.burdeos }} /> : null}
    </View>
  );
}
