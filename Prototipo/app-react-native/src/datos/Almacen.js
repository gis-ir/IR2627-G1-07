/* Estado de la app con datos simulados, guardado en el dispositivo (AsyncStorage).
   Las reglas son las mismas que en el portal web (js/datos.js). Cada acción equivale
   a una llamada a la API del sistema en la versión real. */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEMILLA } from './semilla';

const CLAVE = 'csc-app-v3'; // v3: todos los perfiles en la app
const Ctx = createContext(null);
const copia = o => JSON.parse(JSON.stringify(o));
const pad = n => String(n).padStart(2, '0');
const nuevoId = p => p + Math.random().toString(36).slice(2, 8);
const ZONAS_KM = { 'Triana': 1.5, 'Los Remedios': 2.1, 'Centro': 2.4, 'Macarena': 3.6, 'Nervión': 4.2, 'Cerro del Águila': 6.3 };

/* ---------- Consultas sobre un estado (no lo modifican) ---------- */
export function consultas(s) {
  const trabajador = id => s.trabajadores.find(t => t.id === id);
  const hermandad = id => s.hermandades.find(h => h.id === id);
  const presupuesto = id => s.presupuestos.find(p => p.id === id);
  const solicitud = id => s.solicitudes.find(x => x.id === id);
  const cuadrante = id => s.cuadrantes.find(c => c.id === id);
  const sol = c => solicitud(presupuesto(c.presupuesto).solicitud);
  const habilitado = (t, f) => t.capacitaciones.some(c => c.rol === f && c.estado === 'Aprobada');
  const turno = aid => {
    for (const c of s.cuadrantes) { const a = c.puestos.find(x => x.id === aid); if (a) { const so = sol(c); return { c, a, so, h: hermandad(so.hermandad) }; } }
    return null;
  };
  const totales = p => { const base = p.lineas.reduce((n, l) => n + l.cantidad * l.horas * l.tarifa, 0); const iva = base * p.iva / 100; return { base, iva, total: base + iva }; };
  const km = (t, h) => { const zona = (h.sede.match(/\(([^)]+)\)/) || [])[1]; return t.zona === zona ? 0.8 : (ZONAS_KM[t.zona] || 5); };
  const candidatos = (c, a) => {
    const so = sol(c); const ocupados = new Set();
    s.cuadrantes.forEach(x => { if (x.estado !== 'Publicado') return; if (sol(x).fecha === so.fecha) x.puestos.forEach(p => p.trabajador && ocupados.add(p.trabajador)); });
    const h = hermandad(so.hermandad);
    return s.trabajadores.filter(t => !t.baja && habilitado(t, a.funcion) && !ocupados.has(t.id))
      .map(t => { const disp = (t.disponibilidad[so.fecha] || []).length > 0; const d = km(t, h); return { t, disp, km: d, puntos: (disp ? 50 : 0) + Math.round(30 - d * 3) }; })
      .sort((x, y) => y.puntos - x.puntos);
  };
  const turnosDe = tid => s.cuadrantes.filter(c => c.estado === 'Publicado')
    .flatMap(c => c.puestos.filter(a => a.trabajador === tid).map(a => turno(a.id)))
    .sort((x, y) => x.so.fecha.localeCompare(y.so.fecha));
  const ofertasPara = tid => s.bajas.filter(b => b.estado === 'Abierta' && b.ofertas.some(o => o.trabajador === tid && o.estado === 'Enviada'));
  const avisosPara = tid => { const t = trabajador(tid); return s.avisos.filter(v => v.destinatarios.includes('Todos') || t.capacitaciones.some(c => c.estado === 'Aprobada' && v.destinatarios.includes(c.rol))); };
  const presupuestoDeSolicitud = sid => s.presupuestos.filter(p => p.solicitud === sid).sort((a, b) => b.version - a.version)[0];
  const cuadranteDePresupuesto = pid => s.cuadrantes.find(c => c.presupuesto === pid);
  return { trabajador, hermandad, presupuesto, solicitud, cuadrante, sol, habilitado, turno, totales, km, candidatos, turnosDe, ofertasPara, avisosPara, presupuestoDeSolicitud, cuadranteDePresupuesto };
}

