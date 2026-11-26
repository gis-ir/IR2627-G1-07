/* Coordinador y administrador en el móvil: sección «Más» */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch, Alert } from 'react-native';
import { useAlmacen, fecha, fechaLarga, diaCorto, hora, euros } from '../datos/Almacen';
import { Pantalla, Cabecera, Tarjeta, Chip, Dato, Boton, SeccionT, MiniFecha, Vacio, Fila, Lista, Telefono, SoloWeb, Hoja, est as estUI } from '../componentes/UI';
import { C } from '../tema';

const Flecha = () => <Text style={{ color: C.tinta3, fontSize: 20 }}>›</Text>;

export function MasScreen({ navigation }) {
  const api = useAlmacen(); const adm = api.rol === 'Administrador';
  const it = (dest, t, d, ultimo) => <Fila key={dest} ultimo={ultimo} titulo={t} detalle={d} derecha={<Flecha />} onPress={() => navigation.navigate(dest)} />;
  return (
    <Pantalla cabecera={<Cabecera titulo="Más" sub={`${api.sesion.nombre}, ${api.rol.toLowerCase()}`} />}>
      <Lista>
        {it('TablonG', 'Tablón de avisos', 'Publicar y consultar avisos')}
        {it('PresupuestosG', 'Presupuestos', 'Estado y desglose')}
        {it('Personal', 'Personal', 'Fichas y teléfonos')}
        {it('Capacitaciones', 'Capacitaciones', 'Aprobar o rechazar')}
        {it('Eventos', 'Eventos', 'Días con trabajo', true)}
      </Lista>
      {adm && <><SeccionT>Administración</SeccionT><Lista>
        {it('Usuarios', 'Usuarios y permisos', 'Activar o desactivar cuentas')}
        {it('Auditoria', 'Registro de auditoría', 'Últimas acciones')}
        {it('Sistema', 'Estado del sistema', 'Disponibilidad y rendimiento', true)}
      </Lista></>}
      <SoloWeb>Generar cuadrantes, elaborar presupuestos y dar de alta trabajadores o usuarios se hace desde el portal web.</SoloWeb>
      <Boton titulo="Cerrar sesión" onPress={() => api.salir()} />
    </Pantalla>
  );
}

/* Tablón (CU-019) */
export function TablonGScreen({ navigation }) {
  const api = useAlmacen();
  const [abierta, setAbierta] = useState(false);
  const [f, setF] = useState({ titulo: '', texto: '', dest: 'Todos', push: true });
  const publicar = () => {
    if (!f.titulo.trim() || !f.texto.trim()) return Alert.alert('Faltan datos', 'Escribe el título y el mensaje del aviso.');
    api.publicarAviso(f.titulo.trim(), f.texto.trim(), [f.dest], f.push); setAbierta(false); setF({ titulo: '', texto: '', dest: 'Todos', push: true });
  };
  return (
    <Pantalla cabecera={<Cabecera titulo="Tablón de avisos" onVolver={() => navigation.goBack()} />}>
      <Boton tipo="pri" titulo="Publicar aviso" onPress={() => setAbierta(true)} />
      <Lista>{api.s.avisos.map((v, i) => <Fila key={v.id} ultimo={i === api.s.avisos.length - 1} titulo={v.titulo} detalle={`${v.texto}\n${fecha(v.fecha)}, para ${v.destinatarios.join(', ').toLowerCase()}. Leído por ${v.leidos.length}.`} />)}</Lista>
      <Hoja visible={abierta} titulo="Publicar aviso" onCerrar={() => setAbierta(false)}>
        <Text style={estUI.etq}>Título</Text><TextInput style={estUI.input} value={f.titulo} onChangeText={v => setF({ ...f, titulo: v })} />
        <Text style={estUI.etq}>Mensaje</Text><TextInput style={[estUI.input, { minHeight: 80, textAlignVertical: 'top' }]} multiline value={f.texto} onChangeText={v => setF({ ...f, texto: v })} />
        <Text style={estUI.etq}>Para</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{['Todos', ...api.s.funciones].map(d => (
          <Pressable key={d} onPress={() => setF({ ...f, dest: d })} accessibilityRole="radio" accessibilityState={{ checked: f.dest === d }} style={{ borderWidth: 1, borderColor: f.dest === d ? C.morado : C.linea2, backgroundColor: f.dest === d ? C.morado : '#fff', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ color: f.dest === d ? '#fff' : C.tinta, fontWeight: '600', fontSize: 13 }}>{d}</Text></Pressable>))}</View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}><Text style={{ color: C.tinta }}>Enviar también como notificación push</Text><Switch value={f.push} onValueChange={v => setF({ ...f, push: v })} /></View>
        <Boton tipo="pri" titulo="Publicar" onPress={publicar} style={{ marginTop: 8 }} />
      </Hoja>
    </Pantalla>
  );
}

