/* Coordinador y administrador en el móvil: lo urgente durante la Semana Santa en la calle */
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAlmacen, fechaLarga, diaCorto, citacion } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Chip, Dato, Boton, SeccionT, MiniFecha, Vacio, Fila, Lista, Telefono, SoloWeb } from '../componentes/UI';
import { C } from '../tema';

/* Hoy: lo que necesita atención (CU-018) */
export function HoyScreen({ navigation }) {
  const api = useAlmacen(); const s = api.s;
  const bajas = s.bajas.filter(b => b.estado === 'Abierta').length;
  const pub = s.cuadrantes.filter(c => c.estado === 'Publicado').sort((a, b) => api.sol(a).fecha.localeCompare(api.sol(b).fecha));
  const sinConf = pub.reduce((n, c) => n + c.puestos.filter(a => a.acuse === 'Pendiente').length, 0);
  const presup = s.presupuestos.filter(p => p.estado === 'Enviado').length;
  const capac = s.trabajadores.reduce((n, t) => n + t.capacitaciones.filter(c => c.estado === 'Pendiente').length, 0);
  const kpi = (n, txt, destino, alerta) => (
    <Pressable onPress={() => navigation.navigate(destino)} style={[est.kpi, alerta && est.kpiAlerta]} accessibilityRole="button" accessibilityLabel={`${n} ${txt}`}>
      <Text style={[est.kpiN, alerta && { color: '#fff' }]}>{n}</Text><Text style={[est.kpiT, alerta && { color: '#F6D9DD' }]}>{txt}</Text>
    </Pressable>);
  return (
    <Pantalla cabecera={<Cabecera titulo={`Hola, ${api.sesion.nombre.split(' ')[0]}`} sub={api.rol} />}>
      <View style={est.kpis}>
        {kpi(bajas, 'Bajas urgentes abiertas', 'Bajas', bajas > 0)}
        {kpi(sinConf, 'Turnos sin confirmar', 'Cuadrantes')}
        {kpi(presup, 'Presupuestos sin respuesta', 'PresupuestosG')}
        {kpi(capac, 'Capacitaciones por validar', 'Capacitaciones')}
      </View>
      <SeccionT>Próximos servicios</SeccionT>
      <Lista>{pub.map((c, i) => { const so = api.sol(c); const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length; const baja = c.puestos.some(a => a.acuse === 'Baja');
        return <Fila key={c.id} ultimo={i === pub.length - 1} izquierda={<MiniFecha {...diaCorto(so.fecha)} />} titulo={api.hermandad(so.hermandad).nombre} detalle={`${citacion(so.horario)} h, ${conf} de ${c.puestos.length} confirmados`} derecha={<Chip estado={baja ? 'Baja' : conf === c.puestos.length ? 'Confirmado' : 'Pendiente'} texto={baja ? 'Baja' : conf === c.puestos.length ? 'Completo' : 'Pendiente'} />} onPress={() => navigation.navigate('Cuadrante', { id: c.id })} />; })}</Lista>
      <Boton titulo="Publicar un aviso a la plantilla" onPress={() => navigation.navigate('TablonG')} />
    </Pantalla>
  );
}

/* Bajas urgentes (CU-012, CU-013, CU-015) */
export function BajasScreen({ navigation }) {
  const api = useAlmacen();
  const abiertas = api.s.bajas.filter(b => b.estado === 'Abierta'); const cubiertas = api.s.bajas.filter(b => b.estado !== 'Abierta');
  const fila = (b, i, arr) => { const x = api.turno(b.puesto); const env = b.ofertas.filter(o => o.estado === 'Enviada').length;
    return <Fila key={b.id} ultimo={i === arr.length - 1} izquierda={<MiniFecha {...diaCorto(x.so.fecha)} />} titulo={x.a.puesto} detalle={`${x.h.nombre}. ${b.estado === 'Abierta' ? `${env} oferta${env !== 1 ? 's' : ''} pendiente${env !== 1 ? 's' : ''}` : `Cubierta por ${api.trabajador(b.sustituto).nombre}`}`} derecha={<Chip estado={b.estado} />} onPress={() => navigation.navigate('BajaDetalle', { id: b.id })} />; };
  return (
    <Pantalla cabecera={<Cabecera titulo="Bajas urgentes" sub="Vacantes de última hora" />}>
      {abiertas.length ? <Lista>{abiertas.map(fila)}</Lista> : <Vacio titulo="No hay bajas abiertas" texto="Cuando un trabajador comunique una baja, aparecerá aquí al momento." />}
      {cubiertas.length > 0 && <><SeccionT>Cubiertas</SeccionT><Lista>{cubiertas.map(fila)}</Lista></>}
    </Pantalla>
  );
}

