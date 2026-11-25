/* Inicio de sesión (MOCK-006, CU-031) */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlmacen } from '../datos/Almacen';
import { Boton } from '../componentes/UI';
import { Cirio } from '../componentes/Iconos';
import { C, SERIF } from '../tema';

export default function LoginScreen() {
  const api = useAlmacen();
  const ins = useSafeAreaInsets();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const demo = c => { setCorreo(c); setClave('demo'); setError(''); };
  const [error, setError] = useState('');

  const entrar = () => {
    if (!correo.trim() || !clave) return setError('Escribe tu correo y tu contraseña.');
    const e = api.entrar(correo, clave);
    if (e) setError(e);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.morado }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[est.arriba, { paddingTop: ins.top + 40 }]}>
        <Cirio alto={46} />
        <Text style={est.titulo}>Servicios Cofrades</Text>
        <Text style={est.sub}>Turnos, cuadrantes, bajas y presupuestos desde el móvil, también en plena calle.</Text>
      </View>
      <View style={[est.form, { paddingBottom: ins.bottom + 28 }]}>
        <Text style={est.etq}>Correo electrónico</Text>
        <TextInput style={est.input} value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" autoComplete="email" accessibilityLabel="Correo electrónico" />
        <Text style={est.etq}>Contraseña</Text>
        <TextInput style={est.input} value={clave} onChangeText={setClave} secureTextEntry autoComplete="password" accessibilityLabel="Contraseña" onSubmitEditing={entrar} />
        {error ? <Text style={est.error} accessibilityRole="alert">{error}</Text> : null}
        <Boton titulo="Entrar" tipo="pri" onPress={entrar} style={{ marginTop: 6 }} />
        <View style={est.demo}>
          <Text style={{ color: C.tinta2, fontSize: 13 }}>Cuentas de prueba (contraseña demo):</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
            {[['juan.perez@correo.es', 'Trabajador'], ['luis@chamorrocofrades.es', 'Coordinador'], ['admin@chamorrocofrades.es', 'Administrador'], ['secretaria@hdadestrella.es', 'Hermandad']].map(([c, n]) => (
              <Pressable key={c} onPress={() => demo(c)} accessibilityRole="button" hitSlop={6}><Text style={{ color: C.morado2, fontWeight: '700', fontSize: 13, textDecorationLine: 'underline' }}>{n}</Text></Pressable>))}
          </View>
          <Pressable onPress={() => api.reiniciar()} style={{ marginTop: 8 }}><Text style={{ color: C.tinta3, fontSize: 13 }}>Restablecer datos de demostración</Text></Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const est = StyleSheet.create({
  arriba: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 28, paddingBottom: 28, gap: 10 },
  titulo: { color: '#fff', fontFamily: SERIF, fontSize: 42, lineHeight: 44, fontWeight: '500' },
  sub: { color: '#CDBFD6', fontSize: 16 },
  form: { backgroundColor: C.papel, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 3, borderTopColor: C.oro, padding: 22, gap: 8 },
  etq: { fontSize: 13, fontWeight: '600', color: C.tinta2, marginTop: 6 },
  input: { borderWidth: 1, borderColor: C.linea2, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 11, fontSize: 16, color: C.tinta },
  error: { color: C.burdeos, fontWeight: '600' },
  demo: { borderWidth: 1, borderStyle: 'dashed', borderColor: C.linea2, borderRadius: 10, padding: 10, backgroundColor: '#fff', marginTop: 4 }
});
