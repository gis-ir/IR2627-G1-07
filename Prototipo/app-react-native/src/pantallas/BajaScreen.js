/* Notificar baja urgente (MOCK-016, CU-011) */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useAlmacen, fechaLarga, citacion } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Boton, SeccionT } from '../componentes/UI';
import { C } from '../tema';

const MOTIVOS = ['Enfermedad', 'Motivos familiares', 'Trabajo o estudios', 'Otro motivo'];

export default function BajaScreen({ route, navigation }) {
  const api = useAlmacen();
  const x = api.turno(route.params?.asignacion);
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [explicacion, setExplicacion] = useState('');

  const enviar = () => {
    if (motivo === 'Otro motivo' && !explicacion.trim()) return Alert.alert('Falta la explicación', 'Cuéntale al coordinador qué ha pasado.');
    Alert.alert('Comunicar baja', 'Tu puesto quedará libre y el coordinador buscará un sustituto.', [
      { text: 'Volver', style: 'cancel' },
      { text: 'Comunicar baja', style: 'destructive', onPress: () => { api.comunicarBaja(x.a.id, motivo, explicacion.trim()); navigation.popToTop(); } }
    ]);
  };

  return (
    <Pantalla cabecera={<Cabecera titulo="Comunicar baja" onVolver={() => navigation.goBack()} />}>
      <Tarjeta>
        <Text style={{ fontWeight: '700', color: C.tinta }}>{x.a.puesto}</Text>
        <Text style={{ color: C.tinta3, fontSize: 13 }}>{x.h.nombre}, {fechaLarga(x.so.fecha)} a las {citacion(x.a.horario)}</Text>
      </Tarjeta>
      <SeccionT>Motivo</SeccionT>
      <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
        {MOTIVOS.map(m => (
          <Pressable key={m} onPress={() => setMotivo(m)} accessibilityRole="radio" accessibilityState={{ checked: motivo === m }} style={[est.opcion, motivo === m && est.opcionSel]}>
            <View style={[est.radio, motivo === m && { borderColor: C.morado }]}>{motivo === m && <View style={est.radioIn} />}</View>
            <Text style={{ fontSize: 15, color: C.tinta }}>{m}</Text>
          </Pressable>
        ))}
      </View>
      <SeccionT>Explicación</SeccionT>
      <TextInput style={est.area} multiline value={explicacion} onChangeText={setExplicacion} placeholder="Cuéntale al coordinador qué ha pasado" placeholderTextColor={C.tinta3} accessibilityLabel="Explicación" />
      <View style={est.nota}><Text style={{ color: C.tinta }}>Tu puesto quedará libre al instante y el coordinador buscará un sustituto.</Text></View>
      <Boton tipo="urg" titulo="Comunicar baja" onPress={enviar} />
    </Pantalla>
  );
}

const est = StyleSheet.create({
  opcion: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.linea2, borderRadius: 12, padding: 14, backgroundColor: '#fff' },
  opcionSel: { borderColor: C.morado, backgroundColor: C.moradoClaro, borderWidth: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.linea2, alignItems: 'center', justifyContent: 'center' },
  radioIn: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.morado },
  area: { minHeight: 96, borderWidth: 1, borderColor: C.linea2, borderRadius: 8, backgroundColor: '#fff', padding: 12, fontSize: 15, textAlignVertical: 'top', color: C.tinta },
  nota: { backgroundColor: C.burdeosClaro, borderLeftWidth: 3, borderLeftColor: C.burdeos, padding: 12, borderTopRightRadius: 8, borderBottomRightRadius: 8 }
});
