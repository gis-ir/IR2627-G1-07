/* Tablón de avisos (MOCK-025, CU-020) y detalle de un aviso */
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAlmacen, diaCorto, fecha, hora } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, MiniFecha, Vacio } from '../componentes/UI';
import BotonNotificaciones from '../componentes/BotonNotificaciones';
import { C } from '../tema';

export function AvisosScreen({ navigation }) {
  const api = useAlmacen();
  const avisos = api.avisos();
  return (
    <Pantalla cabecera={<Cabecera titulo="Avisos" sub="Del coordinador a la plantilla" derecha={<BotonNotificaciones navigation={navigation} />} />}>
      {avisos.length ? (
        <Tarjeta style={{ padding: 0 }}>
          {avisos.map((v, i) => {
            const nuevo = !v.leidos.includes(api.yo.id);
            return (
              <Pressable key={v.id} onPress={() => navigation.navigate('Aviso', { aviso: v.id })} style={[est.fila, i === avisos.length - 1 && { borderBottomWidth: 0 }]} accessibilityRole="button" accessibilityLabel={`${nuevo ? 'Nuevo. ' : ''}${v.titulo}`}>
                <MiniFecha {...diaCorto(v.fecha)} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: nuevo ? '700' : '500', color: C.tinta }}>{v.titulo}</Text>
                  <Text numberOfLines={1} style={{ color: C.tinta3, fontSize: 13 }}>{v.texto}</Text>
                </View>
                {nuevo && <View style={est.nuevo}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>NUEVO</Text></View>}
              </Pressable>
            );
          })}
        </Tarjeta>
      ) : <Vacio titulo="Sin avisos" texto="Aquí verás las comunicaciones del coordinador." />}
    </Pantalla>
  );
}

export function AvisoScreen({ route, navigation }) {
  const api = useAlmacen();
  const v = api.s.avisos.find(x => x.id === route.params?.aviso);
  useEffect(() => { if (v) api.leerAviso(v.id); }, [v && v.id]);
  if (!v) return <Pantalla cabecera={<Cabecera titulo="Aviso" onVolver={() => navigation.goBack()} />}><Vacio titulo="Aviso no encontrado" texto="Puede que se haya retirado del tablón." /></Pantalla>;
  return (
    <Pantalla cabecera={<Cabecera titulo="Aviso" onVolver={() => navigation.goBack()} />}>
      <Tarjeta>
        <Text style={{ fontSize: 21, fontWeight: '700', color: C.tinta }}>{v.titulo}</Text>
        <Text style={{ color: C.tinta3, fontSize: 13, marginTop: 4, marginBottom: 12 }}>{v.autor}, {fecha(v.fecha)} a las {hora(v.fecha)}. Para {v.destinatarios.join(', ').toLowerCase()}.</Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: C.tinta }}>{v.texto}</Text>
      </Tarjeta>
    </Pantalla>
  );
}

export function NotificacionesScreen({ navigation }) {
  const api = useAlmacen();
  const ns = api.notificaciones();
  useEffect(() => () => api.leerNotificaciones(), []);
  const abrir = n => {
    if (n.tipo === 'urgente') navigation.navigate('Alerta', { baja: n.ref });
    else if (n.tipo === 'turno' && api.turno(n.ref)) navigation.navigate('Detalle', { asignacion: n.ref });
  };
  return (
    <Pantalla cabecera={<Cabecera titulo="Notificaciones" onVolver={() => navigation.goBack()} />}>
      {ns.length ? (
        <Tarjeta style={{ padding: 0 }}>
          {ns.map((n, i) => (
            <Pressable key={n.id} onPress={() => abrir(n)} style={[est.fila, i === ns.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: n.leida ? 'transparent' : n.tipo === 'urgente' ? C.burdeos : C.oro }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: n.leida ? '500' : '700', color: C.tinta }}>{n.titulo}</Text>
                <Text style={{ color: C.tinta2, fontSize: 14 }}>{n.texto}</Text>
              </View>
              <Text style={{ color: C.tinta3, fontSize: 12 }}>{fecha(n.fecha).slice(0, 5)}</Text>
            </Pressable>
          ))}
        </Tarjeta>
      ) : <Vacio titulo="Sin notificaciones" texto="Te avisaremos de turnos, sustituciones y avisos." />}
    </Pantalla>
  );
}

const est = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.linea },
  nuevo: { backgroundColor: C.oro, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 }
});
