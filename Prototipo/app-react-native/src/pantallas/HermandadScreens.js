/* Hermandades en el móvil: solicitudes, cortejo, presupuestos y nuevas solicitudes */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useAlmacen, fecha, fechaLarga, diaCorto, citacion, euros } from '../datos/Almacen';
import { Pantalla, Cabecera, Boton, SeccionT, MiniFecha, Vacio, Fila, Lista, Hoja, Telefono, est as estUI, Chip } from '../componentes/UI';
import { C } from '../tema';

const Flecha = () => <Text style={{ color: C.tinta3, fontSize: 20 }}>›</Text>;

/* Inicio: mis solicitudes (CU-028) */
export function HermInicioScreen({ navigation }) {
  const api = useAlmacen(); const hid = api.sesion.hermandad; const h = api.hermandad(hid);
  const sol = api.s.solicitudes.filter(x => x.hermandad === hid && x.estado !== 'Finalizado').sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pend = api.s.presupuestos.filter(p => p.estado === 'Enviado' && api.solicitud(p.solicitud).hermandad === hid);
  const abrir = x => { const p = api.presupuestoDeSolicitud(x.id); const c = p && api.cuadranteDePresupuesto(p.id);
    if (c && c.estado === 'Publicado') navigation.navigate('Cortejo', { id: c.id }); else if (p) navigation.navigate('Presupuesto', { id: p.id }); };
  return (
    <Pantalla cabecera={<Cabecera titulo={h.nombre} sub="Mis solicitudes" />}>
      {pend.length > 0 && <Pressable onPress={() => navigation.navigate('Presupuesto', { id: pend[0].id })} style={{ backgroundColor: C.morado, borderRadius: 14, padding: 16 }} accessibilityRole="button">
        <Text style={{ color: '#CDBFD6' }}>Presupuesto pendiente de respuesta</Text>
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', marginTop: 3 }}>{pend[0].codigo}, {euros(api.totales(pend[0]).total)}</Text>
        <View style={{ alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10 }}><Text style={{ color: C.morado, fontWeight: '700' }}>Revisar</Text></View>
      </Pressable>}
      {sol.length ? <Lista>{sol.map((x, i) => <Fila key={x.id} ultimo={i === sol.length - 1} izquierda={<MiniFecha {...diaCorto(x.fecha)} />} titulo={x.acto} detalle={`${x.funciones.reduce((n, f) => n + f.cantidad, 0)} personas, ${x.horario}`} derecha={<Chip estado={x.estado} />} onPress={() => abrir(x)} />)}</Lista>
        : <Vacio titulo="Todavía no hay solicitudes" texto="Solicitad vuestro primer servicio con el acto, la fecha y el personal." />}
      <Boton tipo="pri" titulo="Solicitar un servicio" onPress={() => navigation.navigate('Solicitar')} />
    </Pantalla>
  );
}

