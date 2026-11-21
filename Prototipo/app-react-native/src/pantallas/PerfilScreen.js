/* Mi perfil (MOCK-018, CU-005) y solicitud de capacitación (CU-002) */
import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAlmacen } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Dato, Chip, Boton } from '../componentes/UI';
import BotonNotificaciones from '../componentes/BotonNotificaciones';
import { C } from '../tema';

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function Hoja({ visible, titulo, onCerrar, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={est.fondo}>
        <Pressable style={{ flex: 1 }} onPress={onCerrar} accessibilityLabel="Cerrar" />
        <View style={est.hoja}>
          <Text style={{ fontSize: 19, fontWeight: '700', color: C.tinta, marginBottom: 6 }}>{titulo}</Text>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function PerfilScreen({ navigation }) {
  const api = useAlmacen();
  const t = api.yo;
  const [hoja, setHoja] = useState(null);
  const [form, setForm] = useState({});

  const abrir = (h, valores) => { setForm(valores); setHoja(h); };
  const libres = api.s.funciones.filter(f => !t.capacitaciones.some(c => c.rol === f && c.estado !== 'Rechazada'));

  return (
    <Pantalla cabecera={<Cabecera titulo={t.nombre} sub={t.zona} derecha={<BotonNotificaciones navigation={navigation} />} />}>
      <Tarjeta>
        <Text style={est.h2}>Datos de contacto</Text>
        <Dato etiqueta="Teléfono" valor={t.telefono} />
        <Dato etiqueta="Correo" valor={t.correo} ultimo />
        <Boton peq titulo="Editar datos" style={est.btn} onPress={() => abrir('datos', { telefono: t.telefono, correo: t.correo })} />
      </Tarjeta>
      <Tarjeta>
        <Text style={est.h2}>Uniforme</Text>
        <Dato etiqueta="Talla" valor={t.talla} />
        <Dato etiqueta="Calzado" valor={String(t.calzado)} ultimo />
        <Boton peq titulo="Cambiar tallas" style={est.btn} onPress={() => abrir('tallas', { talla: t.talla, calzado: String(t.calzado) })} />
      </Tarjeta>
      <Tarjeta>
        <Text style={est.h2}>Capacitaciones</Text>
        {t.capacitaciones.map((c, i) => (
          <View key={c.rol} style={[est.cap, i === t.capacitaciones.length - 1 && { borderBottomWidth: 0 }]}><Text style={{ color: C.tinta, fontSize: 15 }}>{c.rol}</Text><Chip estado={c.estado} /></View>
        ))}
        <Boton peq tipo="pri" titulo="Solicitar nueva capacitación" style={est.btn} disabled={!libres.length} onPress={() => abrir('cap', { rol: libres[0], experiencia: '' })} />
      </Tarjeta>
      <Boton titulo="Cerrar sesión" onPress={() => api.salir()} />

      <Hoja visible={hoja === 'datos'} titulo="Editar datos" onCerrar={() => setHoja(null)}>
        <Text style={est.etq}>Teléfono</Text><TextInput style={est.input} keyboardType="phone-pad" value={form.telefono} onChangeText={v => setForm({ ...form, telefono: v })} />
        <Text style={est.etq}>Correo</Text><TextInput style={est.input} keyboardType="email-address" autoCapitalize="none" value={form.correo} onChangeText={v => setForm({ ...form, correo: v })} />
        <Boton tipo="pri" titulo="Guardar" style={{ marginTop: 12 }} onPress={() => { api.actualizarPerfil({ telefono: form.telefono, correo: form.correo }); setHoja(null); }} />
      </Hoja>

      <Hoja visible={hoja === 'tallas'} titulo="Tallas de uniforme" onCerrar={() => setHoja(null)}>
        <Text style={est.etq}>Talla</Text>
        <View style={est.tallas}>{TALLAS.map(x => (
          <Pressable key={x} onPress={() => setForm({ ...form, talla: x })} style={[est.talla, form.talla === x && est.tallaOn]} accessibilityRole="radio" accessibilityState={{ checked: form.talla === x }}><Text style={{ fontWeight: '700', color: form.talla === x ? '#fff' : C.tinta }}>{x}</Text></Pressable>
        ))}</View>
        <Text style={est.etq}>Calzado</Text><TextInput style={est.input} keyboardType="number-pad" value={form.calzado} onChangeText={v => setForm({ ...form, calzado: v })} />
        <Boton tipo="pri" titulo="Guardar" style={{ marginTop: 12 }} onPress={() => { api.actualizarPerfil({ talla: form.talla, calzado: parseInt(form.calzado, 10) || t.calzado }); setHoja(null); }} />
      </Hoja>

      <Hoja visible={hoja === 'cap'} titulo="Solicitar capacitación" onCerrar={() => setHoja(null)}>
        <Text style={est.etq}>Puesto</Text>
        <View style={est.tallas}>{libres.map(f => (
          <Pressable key={f} onPress={() => setForm({ ...form, rol: f })} style={[est.talla, { paddingHorizontal: 12 }, form.rol === f && est.tallaOn]} accessibilityRole="radio" accessibilityState={{ checked: form.rol === f }}><Text style={{ fontWeight: '600', color: form.rol === f ? '#fff' : C.tinta }}>{f}</Text></Pressable>
        ))}</View>
        <Text style={est.etq}>Tu experiencia</Text>
        <TextInput style={[est.input, { minHeight: 90, textAlignVertical: 'top' }]} multiline placeholder="Dónde y cuánto tiempo lo has hecho" placeholderTextColor={C.tinta3} value={form.experiencia} onChangeText={v => setForm({ ...form, experiencia: v })} />
        <Boton tipo="pri" titulo="Enviar solicitud" style={{ marginTop: 12 }} onPress={() => {
          if (!form.experiencia?.trim()) return Alert.alert('Falta la experiencia', 'Cuéntale al coordinador dónde y cuánto tiempo lo has hecho.');
          api.solicitarCapacitacion(form.rol, form.experiencia.trim()); setHoja(null); Alert.alert('Solicitud enviada', 'Recibirás el resultado por notificación.');
        }} />
      </Hoja>
    </Pantalla>
  );
}

const est = StyleSheet.create({
  h2: { fontSize: 17, fontWeight: '700', color: C.tinta, marginBottom: 4 },
  btn: { alignSelf: 'flex-start', marginTop: 10 },
  cap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.linea },
  fondo: { flex: 1, backgroundColor: 'rgba(34,25,42,.45)' },
  hoja: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, paddingBottom: 36, gap: 6 },
  etq: { fontSize: 13, fontWeight: '600', color: C.tinta2, marginTop: 8 },
  input: { borderWidth: 1, borderColor: C.linea2, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: C.tinta },
  tallas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  talla: { borderWidth: 1, borderColor: C.linea2, borderRadius: 8, paddingVertical: 8, minWidth: 48, alignItems: 'center' },
  tallaOn: { backgroundColor: C.morado, borderColor: C.morado }
});
