/* Alerta de cobertura urgente (MOCK-017, CU-014) */
import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useAlmacen, fechaLarga, citacion } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Dato, Boton, Vacio } from '../componentes/UI';
import { C, SERIF } from '../tema';

function useCuentaAtras(caduca) {
  const calc = () => {
    if (!caduca) return '--:--';
    const fin = new Date(caduca.replace(' ', 'T'));
    const ahora = new Date(); ahora.setFullYear(fin.getFullYear(), fin.getMonth(), fin.getDate());
    const s = Math.round((((fin - ahora) / 1000) % 43200 + 43200) % 43200); // demo: siempre dentro de la ventana de 12 h
    return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`;
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const i = setInterval(() => setT(calc()), 15000); return () => clearInterval(i); }, [caduca]);
  return t;
}

export default function AlertaScreen({ route, navigation }) {
  const api = useAlmacen();
  const b = api.s.bajas.find(x => x.id === route.params?.baja) || api.ofertasPendientes()[0];
  const o = b && b.ofertas.find(x => x.trabajador === api.yo.id);
  const reloj = useCuentaAtras(o && o.caduca);
  const cab = <Cabecera titulo="Cobertura urgente" sub="Se busca sustituto" oscura={C.burdeos} onVolver={() => navigation.goBack()} />;
  if (!b) return <Pantalla cabecera={cab} fondo={C.burdeos}><Vacio titulo="Sin alertas" texto="No tienes ofertas de sustitución pendientes." /></Pantalla>;

  const x = api.turno(b.puesto);
  const abierta = b.estado === 'Abierta' && o && o.estado === 'Enviada';
  const responder = acepta => {
    const ok = api.responderOferta(b.id, acepta);
    if (!ok) return Alert.alert('Puesto ya cubierto', 'Otro compañero ha aceptado antes. Gracias igualmente.');
    if (acepta) Alert.alert('Sustitución aceptada', 'El turno ya aparece en tus turnos.');
    navigation.popToTop();
  };

  return (
    <Pantalla cabecera={cab} fondo={C.burdeos}>
      <Tarjeta>
        <Text style={{ color: C.tinta3, fontSize: 13 }}>{x.h.nombre}</Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: C.tinta, marginVertical: 6 }}>{x.a.funcion}</Text>
        <Dato etiqueta="Día" valor={fechaLarga(x.so.fecha)} />
        <Dato etiqueta="Citación" valor={`${citacion(x.a.horario)} h`} />
        <Dato etiqueta="Lugar" valor={x.h.sede} />
        <Dato etiqueta="Distancia" valor={`${api.distancia(x.h).toFixed(1)} km`} ultimo />
      </Tarjeta>
      {abierta ? (
        <>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#F6D9DD' }}>La oferta caduca en</Text>
            <Text style={{ color: '#fff', fontFamily: SERIF, fontSize: 56, fontWeight: '600', fontVariant: ['tabular-nums'] }} accessibilityLabel={`Caduca en ${reloj} horas y minutos`}>{reloj}</Text>
            <Text style={{ color: '#F6D9DD', fontSize: 13, textAlign: 'center' }}>horas : minutos. El primero en aceptar se queda el puesto.</Text>
          </View>
          <Boton tipo="blanco" titulo="Aceptar sustitución" onPress={() => responder(true)} />
          <Boton tipo="borde" titulo="No puedo" onPress={() => responder(false)} />
        </>
      ) : (
        <Tarjeta><Text style={{ fontWeight: '700', color: C.tinta }}>{b.sustituto === api.yo.id ? 'Has aceptado esta sustitución. Ya aparece en tus turnos.' : 'Esta oferta ya no está disponible.'}</Text></Tarjeta>
      )}
    </Pantalla>
  );
}