/* Cuadrante del cortejo e incidencias (CU-028, CU-024) */
export function CortejoScreen({ route, navigation }) {
  const api = useAlmacen(); const hid = api.sesion.hermandad;
  const mios = api.s.cuadrantes.filter(c => c.estado === 'Publicado' && api.sol(c).hermandad === hid);
  const [sel, setSel] = useState(route.params?.id);
  const c = mios.find(x => x.id === sel) || mios[0];
  const [inc, setInc] = useState(null);
  const TIPOS = ['Retraso en la citación', 'Falta de personal', 'Uniformidad incorrecta', 'Comportamiento', 'Otra'];
  if (!c) return <Pantalla cabecera={<Cabecera titulo="Cortejo" />}><Vacio titulo="Sin cuadrante publicado" texto="Cuando Chamorro publique el cuadrante de un servicio aceptado, veréis aquí el personal asignado." /></Pantalla>;
  const so = api.sol(c); const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
  return (
    <Pantalla cabecera={<Cabecera titulo="Cuadrante del cortejo" sub={`${fechaLarga(so.fecha)}, ${conf} de ${c.puestos.length} confirmados`} onVolver={route.params?.id ? () => navigation.goBack() : undefined} />}>
      {mios.length > 1 && <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{mios.map(o => <Boton key={o.id} peq tipo={o.id === c.id ? 'pri' : 'sec'} titulo={fecha(api.sol(o).fecha)} onPress={() => setSel(o.id)} />)}</View>}
      <Lista>{c.puestos.map((a, i) => { const t = api.trabajador(a.trabajador); const baja = a.acuse === 'Baja';
        return <Fila key={a.id} ultimo={i === c.puestos.length - 1} titulo={a.puesto} detalle={`${baja ? 'Buscando sustituto' : t ? t.nombre : 'Por asignar'}, citación ${citacion(a.horario)}`} derecha={<Chip estado={baja ? 'Pendiente' : a.acuse} texto={baja ? 'Sustitución en curso' : a.acuse === 'Pendiente' ? 'Sin confirmar' : a.acuse} />} />; })}</Lista>
      <Boton titulo="Comunicar una incidencia" onPress={() => setInc({ tipo: TIPOS[0], texto: '' })} />
      <Text style={{ textAlign: 'center', color: C.tinta2 }}>Coordinación de Chamorro: <Telefono numero="600 000 000" /></Text>
      <Hoja visible={!!inc} titulo="Comunicar incidencia" onCerrar={() => setInc(null)}>
        {inc && <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{TIPOS.map(t => <Pressable key={t} onPress={() => setInc({ ...inc, tipo: t })} accessibilityRole="radio" accessibilityState={{ checked: inc.tipo === t }} style={{ borderWidth: 1, borderColor: inc.tipo === t ? C.morado : C.linea2, backgroundColor: inc.tipo === t ? C.morado : '#fff', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 }}><Text style={{ color: inc.tipo === t ? '#fff' : C.tinta, fontWeight: '600', fontSize: 13 }}>{t}</Text></Pressable>)}</View>
          <Text style={estUI.etq}>Qué ha pasado</Text>
          <TextInput style={[estUI.input, { minHeight: 80, textAlignVertical: 'top' }]} multiline value={inc.texto} onChangeText={v => setInc({ ...inc, texto: v })} />
          <Boton tipo="pri" titulo="Enviar" onPress={() => { if (!inc.texto.trim()) return Alert.alert('Describe la incidencia'); api.comunicarIncidencia(c.id, inc.tipo, inc.texto.trim()); setInc(null); Alert.alert('Incidencia enviada a Chamorro'); }} />
        </>}
      </Hoja>
    </Pantalla>
  );
}

