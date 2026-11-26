/* App del trabajador — versión HTML/CSS del prototipo (la app real está en app-react-native/) */
(function () {
  const { esc, chip, fecha } = UI;
  const S = () => DB.s;
  const rutas = {};
  let param = '';
  const A = window.A = {};

  const ICON = {
    turnos: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    disp: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    avisos: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H7l-3 3z"/></svg>',
    perfil: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    hoy: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    bajas: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    cuadrante: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    presupuesto: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
    mas: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
    campana: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'
  };

  const yo = () => DB.trabajador(S().sesionApp.trabajador);
  const ses = () => S().sesionApp;
  const ofertasPendientes = () => S().bajas.filter(b => b.estado === 'Abierta' && b.ofertas.some(o => o.trabajador === yo().id && o.estado === 'Enviada'));
  const avisosParaMi = () => S().avisos.filter(v => v.destinatarios.includes('Todos') || yo().capacitaciones.some(c => c.estado === 'Aprobada' && v.destinatarios.includes(c.rol)));
  const sinLeer = () => avisosParaMi().filter(v => !v.leidos.includes(yo().id)).length;
  const misNotif = () => S().notificaciones.filter(n => n.trabajador === yo().id);

  /* Pestañas inferiores de cada perfil */
  const TABS = {
    Trabajador: () => [['turnos', 'Turnos', ICON.turnos, DB.ofertasPara(yo().id).length], ['disponibilidad', 'Disponibilidad', ICON.disp], ['avisos', 'Avisos', ICON.avisos, sinLeer()], ['perfil', 'Perfil', ICON.perfil]],
    Gestion: () => [['c-hoy', 'Hoy', ICON.hoy], ['c-bajas', 'Bajas', ICON.bajas, S().bajas.filter(b => b.estado === 'Abierta').length], ['c-cuadrantes', 'Cuadrantes', ICON.cuadrante], ['c-mas', 'Más', ICON.mas]],
    Hermandad: () => [['h-inicio', 'Inicio', ICON.hoy], ['h-cortejo', 'Cortejo', ICON.cuadrante], ['h-presupuestos', 'Presupuestos', ICON.presupuesto, S().presupuestos.filter(p => p.estado === 'Enviado' && DB.solicitud(p.solicitud).hermandad === ses().hermandad).length], ['h-mas', 'Más', ICON.mas]]
  };
  const grupo = rol => (rol === 'Coordinador' || rol === 'Administrador') ? 'Gestion' : rol;

  function marco({ titulo, sub = '', volver = '', tab = '', cuerpo, clase = '' }) {
    const s = ses(); const g = grupo(s.rol);
    const n = g === 'Trabajador' ? misNotif().filter(x => !x.leida).length : 0;
    return `<div class="movil ${clase}">
      <header class="barra-sup">${volver ? `<a class="volver" href="#${volver}">‹ Volver</a>` : ''}
        <div class="fila"><div><h1>${esc(titulo)}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
        ${volver || g !== 'Trabajador' ? '' : `<button class="campana" data-act="notificaciones" aria-label="Notificaciones${n ? `, ${n} sin leer` : ''}">${ICON.campana}${n ? `<span class="punto">${n}</span>` : ''}</button>`}</div></header>
      <main class="contenido">${cuerpo}</main>
      ${tab ? `<nav class="pestanas-app" aria-label="Secciones">${TABS[g]().map(([h, txt, ic, aviso]) => `<a href="#${h}" class="${tab === h || (tab === 'disp' && h === 'disponibilidad') ? 'activo' : ''}">${ic}${txt}${aviso ? '<span class="punto"></span>' : ''}</a>`).join('')}</nav>` : ''}
    </div>`;
  }

  /* Rol que necesita cada pantalla; entrar directamente (p. ej. desde la presentación) abre una sesión de demostración */
  const ROL = {}; const DEMO = { Trabajador: 'u5', Gestion: 'u1', Admin: 'u2', Hermandad: 'u3' };
  const inicioDe = rol => ({ Trabajador: 'turnos', Gestion: 'c-hoy', Hermandad: 'h-inicio' })[grupo(rol)];
  function asegurar(req) {
    const s = ses();
    const ok = s && (req === 'Admin' ? s.rol === 'Administrador' : grupo(s.rol) === req);
    if (ok) return;
    const u = S().usuarios.find(x => x.id === DEMO[req]);
    S().sesionApp = { id: u.id, nombre: u.nombre, rol: u.rol, trabajador: u.trabajador || '', hermandad: u.hermandad || '' }; DB.guardar();
  }
  function pintar() {
    DB.recargar(); UI.cerrarModal();
    if (S().sesionApp && !S().sesionApp.rol) S().sesionApp = null;
    let h = location.hash.slice(1) || (ses() ? inicioDe(ses().rol) : 'login');
    param = '';
    if (!rutas[h]) { const i = h.lastIndexOf('-'); if (i > 0 && rutas[h.slice(0, i)]) { param = h.slice(i + 1); h = h.slice(0, i); } }
    if (!rutas[h]) h = ses() ? inicioDe(ses().rol) : 'login';
    if (h !== 'login') asegurar(ROL[h] || 'Trabajador');
    document.getElementById('raiz').innerHTML = rutas[h]();
    if (A.despues) { A.despues(); A.despues = null; }
    window.scrollTo(0, 0);
  }
  const ir = h => { if (location.hash === '#' + h) pintar(); else location.hash = h; };
  const acciones = {};
  document.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b && acciones[b.dataset.act]) { e.preventDefault(); acciones[b.dataset.act](b); } });
  document.addEventListener('submit', e => { const f = e.target.closest('form[data-form]'); if (f && acciones[f.dataset.form]) { e.preventDefault(); acciones[f.dataset.form](f); } });
  window.addEventListener('hashchange', pintar);
  window.addEventListener('storage', pintar);

  /* ---------- Acceso (MOCK-006) ---------- */
  rutas.login = () => `<div class="movil"><div class="acceso-app">
    <div class="arriba">${P_CIRIO(46)}<h1>Servicios Cofrades</h1><p style="color:#CDBFD6">Turnos, cuadrantes, bajas y presupuestos desde el móvil, también en plena calle.</p></div>
    <form data-form="entrar" novalidate>
      <div class="campo"><label for="c">Correo electrónico</label><input id="c" name="correo" type="email" autocomplete="username"></div>
      <div class="campo"><label for="k">Contraseña</label><input id="k" name="clave" type="password" autocomplete="current-password"></div>
      <p class="error texto-urgente" id="err" role="alert"></p>
      <button class="btn btn-pri btn-bloque" type="submit">Entrar</button>
      <a href="#login" class="tenue" style="text-align:center">He olvidado mi contraseña</a>
      <p class="demo">Cuentas de prueba (contraseña <b>demo</b>): ${[['juan.perez@correo.es', 'trabajador'], ['luis@chamorrocofrades.es', 'coordinador'], ['admin@chamorrocofrades.es', 'administrador'], ['secretaria@hdadestrella.es', 'hermandad']].map(([c, n]) => `<button type="button" data-act="demo" data-c="${c}">${n}</button>`).join(', ')}.<br><button type="button" data-act="reiniciar">Restablecer datos de demostración</button></p></form></div></div>`;
  acciones.demo = b => { const f = document.querySelector('[data-form="entrar"]'); f.correo.value = b.dataset.c; f.clave.value = 'demo'; };
  acciones.reiniciar = () => { DB.reiniciar(); UI.toast('Datos de demostración restablecidos'); pintar(); };
  acciones.entrar = f => {
    const u = S().usuarios.find(x => x.correo === f.correo.value.trim().toLowerCase());
    const err = document.getElementById('err');
    if (!u || u.clave !== f.clave.value) { err.textContent = 'El correo o la contraseña no son correctos.'; return; }
    if (!u.activo) { err.textContent = 'Tu cuenta está desactivada. Habla con el coordinador.'; return; }
    S().sesionApp = { id: u.id, nombre: u.nombre, rol: u.rol, trabajador: u.trabajador || '', hermandad: u.hermandad || '' };
    DB.auditar('Iniciar sesión', 'App móvil', 'Correcto', u.nombre); DB.guardar(); ir(inicioDe(u.rol));
  };
  acciones.salir = () => { DB.auditar('Cerrar sesión', 'App móvil', 'Correcto', S().sesionApp.nombre); S().sesionApp = null; DB.guardar(); ir('login'); };

  /* ---------- Mis turnos (CU-016) — pantalla nueva ---------- */
  rutas.turnos = () => {
    const t = yo(); const turnos = DB.turnosDe(t.id).filter(x => x.asignacion.acuse !== 'Baja');
    const ofertas = ofertasPendientes();
    const prox = turnos[0];
    const tarjetaOferta = b => { const c = DB.cuadrante(b.cuadrante); const a = c.puestos.find(x => x.id === b.puesto); const so = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud);
      return `<a class="urgente-banner" href="#alerta-${b.id}"><span>Cobertura urgente</span><b>${esc(a.funcion)}, ${esc(DB.hermandad(so.hermandad).nombre)}</b><span>${UI.fechaLarga(so.fecha)}, ${esc(a.horario.split(' – ')[0])}</span><br><span class="ir">Ver y responder</span></a>`; };
    return marco({ titulo: `Hola, ${t.nombre.split(' ')[0]}`, sub: 'Semana Santa 2027', tab: 'turnos', cuerpo: `
      ${ofertas.map(tarjetaOferta).join('')}
      ${prox ? `<p class="seccion-t">Tu próximo turno</p>
        <div class="proximo"><a href="#detalle-${prox.asignacion.id}" style="color:inherit;text-decoration:none"><div class="cab"><div class="fecha-g"><b>${UI.diaCorto(prox.solicitud.fecha).dia}</b><span>${UI.diaCorto(prox.solicitud.fecha).mes}</span></div>
          <div><h3>${esc(prox.asignacion.puesto)}</h3><p class="muted">${esc(prox.hermandad.nombre)}</p><p class="muted">Citación ${esc(prox.asignacion.horario.split(' – ')[0])} h</p></div></div></a>
          <div class="pie">${chip(prox.asignacion.acuse, prox.asignacion.acuse === 'Pendiente' ? 'Sin confirmar' : 'Confirmado')}${prox.asignacion.acuse === 'Pendiente' ? `<button class="btn btn-pri btn-peq" data-act="confirmar" data-a="${prox.asignacion.id}">Confirmar recepción</button>` : `<a class="btn btn-peq" href="#detalle-${prox.asignacion.id}">Ver detalle</a>`}</div></div>` : ''}
      ${turnos.length > 1 ? `<p class="seccion-t">Más turnos</p><ul class="lista">${turnos.slice(1).map(x => { const d = UI.diaCorto(x.solicitud.fecha); return `<li><a href="#detalle-${x.asignacion.id}"><div class="mini-fecha"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(x.asignacion.puesto)}</b><div class="tenue">${esc(x.hermandad.nombre)}</div></div>${chip(x.asignacion.acuse, x.asignacion.acuse === 'Pendiente' ? 'Sin confirmar' : 'Confirmado')}</a></li>`; }).join('')}</ul>` : ''}
      ${!turnos.length && !ofertas.length ? `<div class="tarjeta vacia"><h3>Sin turnos asignados</h3><p>Cuando el coordinador publique un cuadrante en el que estés, te avisaremos. Mantén al día tu disponibilidad.</p><p style="margin-top:12px"><a class="btn" href="#disponibilidad">Marcar disponibilidad</a></p></div>` : ''}` });
  };

  /* ---------- Detalle del servicio (MOCK-014, CU-016, CU-017) ---------- */
  const buscarTurno = aid => { for (const c of S().cuadrantes) { const a = c.puestos.find(x => x.id === aid); if (a) { const so = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud); return { c, a, so, h: DB.hermandad(so.hermandad) }; } } };
  rutas.detalle = () => {
    const x = buscarTurno(param) || buscarTurno(DB.turnosDe(yo().id)[0]?.asignacion.id);
    if (!x) return marco({ titulo: 'Detalle del servicio', volver: 'turnos', cuerpo: '<div class="tarjeta vacia"><h3>Turno no encontrado</h3></div>' });
    const companeros = x.c.puestos.filter(p => p.trabajador && p.trabajador !== yo().id && p.acuse !== 'Baja').map(p => `${DB.trabajador(p.trabajador).nombre} (${p.puesto.replace(/ \d+$/, '').toLowerCase()})`);
    const uniformidad = (S().eventos.find(e => e.id === x.so.evento) || {}).notas || 'Dalmática y cíngulo';
    return marco({ titulo: 'Detalle del servicio', volver: 'turnos', cuerpo: `
      <div class="tarjeta"><p class="tenue">${esc(x.h.nombre)}</p><h2 style="font-size:21px;margin:2px 0 4px">${esc(x.a.puesto)}</h2>${chip(x.a.acuse, x.a.acuse === 'Pendiente' ? 'Sin confirmar' : x.a.acuse)}
        <div style="margin-top:10px">
          <div class="dato"><span>Acto</span><span>${esc(x.so.acto.replace('Estación de penitencia, ', ''))}</span></div>
          <div class="dato"><span>Día</span><span>${UI.fechaLarga(x.so.fecha)}</span></div>
          <div class="dato"><span>Citación</span><span>${esc(x.a.horario.split(' – ')[0])} h</span></div>
          <div class="dato"><span>Lugar</span><span>${esc(x.h.sede)}</span></div>
          <div class="dato"><span>Uniformidad</span><span>${esc(uniformidad)}</span></div>
          <div class="dato"><span>Compañeros</span><span>${esc(companeros.join(', ') || '—')}</span></div></div></div>
      <div class="acciones-v">
        ${x.a.acuse === 'Pendiente' ? `<button class="btn btn-pri btn-bloque" data-act="confirmar" data-a="${x.a.id}">Confirmar recepción del turno</button>` : ''}
        <a class="btn btn-bloque" href="https://www.google.com/maps/search/${encodeURIComponent(x.h.sede + ', Sevilla')}" target="_blank" rel="noopener">Ver ubicación</a>
        ${x.a.acuse !== 'Baja' ? `<a class="btn btn-bloque" style="color:var(--burdeos)" href="#baja-${x.a.id}">No puedo asistir</a>` : ''}</div>` });
  };
  acciones.confirmar = b => {
    const x = buscarTurno(b.dataset.a); x.a.acuse = 'Confirmado';
    DB.auditar('Confirmar recepción de turno', `${x.a.puesto}, ${x.h.nombre}`, 'Correcto', yo().nombre); DB.guardar();
    UI.toast('Turno confirmado'); pintar();
  };

  /* ---------- Notificar baja (MOCK-016, CU-011) ---------- */
  rutas.baja = () => {
    const x = buscarTurno(param) || buscarTurno(DB.turnosDe(yo().id)[0]?.asignacion.id);
    return marco({ titulo: 'Comunicar baja', volver: `detalle-${x.a.id}`, cuerpo: `
      <div class="tarjeta"><b>${esc(x.a.puesto)}</b><div class="tenue">${esc(x.h.nombre)}, ${UI.fechaLarga(x.so.fecha)} a las ${esc(x.a.horario.split(' – ')[0])}</div></div>
      <form data-form="enviar-baja" data-a="${x.a.id}" class="acciones-v" novalidate>
        <p class="seccion-t" style="margin-bottom:0">Motivo</p>
        <div class="opciones" role="radiogroup" aria-label="Motivo">${['Enfermedad', 'Motivos familiares', 'Trabajo o estudios', 'Otro motivo'].map((m, i) => `<label class="opcion"><input type="radio" name="motivo" value="${m}" ${i === 0 ? 'checked' : ''}> ${m}</label>`).join('')}</div>
        <div class="campo"><label for="ex">Explicación</label><textarea id="ex" name="explicacion" placeholder="Cuéntale al coordinador qué ha pasado"></textarea></div>
        <div class="campo"><label for="js">Justificante (opcional)</label><input id="js" name="justificante" type="file" accept="image/*,.pdf"></div>
        <div class="nota nota-urg">Tu puesto quedará libre al instante y el coordinador buscará un sustituto.</div>
        <button class="btn btn-urg btn-bloque" type="submit">Comunicar baja</button></form>` });
  };
  acciones['enviar-baja'] = f => {
    const x = buscarTurno(f.dataset.a);
    x.a.acuse = 'Baja';
    S().bajas.unshift({ id: DB.id('b'), cuadrante: x.c.id, puesto: x.a.id, trabajador: yo().id, motivo: f.motivo.value, explicacion: f.explicacion.value.trim(), justificante: f.justificante.files[0]?.name || '', fecha: DB.ahora(), estado: 'Abierta', ofertas: [], sustituto: '' });
    DB.auditar('Comunicar baja', `${x.a.puesto}, ${x.h.nombre}`, 'Correcto', yo().nombre); DB.guardar();
    UI.toast('Baja comunicada. El coordinador ya está avisado.'); ir('turnos');
  };

  /* ---------- Alerta de cobertura urgente (MOCK-017, CU-014) ---------- */
  rutas.alerta = () => {
    const b = S().bajas.find(x => x.id === param) || ofertasPendientes()[0];
    if (!b) return marco({ titulo: 'Cobertura urgente', volver: 'turnos', cuerpo: '<div class="tarjeta vacia"><h3>Sin alertas</h3><p>No tienes ofertas de sustitución pendientes.</p></div>' });
    const c = DB.cuadrante(b.cuadrante); const a = c.puestos.find(x => x.id === b.puesto); const so = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud); const h = DB.hermandad(so.hermandad);
    const o = b.ofertas.find(x => x.trabajador === yo().id);
    const cand = DB.candidatos(c, a).find(x => x.t.id === yo().id);
    const abierta = b.estado === 'Abierta' && o && o.estado === 'Enviada';
    A.despues = () => { const el = document.getElementById('reloj'); if (!el || !o) return; const fin = new Date(o.caduca.replace(' ', 'T')); const tick = () => { const ahora = new Date(); ahora.setFullYear(fin.getFullYear(), fin.getMonth(), fin.getDate()); let s = Math.round((((fin - ahora) / 1000) % 43200 + 43200) % 43200); el.textContent = `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}`; }; tick(); clearInterval(A.int); A.int = setInterval(tick, 15000); };
    return marco({ titulo: 'Cobertura urgente', sub: 'Se busca sustituto', volver: 'turnos', clase: 'alerta-pant', cuerpo: `
      <div class="tarjeta" style="color:var(--tinta)"><p class="tenue">${esc(h.nombre)}</p><h2 style="font-size:22px;margin:2px 0 8px">${esc(a.funcion)}</h2>
        <div class="dato"><span>Día</span><span>${UI.fechaLarga(so.fecha)}</span></div>
        <div class="dato"><span>Citación</span><span>${esc(a.horario.split(' – ')[0])} h</span></div>
        <div class="dato"><span>Lugar</span><span>${esc(h.sede)}</span></div>
        <div class="dato"><span>Distancia</span><span>${cand ? cand.km.toFixed(1) + ' km' : '—'}</span></div></div>
      ${abierta ? `<div style="text-align:center"><p style="color:#F6D9DD">La oferta caduca en</p><div class="reloj" id="reloj">--:--</div><p style="color:#F6D9DD;font-size:13px">horas : minutos. El primero en aceptar se queda el puesto.</p></div>
        <div class="acciones-v"><button class="btn btn-bloque" style="background:#fff;color:var(--burdeos);border-color:#fff" data-act="aceptar-oferta" data-b="${b.id}">Aceptar sustitución</button>
        <button class="btn btn-bloque" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.5)" data-act="rechazar-oferta" data-b="${b.id}">No puedo</button></div>`
      : `<div class="tarjeta" style="color:var(--tinta)"><b>${b.sustituto === yo().id ? 'Has aceptado esta sustitución. Ya aparece en tus turnos.' : 'Esta oferta ya no está disponible.'}</b></div>`}` });
  };
  acciones['aceptar-oferta'] = bt => {
    const b = S().bajas.find(x => x.id === bt.dataset.b);
    if (b.estado !== 'Abierta') { UI.toast('Otro compañero ya ha cubierto el puesto', 'urg'); return pintar(); }
    P_cubrir(b, yo().id); DB.guardar(); UI.toast('Sustitución aceptada. Ya está en tus turnos.'); ir('turnos');
  };
  acciones['rechazar-oferta'] = bt => {
    const b = S().bajas.find(x => x.id === bt.dataset.b); const o = b.ofertas.find(x => x.trabajador === yo().id); o.estado = 'Rechazada';
    DB.auditar('Rechazar sustitución', b.id, 'Correcto', yo().nombre); DB.guardar(); UI.toast('Oferta rechazada'); ir('turnos');
  };
  /* Misma lógica que el portal al registrar la sustitución (CU-015) */
  function P_cubrir(b, tid) {
    const c = DB.cuadrante(b.cuadrante); const a = c.puestos.find(x => x.id === b.puesto); const so = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud);
    a.trabajador = tid; a.acuse = 'Confirmado'; b.estado = 'Cubierta'; b.sustituto = tid;
    b.ofertas.forEach(o => { if (o.trabajador === tid) o.estado = 'Aceptada'; else if (o.estado === 'Enviada') o.estado = 'Caducada'; });
    DB.auditar('Aceptar sustitución', `${a.puesto}, ${DB.hermandad(so.hermandad).nombre}`, 'Correcto', yo().nombre);
  }

  /* ---------- Disponibilidad (MOCK-015, CU-004) ---------- */
  const DIAS = [['2027-03-21', 'Domingo de Ramos'], ['2027-03-22', 'Lunes Santo'], ['2027-03-23', 'Martes Santo'], ['2027-03-24', 'Miércoles Santo'], ['2027-03-25', 'Jueves Santo'], ['2027-03-26', 'Madrugá y Viernes Santo'], ['2027-03-27', 'Sábado Santo'], ['2027-03-28', 'Domingo de Resurrección']];
  let dispEdit = null;
  rutas.disponibilidad = () => {
    if (!dispEdit) dispEdit = JSON.parse(JSON.stringify(yo().disponibilidad));
    return marco({ titulo: 'Disponibilidad', sub: 'Marca cuándo puedes trabajar', tab: 'disp', cuerpo: `
      <p class="muted" style="font-size:14px">El coordinador usa estas franjas para el cuadrante y para avisarte de sustituciones.</p>
      ${DIAS.map(([d, n]) => { const f = dispEdit[d] || []; const dc = UI.diaCorto(d); return `<div class="dia-disp"><div class="t"><b>${n}</b><span class="tenue">${dc.dia} ${dc.mes}</span></div><div class="franjas">${['mañana', 'tarde', 'noche'].map(x => `<button class="franja" aria-pressed="${f.includes(x)}" data-act="franja" data-d="${d}" data-f="${x}">${x[0].toUpperCase() + x.slice(1)}</button>`).join('')}</div></div>`; }).join('')}
      <div class="acciones-v"><button class="btn btn-pri btn-bloque" data-act="guardar-disp">Guardar disponibilidad</button><button class="btn btn-bloque" data-act="copiar-disp">Copiar la del año pasado</button></div>` });
  };
  acciones.franja = b => { const l = dispEdit[b.dataset.d] = dispEdit[b.dataset.d] || []; const i = l.indexOf(b.dataset.f); if (i >= 0) l.splice(i, 1); else l.push(b.dataset.f); b.setAttribute('aria-pressed', i < 0); };
  acciones['guardar-disp'] = () => { yo().disponibilidad = dispEdit; DB.auditar('Marcar disponibilidad', 'Semana Santa 2027', 'Correcto', yo().nombre); DB.guardar(); dispEdit = null; UI.toast('Disponibilidad guardada'); pintar(); };
  acciones['copiar-disp'] = () => { dispEdit = {}; DIAS.slice(0, 6).forEach(([d]) => { dispEdit[d] = ['tarde', 'noche']; }); UI.toast('Copiada la disponibilidad de 2026. Revísala y guarda.'); pintar(); };

  /* ---------- Tablón de avisos (MOCK-025, CU-020) ---------- */
  rutas.avisos = () => marco({ titulo: 'Avisos', sub: 'Del coordinador a la plantilla', tab: 'avisos', cuerpo: `
    <ul class="lista">${avisosParaMi().map(v => { const nuevo = !v.leidos.includes(yo().id); return `<li><a href="#aviso-${v.id}"><div class="mini-fecha"><b>${UI.diaCorto(v.fecha.slice(0, 10)).dia}</b><span>${UI.diaCorto(v.fecha.slice(0, 10)).mes}</span></div><div><b style="${nuevo ? '' : 'font-weight:500'}">${esc(v.titulo)}</b><div class="tenue" style="display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">${esc(v.texto)}</div></div>${nuevo ? '<span class="nuevo">NUEVO</span>' : ''}</a></li>`; }).join('') || '<li class="item">No hay avisos.</li>'}</ul>` });
  rutas.aviso = () => {
    const v = S().avisos.find(x => x.id === param) || avisosParaMi()[0];
    if (!v.leidos.includes(yo().id)) { v.leidos.push(yo().id); DB.guardar(); }
    return marco({ titulo: 'Aviso', volver: 'avisos', cuerpo: `<article class="tarjeta"><h2 style="font-size:21px">${esc(v.titulo)}</h2><p class="tenue" style="margin:4px 0 12px">${esc(v.autor)}, ${fecha(v.fecha)} a las ${UI.hora(v.fecha)}. Para ${esc(v.destinatarios.join(', ').toLowerCase())}.</p><p style="font-size:16px;line-height:1.55">${esc(v.texto)}</p></article>` });
  };

  /* ---------- Mi perfil (MOCK-018, CU-005, CU-002) ---------- */
  rutas.perfil = () => {
    const t = yo();
    return marco({ titulo: t.nombre, sub: t.zona, tab: 'perfil', cuerpo: `
      <div class="tarjeta"><h2>Datos de contacto</h2><div style="margin-top:6px"><div class="dato"><span>Teléfono</span><span>${esc(t.telefono)}</span></div><div class="dato"><span>Correo</span><span>${esc(t.correo)}</span></div></div>
        <button class="btn btn-peq" style="margin-top:10px" data-act="editar-datos">Editar datos</button></div>
      <div class="tarjeta"><h2>Uniforme</h2><div style="margin-top:6px"><div class="dato"><span>Talla</span><span>${esc(t.talla)}</span></div><div class="dato"><span>Calzado</span><span>${esc(t.calzado)}</span></div></div>
        <button class="btn btn-peq" style="margin-top:10px" data-act="editar-tallas">Cambiar tallas</button></div>
      <div class="tarjeta"><h2>Capacitaciones</h2><div style="margin-top:6px">${t.capacitaciones.map(c => `<div class="dato"><span>${esc(c.rol)}</span><span>${chip(c.estado)}</span></div>`).join('')}</div>
        <button class="btn btn-pri btn-peq" style="margin-top:10px" data-act="solicitar-cap">Solicitar nueva capacitación</button></div>
      <button class="btn btn-bloque" data-act="salir">Cerrar sesión</button>` });
  };
  acciones['editar-datos'] = () => { const t = yo(); UI.modal({ titulo: 'Editar datos', cuerpo: `<div class="campo"><label for="pt">Teléfono</label><input id="pt" value="${esc(t.telefono)}" type="tel"></div><div class="campo"><label for="pc">Correo</label><input id="pc" value="${esc(t.correo)}" type="email"></div>`,
    acciones: [{ texto: 'Cancelar' }, { texto: 'Guardar', clase: 'btn-pri', fn: m => { t.telefono = m.querySelector('#pt').value; t.correo = m.querySelector('#pc').value; DB.auditar('Actualizar perfil', 'Datos de contacto', 'Correcto', t.nombre); DB.guardar(); UI.toast('Datos guardados'); pintar(); } }] }); };
  acciones['editar-tallas'] = () => { const t = yo(); UI.modal({ titulo: 'Tallas de uniforme', cuerpo: `<div class="campo"><label for="tt">Talla</label><select id="tt">${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(x => `<option ${x === t.talla ? 'selected' : ''}>${x}</option>`).join('')}</select></div><div class="campo"><label for="tc">Calzado</label><input id="tc" type="number" min="35" max="50" value="${t.calzado}"></div>`,
    acciones: [{ texto: 'Cancelar' }, { texto: 'Guardar', clase: 'btn-pri', fn: m => { t.talla = m.querySelector('#tt').value; t.calzado = +m.querySelector('#tc').value; DB.auditar('Actualizar perfil', 'Uniformidad', 'Correcto', t.nombre); DB.guardar(); UI.toast('Tallas guardadas'); pintar(); } }] }); };
  acciones['solicitar-cap'] = () => { const t = yo(); const libres = DB.FUNCIONES.filter(f => !t.capacitaciones.some(c => c.rol === f && c.estado !== 'Rechazada'));
    if (!libres.length) return UI.toast('Ya tienes todas las capacitaciones solicitadas');
    UI.modal({ titulo: 'Solicitar capacitación', cuerpo: `<div class="campo"><label for="cr">Puesto</label><select id="cr" onchange="document.getElementById('crd').textContent=DB.DESCRIPCION_FUNCIONES[this.value]">${libres.map(f => `<option>${f}</option>`).join('')}</select><span class="tenue" id="crd">${esc(DB.DESCRIPCION_FUNCIONES[libres[0]])}</span></div><div class="campo"><label for="ce">Tu experiencia</label><textarea id="ce" placeholder="Dónde y cuánto tiempo lo has hecho"></textarea></div>`,
      acciones: [{ texto: 'Cancelar' }, { texto: 'Enviar solicitud', clase: 'btn-pri', fn: m => { const e = m.querySelector('#ce').value.trim(); if (!e) { UI.toast('Cuenta tu experiencia', 'urg'); return false; }
        const rol = m.querySelector('#cr').value; t.capacitaciones = t.capacitaciones.filter(c => c.rol !== rol); t.capacitaciones.push({ rol, estado: 'Pendiente', experiencia: e });
        DB.auditar('Solicitar capacitación', rol, 'Correcto', t.nombre); DB.guardar(); UI.toast('Solicitud enviada al coordinador'); pintar(); } }] }); };

  /* ---------- Notificaciones ---------- */
  acciones.notificaciones = () => {
    const ns = misNotif();
    UI.modal({ titulo: 'Notificaciones', cuerpo: ns.length ? `<ul class="lista">${ns.map(n => `<li><div class="item" style="grid-template-columns:1fr auto"><div><b style="${n.leida ? 'font-weight:500' : ''}">${esc(n.titulo)}</b><div class="tenue">${esc(n.texto)}</div></div><span class="tenue">${fecha(n.fecha).slice(0, 5)}</span></div></li>`).join('')}</ul>` : '<p class="muted">No tienes notificaciones.</p>',
      acciones: [{ texto: 'Cerrar', clase: 'btn-pri', fn: () => { ns.forEach(n => { n.leida = true; }); DB.guardar(); pintar(); } }] });
  };

  const P_CIRIO = h => `<svg width="${Math.round(h * .45)}" height="${h}" viewBox="0 0 18 40" aria-hidden="true"><path d="M9 1c2.6 3.4 3.4 5.6 3.4 7.4A3.4 3.4 0 0 1 9 11.8a3.4 3.4 0 0 1-3.4-3.4C5.6 6.6 6.4 4.4 9 1z" fill="#C9A24A"/><rect x="5" y="14" width="8" height="22" rx="1.5" fill="#F4EEDD"/><rect x="2" y="36" width="14" height="3" rx="1" fill="#C9A24A"/></svg>`;
  A.pintar = pintar;
  Object.assign(A, { rutas, acciones, ROL, marco, ir, ICON, ses, esc, chip });
  Object.defineProperty(A, 'param', { get: () => param });
})();
