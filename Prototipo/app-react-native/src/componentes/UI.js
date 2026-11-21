/* Componentes de interfaz reutilizables */
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, SERIF } from '../tema';

export function Boton({ titulo, onPress, tipo = 'sec', peq, disabled, style }) {
  const t = { pri: [C.morado, C.morado, '#fff'], urg: [C.burdeos, C.burdeos, '#fff'], ok: [C.romero, C.romero, '#fff'], sec: [C.blanco, C.linea2, C.tinta], peligro: [C.blanco, C.linea2, C.burdeos], blanco: ['#fff', '#fff', C.burdeos], borde: ['transparent', 'rgba(255,255,255,.5)', '#fff'] }[tipo];
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} onPress={onPress} disabled={disabled}
      style={({ pressed }) => [est.boton, { backgroundColor: t[0], borderColor: t[1], opacity: disabled ? 0.45 : pressed ? 0.85 : 1 }, peq && est.botonPeq, style]}>
      <Text style={[est.botonTxt, { color: t[2] }, peq && { fontSize: 14 }]}>{titulo}</Text>
    </Pressable>
  );
}

const CHIP = { Confirmado: 'ok', Aprobada: 'ok', Aceptada: 'ok', Pendiente: 'aviso', Enviada: 'info', Rechazada: 'urg', Baja: 'urg', Caducada: 'neutro' };
export function Chip({ estado, texto }) {
  const k = CHIP[estado] || 'neutro';
  const col = { ok: [C.romeroClaro, C.romero], aviso: [C.ambarClaro, C.ambar], info: [C.azulClaro, C.azul], urg: [C.burdeosClaro, C.burdeos], neutro: ['#EFEDF1', C.tinta2] }[k];
  return <View style={[est.chip, { backgroundColor: col[0] }]}><Text style={[est.chipTxt, { color: col[1] }]}>{texto || estado}</Text></View>;
}

export const Tarjeta = ({ children, style }) => <View style={[est.tarjeta, style]}>{children}</View>;

export const Dato = ({ etiqueta, valor, ultimo }) => (
  <View style={[est.dato, ultimo && { borderBottomWidth: 0 }]}>
    <Text style={est.datoE}>{etiqueta}</Text>
    <Text style={est.datoV}>{valor}</Text>
  </View>
);

export const SeccionT = ({ children }) => <Text style={est.seccion}>{children}</Text>;

export function MiniFecha({ dia, mes, grande }) {
  return (
    <View style={grande ? est.fechaG : est.fechaM}>
      <Text style={[{ fontFamily: SERIF, fontWeight: '600', color: grande ? C.morado : C.tinta }, { fontSize: grande ? 28 : 19 }]}>{dia}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: grande ? C.morado : C.tinta2 }}>{mes}</Text>
    </View>
  );
}

/* Cabecera morada con filete dorado, como en el portal */
export function Cabecera({ titulo, sub, derecha, oscura = C.morado, onVolver }) {
  const ins = useSafeAreaInsets();
  return (
    <View style={[est.cab, { paddingTop: ins.top + 12, backgroundColor: oscura, borderBottomColor: oscura === C.morado ? C.oro : '#C25A67' }]}>
      {onVolver && <Pressable onPress={onVolver} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={10}><Text style={est.volver}>‹ Volver</Text></Pressable>}
      <View style={est.cabFila}>
        <View style={{ flex: 1 }}>
          <Text style={est.cabT} accessibilityRole="header">{titulo}</Text>
          {sub ? <Text style={est.cabS}>{sub}</Text> : null}
        </View>
        {derecha}
      </View>
    </View>
  );
}

export function Pantalla({ children, fondo = C.papel, cabecera }) {
  return (
    <View style={{ flex: 1, backgroundColor: fondo }}>
      {cabecera}
      <ScrollView contentContainerStyle={est.contenido}>{children}</ScrollView>
    </View>
  );
}

export function Vacio({ titulo, texto, children }) {
  return <Tarjeta style={{ alignItems: 'center', paddingVertical: 28 }}><Text style={{ fontSize: 17, fontWeight: '700', color: C.tinta, marginBottom: 6 }}>{titulo}</Text><Text style={{ color: C.tinta2, textAlign: 'center' }}>{texto}</Text>{children}</Tarjeta>;
}

export const est = StyleSheet.create({
  boton: { borderWidth: 1, borderRadius: R.m, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  botonPeq: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: R.s },
  botonTxt: { fontSize: 16, fontWeight: '700' },
  chip: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2 },
  chipTxt: { fontSize: 12.5, fontWeight: '700' },
  tarjeta: { backgroundColor: C.blanco, borderWidth: 1, borderColor: C.linea, borderRadius: 14, padding: 16 },
  dato: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.linea },
  datoE: { color: C.tinta2, fontSize: 15 },
  datoV: { fontWeight: '600', fontSize: 15, color: C.tinta, flexShrink: 1, textAlign: 'right' },
  seccion: { fontSize: 14, fontWeight: '600', color: C.tinta2, marginTop: 4, marginLeft: 2 },
  fechaG: { width: 58, alignItems: 'center', backgroundColor: C.moradoClaro, borderRadius: 12, paddingVertical: 6 },
  fechaM: { width: 44, alignItems: 'center' },
  cab: { paddingHorizontal: 18, paddingBottom: 16, borderBottomWidth: 3 },
  cabFila: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cabT: { color: '#fff', fontFamily: SERIF, fontSize: 26, fontWeight: '600' },
  cabS: { color: '#CDBFD6', fontSize: 14, marginTop: 2 },
  volver: { color: '#E9E1EE', fontWeight: '600', fontSize: 15, marginBottom: 6 },
  contenido: { padding: 16, gap: 14, paddingBottom: 32 }
});