/* Presupuestos: lista y detalle, para gestión y para hermandad (CU-022, CU-023) */
export function PresupuestosScreen({ navigation }) {
  const api = useAlmacen(); const herm = api.rol === 'Hermandad';
  const lista = api.s.presupuestos.filter(p => p.estado !== 'Borrador' && (!herm || api.solicitud(p.solicitud).hermandad === api.sesion.hermandad))
    .sort((a, b) => (a.estado === 'Enviado' ? -1 : 0) - (b.estado === 'Enviado' ? -1 : 0) || (b.enviado || '').localeCompare(a.enviado || ''));
  return (
    <Pantalla cabecera={<Cabecera titulo="Presupuestos" onVolver={herm ? undefined : () => navigation.goBack()} />}>
      {lista.length ? <Lista>{lista.map((p, i) => { const so = api.solicitud(p.solicitud);
        return <Fila key={p.id} ultimo={i === lista.length - 1} titulo={herm ? so.acto : api.hermandad(so.hermandad).nombre} detalle={`${p.codigo}, ${euros(api.totales(p).total)}`} derecha={<Chip estado={p.estado} />} onPress={() => navigation.navigate('Presupuesto', { id: p.id })} />; })}</Lista>
        : <Vacio titulo="Sin presupuestos" texto="Cuando Chamorro responda a una solicitud, el presupuesto aparecerá aquí." />}
      {!herm && <SoloWeb>Elaborar presupuestos nuevos y exportarlos a contabilidad se hace desde el portal web.</SoloWeb>}
    </Pantalla>
  );
}

export function PresupuestoScreen({ route, navigation }) {
  const api = useAlmacen(); const herm = api.rol === 'Hermandad';
  const p = api.presupuesto(route.params?.id); const so = api.solicitud(p.solicitud); const t = api.totales(p);
  const [motivo, setMotivo] = useState(null);
  const MOTIVOS = ['Importe por encima de lo previsto', 'Necesitamos otro número de personas', 'Ya no necesitamos el servicio', 'Otro motivo'];
  const aceptar = () => Alert.alert('Aceptar presupuesto', `Aceptáis ${p.codigo} por ${euros(t.total)}. Chamorro preparará el cuadrante.`, [{ text: 'Volver', style: 'cancel' }, { text: 'Aceptar', onPress: () => api.responderPresupuesto(p.id, true) }]);
  return (
    <Pantalla cabecera={<Cabecera titulo={p.codigo} sub={herm ? `Versión ${p.version}` : api.hermandad(so.hermandad).nombre} onVolver={() => navigation.goBack()} />}>
      <Tarjeta>
        <Text style={{ color: C.tinta3, fontSize: 13 }}>{so.acto}, {fechaLarga(so.fecha)}</Text>
        <View style={{ marginVertical: 8 }}><Chip estado={p.estado} /></View>
        {p.lineas.map((l, i) => <Dato key={i} etiqueta={`${l.cantidad} × ${l.funcion.toLowerCase()} (${l.horas} h a ${euros(l.tarifa)}/h)`} valor={euros(l.cantidad * l.horas * l.tarifa)} />)}
        <Dato etiqueta="Base imponible" valor={euros(t.base)} />
        <Dato etiqueta={`IVA (${p.iva}%)`} valor={euros(t.iva)} />
        <Dato etiqueta="Total" valor={euros(t.total)} ultimo />
        {p.motivo ? <Text style={{ color: C.burdeos, marginTop: 8 }}>Motivo del rechazo: {p.motivo}</Text> : null}
      </Tarjeta>
      {herm && p.estado === 'Enviado' && <><Boton tipo="ok" titulo="Aceptar presupuesto" onPress={aceptar} /><Boton tipo="peligro" titulo="Rechazar" onPress={() => setMotivo(MOTIVOS[0])} /></>}
      {!herm && p.estado === 'Enviado' && <Boton titulo="Reenviar a la hermandad" onPress={() => { api.reenviarPresupuesto(p.id); Alert.alert('Presupuesto reenviado'); }} />}
      <Hoja visible={!!motivo} titulo="Rechazar presupuesto" onCerrar={() => setMotivo(null)}>
        <Text style={{ color: C.tinta2 }}>Contadnos el motivo para que Chamorro pueda enviaros una versión ajustada.</Text>
        {MOTIVOS.map(m => <Pressable key={m} onPress={() => setMotivo(m)} accessibilityRole="radio" accessibilityState={{ checked: motivo === m }} style={{ borderWidth: motivo === m ? 2 : 1, borderColor: motivo === m ? C.morado : C.linea2, borderRadius: 10, padding: 12, backgroundColor: motivo === m ? C.moradoClaro : '#fff' }}><Text style={{ color: C.tinta }}>{m}</Text></Pressable>)}
        <Boton tipo="urg" titulo="Rechazar" onPress={() => { api.responderPresupuesto(p.id, false, motivo); setMotivo(null); }} />
      </Hoja>
    </Pantalla>
  );
}

