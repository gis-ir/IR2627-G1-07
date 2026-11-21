/* Detalle del servicio (MOCK-014, CU-016, CU-017) */
import React from 'react';
import { View, Text, Linking } from 'react-native';
import { useAlmacen, fechaLarga, citacion } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Chip, Dato, Boton, Vacio } from '../componentes/UI';
import { C } from '../tema';

export default function DetalleScreen({ route, navigation }) {
  const api = useAlmacen();
  const x = api.turno(route.params?.asignacion);
  const cab = <Cabecera titulo="Detalle del servicio" onVolver={() => navigation.goBack()} />;
  if (!x) return <Pantalla cabecera={cab}><Vacio titulo="Turno no encontrado" texto="Puede que el coordinador lo haya cambiado." /></Pantalla>;

  const companeros = x.c.puestos.filter(p => p.trabajador && p.trabajador !== api.yo.id && p.acuse !== 'Baja')
    .map(p => `${api.s.trabajadores.find(t => t.id === p.trabajador).nombre} (${p.puesto.replace(/ \d+$/, '').toLowerCase()})`);
  const uniformidad = (api.s.eventos.find(e => e.id === x.so.evento) || {}).notas || 'Dalmática y cíngulo';

  return (
    <Pantalla cabecera={cab}>
      <Tarjeta>
        <Text style={{ color: C.tinta3, fontSize: 13 }}>{x.h.nombre}</Text>
        <Text style={{ fontSize: 21, fontWeight: '700', color: C.tinta, marginVertical: 4 }}>{x.a.puesto}</Text>
        <Chip estado={x.a.acuse} texto={x.a.acuse === 'Pendiente' ? 'Sin confirmar' : x.a.acuse} />
        <View style={{ marginTop: 10 }}>
          <Dato etiqueta="Acto" valor={x.so.acto.replace('Estación de penitencia, ', '')} />
          <Dato etiqueta="Día" valor={fechaLarga(x.so.fecha)} />
          <Dato etiqueta="Citación" valor={`${citacion(x.a.horario)} h`} />
          <Dato etiqueta="Lugar" valor={x.h.sede} />
          <Dato etiqueta="Uniformidad" valor={uniformidad} />
          <Dato etiqueta="Compañeros" valor={companeros.join(', ') || '—'} ultimo />
        </View>
      </Tarjeta>
      {x.a.acuse === 'Pendiente' && <Boton tipo="pri" titulo="Confirmar recepción del turno" onPress={() => api.confirmar(x.a.id)} />}
      <Boton titulo="Ver ubicación" onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.h.sede + ', Sevilla')}`)} />
      {x.a.acuse !== 'Baja' && <Boton tipo="peligro" titulo="No puedo asistir" onPress={() => navigation.navigate('Baja', { asignacion: x.a.id })} />}
    </Pantalla>
  );
}
