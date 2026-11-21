import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAlmacen } from '../datos/Almacen';
import { C } from '../tema';

export default function BotonNotificaciones({ navigation }) {
  const n = useAlmacen().notificaciones().filter(x => !x.leida).length;
  return (
    <Pressable onPress={() => navigation.navigate('Notificaciones')} accessibilityRole="button" accessibilityLabel={`Notificaciones${n ? `, ${n} sin leer` : ''}`}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,.1)', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>🔔︎</Text>
      {n > 0 && <View style={{ position: 'absolute', top: 4, right: 4, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: C.burdeos, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.morado, paddingHorizontal: 3 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{n}</Text></View>}
    </Pressable>
  );
}