export function BajaScreen2({ route, navigation }) {
  const api = useAlmacen();
  const b = api.s.bajas.find(x => x.id === route.params?.id);
  const x = api.turno(b.puesto); const cands = b.estado === 'Abierta' ? api.candidatos(x.c, x.a) : [];
  const oferta = tid => b.ofertas.find(o => o.trabajador === tid);
  const asignar = t => Alert.alert('Registrar sustitución', `${t.nombre} ocupará el puesto y se actualizará el cuadrante.`, [{ text: 'Volver', style: 'cancel' }, { text: 'Asignar', onPress: () => { api.asignarSustituto(b.id, t.id); navigation.goBack(); } }]);
  const sinOferta = cands.filter(c => { const o = oferta(c.t.id); return !o || o.estado === 'Rechazada'; }).map(c => c.t.id);
  return (
    <Pantalla cabecera={<Cabecera titulo={x.a.puesto} sub={x.h.nombre} onVolver={() => navigation.goBack()} />}>
      <Tarjeta>
        <Dato etiqueta="Día" valor={fechaLarga(x.so.fecha)} />
        <Dato etiqueta="Citación" valor={`${citacion(x.a.horario)} h, ${x.h.sede}`} />
        <Dato etiqueta="Baja de" valor={api.trabajador(b.trabajador).nombre} />
        <Dato etiqueta="Motivo" valor={`${b.motivo}${b.explicacion ? `. ${b.explicacion}` : ''}`} ultimo={!b.sustituto} />
        {b.sustituto ? <Dato etiqueta="Cubierta por" valor={api.trabajador(b.sustituto).nombre} ultimo /> : null}
      </Tarjeta>
      {b.estado === 'Abierta' && (cands.length ? <>
        <SeccionT>Candidatos (habilitados y libres ese día)</SeccionT>
        <Lista>{cands.map((c, i) => { const o = oferta(c.t.id);
          return (
            <Fila key={c.t.id} ultimo={i === cands.length - 1} titulo={c.t.nombre} detalle={`${c.disp ? 'Disponible ese día' : 'Disponibilidad no declarada'}, a ${c.km.toFixed(1)} km`} derecha={o ? <Chip estado={o.estado} /> : null}>
              <View style={est.botones}>
                <Telefono numero={c.t.telefono} />
                <View style={{ flex: 1 }} />
                {(!o || o.estado === 'Rechazada') && <Boton peq titulo="Enviar alerta" onPress={() => api.enviarAlerta(b.id, [c.t.id])} />}
                <Boton peq tipo="pri" titulo="Asignar" onPress={() => asignar(c.t)} />
              </View>
            </Fila>); })}</Lista>
        <Boton tipo="urg" titulo="Enviar alerta a todos" disabled={!sinOferta.length} onPress={() => api.enviarAlerta(b.id, sinOferta)} />
      </> : <Vacio titulo="Sin candidatos libres" texto="Ningún trabajador habilitado está libre ese día. Puedes publicar un aviso en el tablón." />)}
    </Pantalla>
  );
}

/* Cuadrantes y acuses (CU-016, CU-018) */
export function CuadrantesScreen({ navigation }) {
  const api = useAlmacen();
  const cs = [...api.s.cuadrantes].sort((a, b) => api.sol(a).fecha.localeCompare(api.sol(b).fecha));
  return (
    <Pantalla cabecera={<Cabecera titulo="Cuadrantes" sub="Personal y confirmaciones" />}>
      <Lista>{cs.map((c, i) => { const so = api.sol(c); const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
        return <Fila key={c.id} ultimo={i === cs.length - 1} izquierda={<MiniFecha {...diaCorto(so.fecha)} />} titulo={api.hermandad(so.hermandad).nombre} detalle={c.estado === 'Publicado' ? `${conf} de ${c.puestos.length} confirmados` : `${c.puestos.filter(a => a.trabajador).length} de ${c.puestos.length} cubiertos`} derecha={<Chip estado={c.estado} />} onPress={() => navigation.navigate('Cuadrante', { id: c.id })} />; })}</Lista>
      <SoloWeb>Generar, editar y publicar cuadrantes se hace desde el portal web, donde cabe la tabla completa.</SoloWeb>
    </Pantalla>
  );
}

export function CuadranteScreen({ route, navigation }) {
  const api = useAlmacen();
  const c = api.cuadrante(route.params?.id); const so = api.sol(c); const pub = c.estado === 'Publicado';
  const pend = c.puestos.filter(a => a.acuse === 'Pendiente').length;
  return (
    <Pantalla cabecera={<Cabecera titulo={api.hermandad(so.hermandad).nombre} sub={`${fechaLarga(so.fecha)}, ${citacion(so.horario)} h`} onVolver={() => navigation.goBack()} />}>
      <Lista>{c.puestos.map((a, i) => { const t = api.trabajador(a.trabajador); const baja = a.acuse === 'Baja';
        return (
          <Fila key={a.id} ultimo={i === c.puestos.length - 1} titulo={a.puesto} detalle={baja ? 'Buscando sustituto' : t ? t.nombre : 'Sin cubrir'} derecha={pub ? <Chip estado={a.acuse} texto={a.acuse === 'Pendiente' ? 'Sin confirmar' : a.acuse} /> : null}>
            {(t && !baja) || (pub && a.acuse === 'Pendiente') ? <View style={est.botones}>
              {t && !baja ? <Telefono numero={t.telefono} /> : null}<View style={{ flex: 1 }} />
              {pub && a.acuse === 'Pendiente' && t ? <Boton peq titulo={a.recordado ? 'Recordar otra vez' : 'Recordar'} onPress={() => api.recordar(c.id, a.id)} /> : null}
            </View> : null}
          </Fila>); })}</Lista>
      {pub ? <Boton tipo="pri" titulo={`Recordar a los ${pend} pendientes`} disabled={!pend} onPress={() => { const n = api.recordar(c.id); Alert.alert('Recordatorio enviado', `Se ha avisado a ${n} trabajador${n !== 1 ? 'es' : ''}.`); }} />
        : <SoloWeb>Este cuadrante está en borrador. Se termina y publica desde el portal web.</SoloWeb>}
    </Pantalla>
  );
}

const est = StyleSheet.create({
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: { width: '48%', flexGrow: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: C.linea, borderRadius: 14, padding: 14 },
  kpiAlerta: { backgroundColor: C.burdeos, borderColor: C.burdeos },
  kpiN: { fontSize: 28, fontWeight: '700', color: C.tinta },
  kpiT: { fontSize: 13.5, color: C.tinta2 },
  botones: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }
});