/* Personal y ficha (CU-003) */
export function PersonalScreen({ navigation }) {
  const api = useAlmacen(); const [q, setQ] = useState('');
  const ts = api.s.trabajadores.filter(t => !t.baja && t.nombre.toLowerCase().includes(q.toLowerCase()));
  return (
    <Pantalla cabecera={<Cabecera titulo="Personal" onVolver={() => navigation.goBack()} />}>
      <TextInput style={estUI.input} placeholder="Buscar por nombre" placeholderTextColor={C.tinta3} value={q} onChangeText={setQ} accessibilityLabel="Buscar" />
      <Lista>{ts.map((t, i) => <Fila key={t.id} ultimo={i === ts.length - 1} titulo={t.nombre} detalle={t.capacitaciones.filter(c => c.estado === 'Aprobada').map(c => c.rol).join(', ')} derecha={<Flecha />} onPress={() => navigation.navigate('Ficha', { id: t.id })} />)}</Lista>
    </Pantalla>
  );
}
export function FichaScreen({ route, navigation }) {
  const api = useAlmacen(); const t = api.trabajador(route.params?.id); const turnos = api.turnosDe(t.id);
  const dias = Object.entries(t.disponibilidad).filter(([, f]) => f.length);
  return (
    <Pantalla cabecera={<Cabecera titulo={t.nombre} sub={t.zona} onVolver={() => navigation.goBack()} />}>
      <Tarjeta><Dato etiqueta="Teléfono" valor={<Telefono numero={t.telefono} />} /><Dato etiqueta="Correo" valor={t.correo} /><Dato etiqueta="Talla y calzado" valor={`${t.talla}, ${t.calzado}`} ultimo /></Tarjeta>
      <SeccionT>Capacitaciones</SeccionT>
      <Tarjeta>{t.capacitaciones.map((c, i) => <View key={c.rol} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i === t.capacitaciones.length - 1 ? 0 : 1, borderBottomColor: C.linea }}><Text style={{ color: C.tinta }}>{c.rol}</Text><Chip estado={c.estado} /></View>)}</Tarjeta>
      <SeccionT>Disponibilidad</SeccionT>
      <Tarjeta>{dias.length ? dias.map(([d, f], i) => <Dato key={d} etiqueta={fechaLarga(d)} valor={f.join(', ')} ultimo={i === dias.length - 1} />) : <Text style={{ color: C.tinta2 }}>No ha declarado disponibilidad.</Text>}</Tarjeta>
      <SeccionT>Próximos turnos</SeccionT>
      {turnos.length ? <Lista>{turnos.map((x, i) => <Fila key={x.a.id} ultimo={i === turnos.length - 1} izquierda={<MiniFecha {...diaCorto(x.so.fecha)} />} titulo={x.a.puesto} detalle={x.h.nombre} derecha={<Chip estado={x.a.acuse} />} onPress={() => navigation.navigate('Cuadrante', { id: x.c.id })} />)}</Lista> : <Text style={{ color: C.tinta2 }}>Sin turnos asignados.</Text>}
    </Pantalla>
  );
}

/* Capacitaciones (CU-002) */
export function CapacitacionesScreen({ navigation }) {
  const api = useAlmacen(); const [rechazo, setRechazo] = useState(null); const [motivo, setMotivo] = useState('');
  const pend = []; api.s.trabajadores.forEach(t => t.capacitaciones.forEach(c => { if (c.estado === 'Pendiente') pend.push({ t, c }); }));
  return (
    <Pantalla cabecera={<Cabecera titulo="Capacitaciones" sub="Solicitudes pendientes" onVolver={() => navigation.goBack()} />}>
      {pend.length ? <Lista>{pend.map((x, i) => (
        <Fila key={x.t.id + x.c.rol} ultimo={i === pend.length - 1} titulo={x.t.nombre} detalle={`Solicita: ${x.c.rol}\n${x.c.experiencia || ''}`}>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}><Boton peq titulo="Rechazar" onPress={() => { setRechazo(x); setMotivo(''); }} /><Boton peq tipo="ok" titulo="Aprobar" onPress={() => api.resolverCapacitacion(x.t.id, x.c.rol, true)} /></View>
        </Fila>))}</Lista> : <Vacio titulo="Todo al día" texto="No hay solicitudes de capacitación pendientes." />}
      <Hoja visible={!!rechazo} titulo="Rechazar capacitación" onCerrar={() => setRechazo(null)}>
        <Text style={estUI.etq}>Motivo</Text><TextInput style={estUI.input} value={motivo} onChangeText={setMotivo} placeholder="Sin experiencia acreditada" placeholderTextColor={C.tinta3} />
        <Boton tipo="urg" titulo="Rechazar" onPress={() => { if (!motivo.trim()) return Alert.alert('Indica el motivo'); api.resolverCapacitacion(rechazo.t.id, rechazo.c.rol, false, motivo.trim()); setRechazo(null); }} />
      </Hoja>
    </Pantalla>
  );
}

