/* Mis turnos (CU-016) con el aviso de cobertura urgente (CU-014) */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAlmacen, fechaLarga, diaCorto, citacion } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Chip, Boton, SeccionT, MiniFecha, Vacio } from '../componentes/UI';
import BotonNotificaciones from '../componentes/BotonNotificaciones';
import { C } from '../tema';

const textoAcuse = a => (a === 'Pendiente' ? 'Sin confirmar' : 'Confirmado');

export default function TurnosScreen({ navigation }) {
  const api = useAlmacen();
  const turnos = api.misTurnos();
  const ofertas = api.ofertasPendientes();
  const [prox, ...resto] = turnos;

  return (
    <Pantalla cabecera={<Cabecera titulo={`Hola, ${api.yo.nombre.split(' ')[0]}`} sub="Semana Santa 2027" derecha={<BotonNotificaciones navigation={navigation} />} />}>
      {ofertas.map(b => {
        const x = api.turno(b.puesto);
        return (
          <Pressable key={b.id} style={est.urgente} onPress={() => navigation.navigate('Alerta', { baja: b.id })} accessibilityRole="button">
            <Text style={est.urgSub}>Cobertura urgente</Text>
            <Text style={est.urgT}>{x.a.funcion}, {x.h.nombre}</Text>
            <Text style={est.urgSub}>{fechaLarga(x.so.fecha)}, {citacion(x.a.horario)}</Text>
            <View style={est.urgIr}><Text style={{ color: C.burdeos, fontWeight: '700' }}>Ver y responder</Text></View>
          </Pressable>
        );
      })}

      {prox && (
        <>
          <SeccionT>Tu próximo turno</SeccionT>
          <Tarjeta style={{ padding: 0, overflow: 'hidden' }}>
            <Pressable onPress={() => navigation.navigate('Detalle', { asignacion: prox.a.id })} style={est.proxCab} accessibilityRole="button">
              <MiniFecha {...diaCorto(prox.so.fecha)} grande />
              <View style={{ flex: 1 }}>
                <Text style={est.proxT}>{prox.a.puesto}</Text>
                <Text style={est.muted}>{prox.h.nombre}</Text>
                <Text style={est.muted}>Citación {citacion(prox.a.horario)} h</Text>
              </View>
            </Pressable>
            <View style={est.proxPie}>
              <Chip estado={prox.a.acuse} texto={textoAcuse(prox.a.acuse)} />
              {prox.a.acuse === 'Pendiente'
                ? <Boton peq tipo="pri" titulo="Confirmar recepción" onPress={() => api.confirmar(prox.a.id)} />
                : <Boton peq titulo="Ver detalle" onPress={() => navigation.navigate('Detalle', { asignacion: prox.a.id })} />}
            </View>
          </Tarjeta>
        </>
      )}

      {resto.length > 0 && (
        <>
          <SeccionT>Más turnos</SeccionT>
          <Tarjeta style={{ padding: 0 }}>
            {resto.map((x, i) => (
              <Pressable key={x.a.id} onPress={() => navigation.navigate('Detalle', { asignacion: x.a.id })} style={[est.fila, i === resto.length - 1 && { borderBottomWidth: 0 }]}>
                <MiniFecha {...diaCorto(x.so.fecha)} />
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', color: C.tinta }}>{x.a.puesto}</Text><Text style={est.muted}>{x.h.nombre}</Text></View>
                <Chip estado={x.a.acuse} texto={textoAcuse(x.a.acuse)} />
              </Pressable>
            ))}
          </Tarjeta>
        </>
      )}

      {!turnos.length && !ofertas.length && (
        <Vacio titulo="Sin turnos asignados" texto="Cuando el coordinador publique un cuadrante en el que estés, te avisaremos. Mantén al día tu disponibilidad.">
          <Boton peq titulo="Marcar disponibilidad" onPress={() => navigation.navigate('Disponibilidad')} style={{ marginTop: 12 }} />
        </Vacio>
      )}
    </Pantalla>
  );
}

const est = StyleSheet.create({
  urgente: { backgroundColor: C.burdeos, borderRadius: 14, padding: 16 },
  urgSub: { color: '#F6D9DD', fontSize: 14 },
  urgT: { color: '#fff', fontSize: 17, fontWeight: '700', marginVertical: 3 },
  urgIr: { alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10 },
  proxCab: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 16 },
  proxT: { fontSize: 18, fontWeight: '700', color: C.tinta },
  proxPie: { borderTopWidth: 1, borderTopColor: C.linea, padding: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.linea },
  muted: { color: C.tinta2 }
});