/* Solicitar un servicio (CU-027) */
export function SolicitarScreen({ navigation }) {
  const api = useAlmacen();
  const [d, setD] = useState({ acto: '', fecha: '', inicio: '14:00', fin: '23:30' });
  const [funciones, setFunciones] = useState([{ funcion: 'Acólito de cirial', cantidad: 4 }]);
  const [eligiendo, setEligiendo] = useState(false);
  const libres = api.s.funciones.filter(f => !funciones.some(x => x.funcion === f));
  const cambiarCant = (i, n) => setFunciones(funciones.map((f, k) => k === i ? { ...f, cantidad: Math.max(1, f.cantidad + n) } : f));
  const enviar = () => {
    if (!d.acto.trim()) return Alert.alert('Falta el acto', 'Indica qué acto es (estación de penitencia, besamanos…).');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha) || d.fecha < api.s.hoy) return Alert.alert('Fecha no válida', 'Escribe una fecha futura con el formato AAAA-MM-DD.');
    if (!funciones.length) return Alert.alert('Falta el personal', 'Añade al menos una función.');
    api.solicitarServicio({ acto: d.acto.trim(), fecha: d.fecha, horario: `${d.inicio} – ${d.fin}`, funciones });
    Alert.alert('Solicitud enviada', 'Recibiréis el presupuesto en la app y en el portal.'); navigation.goBack();
  };
  const campo = (k, etq, ph) => <><Text style={estUI.etq}>{etq}</Text><TextInput style={estUI.input} value={d[k]} placeholder={ph} placeholderTextColor={C.tinta3} onChangeText={v => setD({ ...d, [k]: v })} accessibilityLabel={etq} /></>;
  return (
    <Pantalla cabecera={<Cabecera titulo="Solicitar un servicio" onVolver={() => navigation.goBack()} />}>
      <View>{campo('acto', 'Acto', 'Estación de penitencia, besamanos…')}{campo('fecha', 'Fecha (AAAA-MM-DD)', '2027-04-10')}
        <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}>{campo('inicio', 'Citación', '14:00')}</View><View style={{ flex: 1 }}>{campo('fin', 'Fin', '23:30')}</View></View></View>
      <SeccionT>Personal que necesitáis</SeccionT>
      <Lista>{funciones.map((f, i) => (
        <Fila key={f.funcion} ultimo={i === funciones.length - 1} titulo={f.funcion} detalle={api.s.descripcionFunciones[f.funcion]}
          derecha={<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Boton peq titulo="−" onPress={() => cambiarCant(i, -1)} /><Text style={{ minWidth: 22, textAlign: 'center', fontWeight: '700', color: C.tinta }}>{f.cantidad}</Text><Boton peq titulo="+" onPress={() => cambiarCant(i, 1)} />
            <Pressable onPress={() => setFunciones(funciones.filter((_, k) => k !== i))} accessibilityLabel={`Quitar ${f.funcion}`} hitSlop={8}><Text style={{ color: C.tinta3, fontSize: 18 }}>✕</Text></Pressable></View>} />))}</Lista>
      {libres.length > 0 && <Boton titulo="Añadir función" onPress={() => setEligiendo(true)} />}
      <Text style={{ color: C.tinta, fontSize: 16 }}>Total de personal: <Text style={{ fontWeight: '700' }}>{funciones.reduce((n, f) => n + f.cantidad, 0)}</Text></Text>
      <Boton tipo="pri" titulo="Enviar solicitud" onPress={enviar} />
      <Hoja visible={eligiendo} titulo="Añadir función" onCerrar={() => setEligiendo(false)}>
        {libres.map(f => <Pressable key={f} onPress={() => { setFunciones([...funciones, { funcion: f, cantidad: 1 }]); setEligiendo(false); }} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.linea }}><Text style={{ fontWeight: '700', color: C.tinta }}>{f}</Text><Text style={{ color: C.tinta2, fontSize: 13 }}>{api.s.descripcionFunciones[f]}</Text></Pressable>)}
      </Hoja>
    </Pantalla>
  );
}

/* Más e historial (CU-029) */
export function HermMasScreen({ navigation }) {
  const api = useAlmacen();
  return (
    <Pantalla cabecera={<Cabecera titulo="Más" sub={`${api.sesion.nombre}, ${api.hermandad(api.sesion.hermandad).nombre}`} />}>
      <Lista>
        <Fila titulo="Solicitar un servicio" detalle="Acto, fecha y personal" derecha={<Flecha />} onPress={() => navigation.navigate('Solicitar')} />
        <Fila ultimo titulo="Historial de servicios" detalle="Servicios contratados" derecha={<Flecha />} onPress={() => navigation.navigate('Historial')} />
      </Lista>
      <Boton titulo="Cerrar sesión" onPress={() => api.salir()} />
    </Pantalla>
  );
}
export function HistorialScreen({ navigation }) {
  const api = useAlmacen(); const hid = api.sesion.hermandad;
  const lista = api.s.solicitudes.filter(x => { const p = api.presupuestoDeSolicitud(x.id); return x.hermandad === hid && (x.estado === 'Finalizado' || (p && p.estado === 'Aceptado')); }).sort((a, b) => b.fecha.localeCompare(a.fecha));
  return (
    <Pantalla cabecera={<Cabecera titulo="Historial" onVolver={() => navigation.goBack()} />}>
      <Lista>{lista.map((x, i) => { const p = api.presupuestoDeSolicitud(x.id); return <Fila key={x.id} ultimo={i === lista.length - 1} titulo={x.acto} detalle={`${fecha(x.fecha)}${p && p.estado === 'Aceptado' ? `, ${euros(api.totales(p).total)}` : ''}`} derecha={<Chip estado={x.estado} />} />; })}</Lista>
    </Pantalla>
  );
}