/* Eventos (CU-010, consulta) */
export function EventosScreen({ navigation }) {
  const api = useAlmacen(); const evs = [...api.s.eventos].sort((a, b) => a.inicio.localeCompare(b.inicio));
  return (
    <Pantalla cabecera={<Cabecera titulo="Eventos" onVolver={() => navigation.goBack()} />}>
      <Lista>{evs.map((e, i) => { const h = api.hermandad(e.hermandad); return <Fila key={e.id} ultimo={i === evs.length - 1} izquierda={<MiniFecha {...diaCorto(e.inicio)} />} titulo={e.nombre} detalle={`${h ? h.nombre : 'Sin hermandad'}, ${e.franja}`} derecha={<Chip estado={e.situacion} />} />; })}</Lista>
      <SoloWeb>Los eventos se registran desde el portal web.</SoloWeb>
    </Pantalla>
  );
}

/* Administración (CU-030, CU-032, CU-033) */
export function UsuariosScreen({ navigation }) {
  const api = useAlmacen(); const us = api.s.usuarios;
  return (
    <Pantalla cabecera={<Cabecera titulo="Usuarios" onVolver={() => navigation.goBack()} />}>
      <Lista>{us.map((u, i) => (
        <Fila key={u.id} ultimo={i === us.length - 1} titulo={u.nombre} detalle={`${u.rol}, ${u.correo}`} derecha={<Chip estado={u.activo ? 'Activa' : 'Inactiva'} />}>
          {u.id !== api.sesion.id && <View style={{ alignItems: 'flex-end' }}><Boton peq titulo={u.activo ? 'Desactivar' : 'Reactivar'} onPress={() => api.activarUsuario(u.id)} /></View>}
        </Fila>))}</Lista>
      <SoloWeb>Crear cuentas y cambiar roles se hace desde el portal web.</SoloWeb>
    </Pantalla>
  );
}
export function AuditoriaScreen({ navigation }) {
  const api = useAlmacen(); const regs = api.s.auditoria.slice(0, 40);
  return (
    <Pantalla cabecera={<Cabecera titulo="Auditoría" sub="Últimas acciones" onVolver={() => navigation.goBack()} />}>
      <Lista>{regs.map((r, i) => <Fila key={i} ultimo={i === regs.length - 1} titulo={r.accion} detalle={`${r.elemento}\n${r.usuario}, ${fecha(r.fecha)} ${hora(r.fecha)}`} derecha={<Chip estado={r.resultado === 'Correcto' ? 'Correcto' : 'Fallido'} />} />)}</Lista>
    </Pantalla>
  );
}
export function SistemaScreen({ navigation }) {
  const m = [['99,96 %', 'Disponibilidad (30 días)'], ['194 ms', 'Respuesta media'], ['37', 'Usuarios conectados'], ['3', 'Errores en 24 h']];
  const sv = [['Portal web', 'Operativo'], ['App móvil (API)', 'Operativo'], ['Notificaciones push', 'Operativo'], ['Correo electrónico', 'Degradado'], ['Base de datos', 'Operativo'], ['Copia de seguridad', 'Operativo']];
  return (
    <Pantalla cabecera={<Cabecera titulo="Estado del sistema" onVolver={() => navigation.goBack()} />}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>{m.map(([v, t]) => <View key={t} style={{ width: '48%', flexGrow: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: C.linea, borderRadius: 14, padding: 14 }}><Text style={{ fontSize: 24, fontWeight: '700', color: C.tinta }}>{v}</Text><Text style={{ color: C.tinta2, fontSize: 13.5 }}>{t}</Text></View>)}</View>
      <Lista>{sv.map(([n, e], i) => <Fila key={n} ultimo={i === sv.length - 1} titulo={n} derecha={<Chip estado={e} />} />)}</Lista>
    </Pantalla>
  );
}