export function AlmacenProvider({ children }) {
  const [s, setS] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then(raw => setS(raw ? JSON.parse(raw) : { ...copia(SEMILLA), sesion: null }))
      .catch(() => setS({ ...copia(SEMILLA), sesion: null }));
  }, []);

  /* Aplica un cambio sobre una copia del estado y lo guarda */
  const cambiar = useCallback(fn => {
    setS(prev => {
      const n = copia(prev);
      fn(n, consultas(n));
      AsyncStorage.setItem(CLAVE, JSON.stringify(n)).catch(() => {});
      return n;
    });
  }, []);

  const api = useMemo(() => {
    if (!s) return null;
    const q = consultas(s);
    const ses = s.sesion;
    const yo = ses && ses.trabajador ? q.trabajador(ses.trabajador) : null;
    const quien = ses ? ses.nombre : 'desconocido';
    const ahora = () => { const d = new Date(); return `${s.hoy} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    const auditar = (n, accion, elemento, resultado = 'Correcto') => n.auditoria.unshift({ fecha: ahora(), usuario: quien, accion, elemento, resultado });
    const notificar = (n, trabajador, titulo, texto, tipo = 'info', ref = '') => n.notificaciones.unshift({ id: nuevoId('n'), trabajador, titulo, texto, tipo, ref, fecha: ahora(), leida: false });

    return {
      s, ...q, sesion: ses, yo,
      rol: ses ? ses.rol : null,
      esGestion: !!ses && (ses.rol === 'Coordinador' || ses.rol === 'Administrador'),
      misTurnos: () => (yo ? q.turnosDe(yo.id).filter(x => x.a.acuse !== 'Baja') : []),
      ofertasPendientes: () => (yo ? q.ofertasPara(yo.id) : []),
      avisos: () => (yo ? q.avisosPara(yo.id) : []),
      distancia: h => (yo ? q.km(yo, h) : 0),
      notificaciones: () => (yo ? s.notificaciones.filter(n => n.trabajador === yo.id) : []),

      /* Sesión: todos los perfiles entran en la app (CU-031) */
      entrar(correo, clave) {
        const u = s.usuarios.find(x => x.correo === correo.trim().toLowerCase());
        if (!u || u.clave !== clave) return 'El correo o la contraseña no son correctos.';
        if (!u.activo) return 'Tu cuenta está desactivada. Habla con el coordinador.';
        cambiar(n => { n.sesion = { id: u.id, nombre: u.nombre, rol: u.rol, trabajador: u.trabajador || '', hermandad: u.hermandad || '' }; n.auditoria.unshift({ fecha: ahora(), usuario: u.nombre, accion: 'Iniciar sesión', elemento: 'App móvil', resultado: 'Correcto' }); });
        return null;
      },
      salir() { cambiar(n => { n.sesion = null; }); },
      reiniciar() { cambiar(n => { Object.keys(n).forEach(k => delete n[k]); Object.assign(n, copia(SEMILLA), { sesion: null }); }); },

      /* ---------- Trabajador ---------- */
      confirmar(aid) { cambiar((n, c) => { const x = c.turno(aid); x.a.acuse = 'Confirmado'; auditar(n, 'Confirmar recepción de turno', `${x.a.puesto}, ${x.h.nombre}`); }); },
      comunicarBaja(aid, motivo, explicacion) {
        cambiar((n, c) => { const x = c.turno(aid); x.a.acuse = 'Baja';
          n.bajas.unshift({ id: nuevoId('b'), cuadrante: x.c.id, puesto: aid, trabajador: yo.id, motivo, explicacion, fecha: ahora(), estado: 'Abierta', ofertas: [], sustituto: '' });
          auditar(n, 'Comunicar baja', `${x.a.puesto}, ${x.h.nombre}`); });
      },
      responderOferta(bid, acepta) {
        if (s.bajas.find(x => x.id === bid).estado !== 'Abierta') return false;
        cambiar((n, c) => { const b = n.bajas.find(x => x.id === bid);
          if (!acepta) { b.ofertas.find(o => o.trabajador === yo.id).estado = 'Rechazada'; auditar(n, 'Rechazar sustitución', bid); return; }
          cubrir(n, c, b, yo.id, 'Aceptar sustitución'); });
        return true;
      },
      guardarDisponibilidad(disp) { cambiar(n => { n.trabajadores.find(t => t.id === yo.id).disponibilidad = disp; auditar(n, 'Marcar disponibilidad', 'Semana Santa 2027'); }); },
      leerAviso(vid) { cambiar(n => { const v = n.avisos.find(x => x.id === vid); if (!v.leidos.includes(yo.id)) v.leidos.push(yo.id); }); },
      leerNotificaciones() { cambiar(n => { n.notificaciones.forEach(x => { if (x.trabajador === yo.id) x.leida = true; }); }); },
      actualizarPerfil(datos) { cambiar(n => { Object.assign(n.trabajadores.find(t => t.id === yo.id), datos); auditar(n, 'Actualizar perfil', 'Datos y tallas'); }); },
      solicitarCapacitacion(rol, experiencia) {
        cambiar(n => { const t = n.trabajadores.find(x => x.id === yo.id); t.capacitaciones = t.capacitaciones.filter(c => c.rol !== rol); t.capacitaciones.push({ rol, estado: 'Pendiente', experiencia }); auditar(n, 'Solicitar capacitación', rol); });
      },

      /* ---------- Coordinador y administrador ---------- */
      enviarAlerta(bid, ids) {
        cambiar((n, c) => { const b = n.bajas.find(x => x.id === bid); const x = c.turno(b.puesto);
          const env = ahora(); const caduca = `${env.slice(0, 11)}${pad(Math.min(+env.slice(11, 13) + 12, 23))}${env.slice(13)}`;
          ids.forEach(id => { b.ofertas = b.ofertas.filter(o => o.trabajador !== id); b.ofertas.push({ trabajador: id, estado: 'Enviada', enviada: env, caduca });
            notificar(n, id, 'Cobertura urgente', `Se busca ${x.a.funcion.toLowerCase()} para la ${x.h.nombre}.`, 'urgente', b.id); });
          auditar(n, 'Enviar alerta de cobertura', `${x.a.puesto} (${ids.length} candidatos)`); });
      },
      asignarSustituto(bid, tid) { cambiar((n, c) => cubrir(n, c, n.bajas.find(x => x.id === bid), tid, 'Registrar sustitución')); },
      recordar(cid, aid) {
        const total = q.cuadrante(cid).puestos.filter(a => aid ? a.id === aid : a.acuse === 'Pendiente').length;
        cambiar((n, c) => { const cu = c.cuadrante(cid); const lista = cu.puestos.filter(a => aid ? a.id === aid : a.acuse === 'Pendiente');
          lista.forEach(a => { a.recordado = ahora(); notificar(n, a.trabajador, 'Confirma tu turno', 'Aún no has confirmado la recepción de tu turno.', 'turno', a.id); });
          auditar(n, 'Enviar recordatorio de acuse', `${c.hermandad(c.sol(cu).hermandad).nombre} (${lista.length})`); });
        return total;
      },
      publicarAviso(titulo, texto, destinatarios, push) {
        cambiar((n, c) => { n.avisos.unshift({ id: nuevoId('v'), titulo, texto, destinatarios, fecha: ahora(), autor: quien, push, leidos: [] });
          n.trabajadores.filter(t => !t.baja && (destinatarios.includes('Todos') || t.capacitaciones.some(x => x.estado === 'Aprobada' && destinatarios.includes(x.rol)))).forEach(t => notificar(n, t.id, 'Nuevo aviso', titulo, 'aviso'));
          auditar(n, 'Publicar aviso', titulo); });
      },
      resolverCapacitacion(tid, rol, aprobar, motivo) {
        cambiar(n => { const t = n.trabajadores.find(x => x.id === tid); const c = t.capacitaciones.find(x => x.rol === rol);
          c.estado = aprobar ? 'Aprobada' : 'Rechazada'; c.por = quien; if (!aprobar) c.motivo = motivo;
          notificar(n, tid, aprobar ? 'Capacitación aprobada' : 'Capacitación rechazada', aprobar ? `Ya puedes ser asignado como ${rol.toLowerCase()}.` : `${rol}: ${motivo}`);
          auditar(n, aprobar ? 'Aprobar capacitación' : 'Rechazar capacitación', `${t.nombre}: ${rol}`); });
      },
      reenviarPresupuesto(pid) { cambiar(n => { const p = n.presupuestos.find(x => x.id === pid); p.enviado = n.hoy; auditar(n, 'Reenviar presupuesto', p.codigo); }); },
      activarUsuario(uid) { cambiar(n => { const u = n.usuarios.find(x => x.id === uid); u.activo = !u.activo; auditar(n, u.activo ? 'Reactivar cuenta' : 'Desactivar cuenta', u.nombre); }); },

      /* ---------- Hermandad ---------- */
      responderPresupuesto(pid, aceptar, motivo) {
        cambiar((n, c) => { const p = n.presupuestos.find(x => x.id === pid); const so = c.solicitud(p.solicitud);
          p.estado = aceptar ? 'Aceptado' : 'Rechazado'; p.respuesta = n.hoy;
          if (aceptar) { so.estado = 'Presupuesto aceptado'; const ev = n.eventos.find(e => e.id === so.evento); if (ev) ev.situacion = 'Con servicio'; }
          else { p.motivo = motivo; so.estado = 'Pendiente de presupuesto'; }
          auditar(n, aceptar ? 'Aceptar presupuesto' : 'Rechazar presupuesto', p.codigo); });
      },
      comunicarIncidencia(cid, tipo, descripcion) {
        cambiar(n => { n.incidencias.unshift({ id: nuevoId('i'), hermandad: ses.hermandad, cuadrante: cid, tipo, descripcion, fecha: n.hoy, estado: 'En revisión' }); auditar(n, 'Registrar incidencia', tipo); });
      },
      solicitarServicio(datos) {
        cambiar((n, c) => { n.solicitudes.push({ id: nuevoId('s'), hermandad: ses.hermandad, evento: '', estado: 'Pendiente de presupuesto', creada: n.hoy, lugar: c.hermandad(ses.hermandad).sede, ...datos }); auditar(n, 'Solicitar servicio', datos.acto); });
      }
    };

    /* Registrar la sustitución y actualizar el cuadrante (CU-015) */
    function cubrir(n, c, b, tid, accion) {
      const x = c.turno(b.puesto);
      x.a.trabajador = tid; x.a.acuse = 'Confirmado'; b.estado = 'Cubierta'; b.sustituto = tid;
      b.ofertas.forEach(o => { if (o.trabajador === tid) o.estado = 'Aceptada'; else if (o.estado === 'Enviada') o.estado = 'Caducada'; });
      notificar(n, tid, 'Sustitución asignada', `Cubres el puesto de ${x.a.puesto.toLowerCase()} con la ${x.h.nombre}.`, 'turno', x.a.id);
      auditar(n, accion, `${x.a.puesto}, ${x.h.nombre}: ${c.trabajador(tid).nombre}`);
    }
  }, [s, cambiar]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useAlmacen = () => useContext(Ctx);

/* Formato de fechas e importes */
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const fecha = iso => { const [y, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
export const fechaLarga = iso => { const d = new Date(iso.slice(0, 10) + 'T12:00'); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES_L[d.getMonth()]}`; };
export const diaCorto = iso => { const d = new Date(iso.slice(0, 10) + 'T12:00'); return { dia: d.getDate(), mes: MESES[d.getMonth()] }; };
export const hora = f => (f && f.length > 10 ? f.slice(11) : '');
export const citacion = horario => horario.split(' – ')[0];
export const euros = n => `${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
