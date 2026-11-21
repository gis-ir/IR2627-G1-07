/* Calendario de disponibilidad (MOCK-015, CU-004) */
import React, { useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useAlmacen, diaCorto } from '../datos/Almacen';
import { Pantalla, Cabecera, Boton } from '../componentes/UI';
import BotonNotificaciones from '../componentes/BotonNotificaciones';
import { C } from '../tema';

const DIAS = [['2027-03-21', 'Domingo de Ramos'], ['2027-03-22', 'Lunes Santo'], ['2027-03-23', 'Martes Santo'], ['2027-03-24', 'Miércoles Santo'], ['2027-03-25', 'Jueves Santo'], ['2027-03-26', 'Madrugá y Viernes Santo'], ['2027-03-27', 'Sábado Santo'], ['2027-03-28', 'Domingo de Resurrección']];
const FRANJAS = ['mañana', 'tarde', 'noche'];

export default function DisponibilidadScreen({ navigation }) {
  const api = useAlmacen();
  const [disp, setDisp] = useState(() => JSON.parse(JSON.stringify(api.yo.disponibilidad)));
  const [cambios, setCambios] = useState(false);

  const alternar = (d, f) => {
    setDisp(prev => { const l = prev[d] ? [...prev[d]] : []; const i = l.indexOf(f); if (i >= 0) l.splice(i, 1); else l.push(f); return { ...prev, [d]: l }; });
    setCambios(true);
  };
  const guardar = () => { api.guardarDisponibilidad(disp); setCambios(false); Alert.alert('Disponibilidad guardada', 'El coordinador la tendrá en cuenta para cuadrantes y sustituciones.'); };
  const copiar = () => { const n = {}; DIAS.slice(0, 6).forEach(([d]) => { n[d] = ['tarde', 'noche']; }); setDisp(n); setCambios(true); };

  return (
    <Pantalla cabecera={<Cabecera titulo="Disponibilidad" sub="Marca cuándo puedes trabajar" derecha={<BotonNotificaciones navigation={navigation} />} />}>
      <Text style={{ color: C.tinta2, fontSize: 14 }}>El coordinador usa estas franjas para el cuadrante y para avisarte de sustituciones.</Text>
      {DIAS.map(([d, nombre]) => {
        const dc = diaCorto(d);
        return (
          <View key={d} style={est.dia}>
            <View style={est.diaT}><Text style={{ fontWeight: '700', color: C.tinta }}>{nombre}</Text><Text style={{ color: C.tinta3, fontSize: 13 }}>{dc.dia} {dc.mes}</Text></View>
            <View style={est.franjas}>
              {FRANJAS.map(f => {
                const on = (disp[d] || []).includes(f);
                return (
                  <Pressable key={f} onPress={() => alternar(d, f)} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={`${nombre}, ${f}`} style={[est.franja, on && est.franjaOn]}>
                    <Text style={{ fontWeight: '600', color: on ? '#fff' : C.tinta2 }}>{f[0].toUpperCase() + f.slice(1)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
      <Boton tipo="pri" titulo={cambios ? 'Guardar disponibilidad' : 'Disponibilidad guardada'} disabled={!cambios} onPress={guardar} />
      <Boton titulo="Copiar la del año pasado" onPress={copiar} />
    </Pantalla>
  );
}

const est = StyleSheet.create({
  dia: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.linea, borderRadius: 14, padding: 12, paddingHorizontal: 14 },
  diaT: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  franjas: { flexDirection: 'row', gap: 8 },
  franja: { flex: 1, borderWidth: 1, borderColor: C.linea2, borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' },
  franjaOn: { backgroundColor: C.romero, borderColor: C.romero }
});
