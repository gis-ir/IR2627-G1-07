/* Estado de la app con datos simulados, guardado en el dispositivo (AsyncStorage).
   Cada acción equivale a una llamada a la API del sistema en la versión real. */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEMILLA } from './semilla';

const CLAVE = 'csc-app-trabajador-v2'; // v2: funciones del ERS (TipoFuncion)
const Ctx = createContext(null);
const copia = o => JSON.parse(JSON.stringify(o));
const pad = n => String(n).padStart(2, '0');
const id = p => p + Math.random().toString(36).slice(2, 8);

export function AlmacenProvider({ children }) {
  const [s, setS] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then(raw => setS(raw ? JSON.parse(raw) : { ...copia(SEMILLA), sesion: null }))
      .catch(() => setS({ ...copia(SEMILLA), sesion: null }));
  }, []);

  /* Aplica un cambio sobre una copia y lo persiste */
  const cambiar = useCallback(fn => {
    setS(prev => {
      const n = copia(prev);
      fn(n);
      AsyncStorage.setItem(CLAVE, JSON.stringify(n)).catch(() => {});
      return n;
    });
  }, []);

  const api = useMemo(() => {
    if (!s) return null;
    const ahora = () => { const d = new Date(); return `${s.hoy} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    const yo = s.sesion ? s.trabajadores.find(t => t.id === s.sesion.trabajador) : null;
    const hermandad = hid => s.hermandades.find(h => h.id === hid);
    const solicitudDe = c => s.solicitudes.find(x => x.id === s.presupuestos.find(p => p.id === c.presupuesto).solicitud);
    const habilitado = (t, f) => t.capacitaciones.some(c => c.rol === f && c.estado === 'Aprobada');

    const turno = aid => {
      for (const c of s.cuadrantes) {
        const a = c.puestos.find(x => x.id === aid);
        if (a) { const so = solicitudDe(c); return { c, a, so, h: hermandad(so.hermandad) }; }
      }
      return null;
    };
    const misTurnos = () => !yo ? [] : s.cuadrantes.filter(c => c.estado === 'Publicado')
      .flatMap(c => c.puestos.filter(a => a.trabajador === yo.id && a.acuse !== 'Baja').map(a => turno(a.id)))
      .sort((x, y) => x.so.fecha.localeCompare(y.so.fecha));
    const ofertasPendientes = () => !yo ? [] : s.bajas.filter(b => b.estado === 'Abierta' && b.ofertas.some(o => o.trabajador === yo.id && o.estado === 'Enviada'));
    const avisos = () => !yo ? [] : s.avisos.filter(v => v.destinatarios.includes('Todos') || yo.capacitaciones.some(c => c.estado === 'Aprobada' && v.destinatarios.includes(c.rol)));
    const distancia = h => {
      const zona = (h.sede.match(/\(([^)]+)\)/) || [])[1];
      return yo.zona === zona ? 0.8 : ({ 'Triana': 1.5, 'Los Remedios': 2.1, 'Centro': 2.4, 'Macarena': 3.6, 'Nervión': 4.2, 'Cerro del Águila': 6.3 }[yo.zona] || 5);
    };

    return {
      s, yo, hermandad, turno, misTurnos, ofertasPendientes, avisos, distancia, habilitado,
      notificaciones: () => !yo ? [] : s.notificaciones.filter(n => n.trabajador === yo.id),

      entrar(correo, clave) {
        const u = s.usuarios.find(x => x.correo === correo.trim().toLowerCase());
        if (!u || u.clave !== clave) return 'El correo o la contraseña no son correctos.';
        if (!u.activo) return 'Tu cuenta está desactivada. Habla con el coordinador.';
        cambiar(n => { n.sesion = { id: u.id, nombre: u.nombre, trabajador: u.trabajador }; });
        return null;
      },
      salir() { cambiar(n => { n.sesion = null; }); },
      reiniciar() { cambiar(n => { Object.assign(n, copia(SEMILLA), { sesion: null }); }); },

      /* CU-017 Confirmar recepción del turno */
      confirmar(aid) { cambiar(n => { n.cuadrantes.forEach(c => c.puestos.forEach(a => { if (a.id === aid) a.acuse = 'Confirmado'; })); }); },

      /* CU-011 Comunicar baja de última hora */
      comunicarBaja(aid, motivo, explicacion) {
        cambiar(n => {
          const c = n.cuadrantes.find(x => x.puestos.some(a => a.id === aid));
          const a = c.puestos.find(x => x.id === aid);
          a.acuse = 'Baja';
          n.bajas.unshift({ id: id('b'), cuadrante: c.id, puesto: aid, trabajador: yo.id, motivo, explicacion, fecha: ahora(), estado: 'Abierta', ofertas: [], sustituto: '' });
        });
      },

      /* CU-014 Aceptar sustitución (y CU-015: el sistema actualiza el cuadrante) */
      responderOferta(bid, acepta) {
        if (s.bajas.find(x => x.id === bid).estado !== 'Abierta') return false;
        cambiar(n => {
          const b = n.bajas.find(x => x.id === bid);
          const o = b.ofertas.find(x => x.trabajador === yo.id);
          if (!acepta) { o.estado = 'Rechazada'; return; }
          const c = n.cuadrantes.find(x => x.id === b.cuadrante);
          const a = c.puestos.find(x => x.id === b.puesto);
          a.trabajador = yo.id; a.acuse = 'Confirmado';
          b.estado = 'Cubierta'; b.sustituto = yo.id;
          b.ofertas.forEach(x => { if (x.trabajador === yo.id) x.estado = 'Aceptada'; else if (x.estado === 'Enviada') x.estado = 'Caducada'; });
        });
        return true;
      },

      /* CU-004 Marcar disponibilidad */
      guardarDisponibilidad(disp) { cambiar(n => { n.trabajadores.find(t => t.id === yo.id).disponibilidad = disp; }); },

      /* CU-020 Consultar tablón: marcar leído */
      leerAviso(vid) { cambiar(n => { const v = n.avisos.find(x => x.id === vid); if (!v.leidos.includes(yo.id)) v.leidos.push(yo.id); }); },
      leerNotificaciones() { cambiar(n => { n.notificaciones.forEach(x => { if (x.trabajador === yo.id) x.leida = true; }); }); },

      /* CU-005 Actualizar perfil, uniformidad y capacitaciones */
      actualizarPerfil(datos) { cambiar(n => { Object.assign(n.trabajadores.find(t => t.id === yo.id), datos); }); },
      solicitarCapacitacion(rol, experiencia) {
        cambiar(n => { const t = n.trabajadores.find(x => x.id === yo.id); t.capacitaciones = t.capacitaciones.filter(c => c.rol !== rol); t.capacitaciones.push({ rol, estado: 'Pendiente', experiencia }); });
      }
    };
  }, [s, cambiar]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useAlmacen = () => useContext(Ctx);

/* Formato de fechas */
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const fecha = iso => { const [y, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
export const fechaLarga = iso => { const d = new Date(iso.slice(0, 10) + 'T12:00'); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES_L[d.getMonth()]}`; };
export const diaCorto = iso => { const d = new Date(iso.slice(0, 10) + 'T12:00'); return { dia: d.getDate(), mes: MESES[d.getMonth()] }; };
export const hora = f => (f && f.length > 10 ? f.slice(11) : '');
export const citacion = horario => horario.split(' – ')[0];
