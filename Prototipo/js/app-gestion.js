/* App móvil — coordinador, administrador y hermandades (gestión desde la calle en Semana Santa) */
(function () {
  const { rutas, acciones, ROL, marco, ir } = A;
  const { esc, chip, fecha, euros } = UI;
  const S = () => DB.s;
  const ses = () => A.ses();
  const pintar = () => A.pintar();
  const cit = h => h.split(' – ')[0];
  const ruta = (nombre, rol, fn) => { rutas[nombre] = fn; ROL[nombre] = rol; };
  const nombreT = id => (DB.trabajador(id) || {}).nombre || 'Sin cubrir';
  const tel = t => t ? `<a class="tel" href="tel:${t.telefono.replace(/\s/g, '')}">${esc(t.telefono)}</a>` : '';
  const soloWeb = txt => `<p class="aviso-web">${txt}</p>`;
  const vacia = (t, x) => `<div class="tarjeta vacia"><h3>${esc(t)}</h3><p>${x}</p></div>`;

  /* ======================= COORDINADOR / ADMINISTRADOR ======================= */
  const G = 'Gestion';

  /* Hoy: lo que necesita atención (MOCK-007 en móvil) */
  ruta('c-hoy', G, () => {
    const s = S();
    const bajas = s.bajas.filter(b => b.estado === 'Abierta').length;
    const pub = s.cuadrantes.filter(c => c.estado === 'Publicado');
    const sinConf = pub.reduce((n, c) => n + c.puestos.filter(a => a.acuse === 'Pendiente').length, 0);
    const presup = s.presupuestos.filter(p => p.estado === 'Enviado').length;
    const capac = s.trabajadores.reduce((n, t) => n + t.capacitaciones.filter(c => c.estado === 'Pendiente').length, 0);
    const proximos = [...pub].sort((a, b) => DB.sol(a).fecha.localeCompare(DB.sol(b).fecha));
    return marco({ titulo: `Hola, ${ses().nombre.split(' ')[0]}`, sub: ses().rol, tab: 'c-hoy', cuerpo: `
      <div class="kpis">
        <a class="kpi ${bajas ? 'alerta' : ''}" href="#c-bajas"><b>${bajas}</b><span>Bajas urgentes abiertas</span></a>
        <a class="kpi" href="#c-cuadrantes"><b>${sinConf}</b><span>Turnos sin confirmar</span></a>
        <a class="kpi" href="#c-presupuestos"><b>${presup}</b><span>Presupuestos sin respuesta</span></a>
        <a class="kpi" href="#c-capacitaciones"><b>${capac}</b><span>Capacitaciones por validar</span></a>
      </div>
      <p class="seccion-t">Próximos servicios</p>
      <ul class="lista">${proximos.map(c => { const so = DB.sol(c); const d = UI.diaCorto(so.fecha); const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
        return `<li><a href="#c-cuadrante-${c.id}"><div class="mini-fecha"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(DB.hermandad(so.hermandad).nombre)}</b><div class="tenue">${esc(cit(so.horario))} h, ${conf} de ${c.puestos.length} confirmados</div></div>${c.puestos.some(a => a.acuse === 'Baja') ? chip('Baja', 'Baja') : chip(conf === c.puestos.length ? 'Confirmado' : 'Pendiente', conf === c.puestos.length ? 'Completo' : 'Pendiente')}</a></li>`; }).join('')}</ul>
      <a class="btn btn-bloque" href="#c-avisos">Publicar un aviso a la plantilla</a>` });
  });

  /* Bajas urgentes (CU-012, CU-013, CU-015) */
  ruta('c-bajas', G, () => {
    const abiertas = S().bajas.filter(b => b.estado === 'Abierta'); const cubiertas = S().bajas.filter(b => b.estado !== 'Abierta');
    const item = b => { const x = DB.buscarTurno(b.puesto); const env = b.ofertas.filter(o => o.estado === 'Enviada').length;
      return `<li><a href="#c-baja-${b.id}"><div class="mini-fecha"><b>${UI.diaCorto(x.so.fecha).dia}</b><span>${UI.diaCorto(x.so.fecha).mes}</span></div><div><b>${esc(x.a.puesto)}</b><div class="tenue">${esc(x.h.nombre)}. ${b.estado === 'Abierta' ? `${env} oferta${env !== 1 ? 's' : ''} pendiente${env !== 1 ? 's' : ''}` : `Cubierta por ${esc(nombreT(b.sustituto))}`}</div></div>${chip(b.estado)}</a></li>`; };
    return marco({ titulo: 'Bajas urgentes', sub: 'Vacantes de última hora', tab: 'c-bajas', cuerpo: `
      ${abiertas.length ? `<ul class="lista">${abiertas.map(item).join('')}</ul>` : vacia('No hay bajas abiertas', 'Cuando un trabajador comunique una baja, aparecerá aquí al momento.')}
      ${cubiertas.length ? `<p class="seccion-t">Cubiertas</p><ul class="lista">${cubiertas.map(item).join('')}</ul>` : ''}` });
  });
  ruta('c-baja', G, () => {
    const b = S().bajas.find(x => x.id === A.param) || S().bajas[0];
    const x = DB.buscarTurno(b.puesto); const cands = DB.candidatos(x.c, x.a);
    const oferta = tid => b.ofertas.find(o => o.trabajador === tid);
    return marco({ titulo: x.a.puesto, sub: esc(x.h.nombre), volver: 'c-bajas', cuerpo: `
      <div class="tarjeta"><div class="dato"><span>Día</span><span>${UI.fechaLarga(x.so.fecha)}</span></div><div class="dato"><span>Citación</span><span>${esc(cit(x.a.horario))} h, ${esc(x.h.sede)}</span></div>
        <div class="dato"><span>Baja de</span><span>${esc(nombreT(b.trabajador))}</span></div><div class="dato"><span>Motivo</span><span>${esc(b.motivo)}${b.explicacion ? `. ${esc(b.explicacion)}` : ''}</span></div>${b.sustituto ? `<div class="dato"><span>Cubierta por</span><span class="texto-ok">${esc(nombreT(b.sustituto))}</span></div>` : ''}</div>
      ${b.estado !== 'Abierta' ? '' : cands.length ? `<p class="seccion-t">Candidatos (habilitados y libres ese día)</p>
        <ul class="lista">${cands.map(c => { const o = oferta(c.t.id); return `<li><div class="item-v"><div class="fila-v"><div><b>${esc(c.t.nombre)}</b><div class="tenue">${c.disp ? 'Disponible ese día' : 'Disponibilidad no declarada'}, a ${c.km.toFixed(1)} km. ${tel(c.t)}</div></div>${o ? chip(o.estado) : ''}</div>
          <div class="botones">${!o || o.estado === 'Rechazada' ? `<button class="btn btn-peq" data-act="c-alertar" data-b="${b.id}" data-t="${c.t.id}">Enviar alerta</button>` : ''}<button class="btn btn-peq btn-pri" data-act="c-asignar" data-b="${b.id}" data-t="${c.t.id}">Asignar</button></div></div></li>`; }).join('')}</ul>
        <button class="btn btn-urg btn-bloque" data-act="c-alertar-todos" data-b="${b.id}">Enviar alerta a todos</button>`
        : vacia('Sin candidatos libres', 'Ningún trabajador habilitado está libre ese día. Puedes publicar un aviso en el tablón.')}` });
  });
  acciones['c-alertar'] = bt => { const b = S().bajas.find(x => x.id === bt.dataset.b); DB.enviarAlerta(b, [bt.dataset.t], ses().nombre); DB.guardar(); UI.toast('Alerta enviada'); pintar(); };
  acciones['c-alertar-todos'] = bt => { const b = S().bajas.find(x => x.id === bt.dataset.b); const x = DB.buscarTurno(b.puesto);
    const ids = DB.candidatos(x.c, x.a).map(c => c.t.id).filter(id => !b.ofertas.some(o => o.trabajador === id && o.estado !== 'Rechazada'));
    if (!ids.length) return UI.toast('Todos los candidatos tienen ya una oferta', 'urg');
    DB.enviarAlerta(b, ids, ses().nombre); DB.guardar(); UI.toast(`Alerta enviada a ${ids.length} candidato${ids.length > 1 ? 's' : ''}`); pintar(); };
  acciones['c-asignar'] = bt => { const b = S().bajas.find(x => x.id === bt.dataset.b); const t = DB.trabajador(bt.dataset.t);
    UI.modal({ titulo: 'Registrar sustitución', cuerpo: `<p><b>${esc(t.nombre)}</b> ocupará el puesto y se actualizará el cuadrante.</p>`, acciones: [{ texto: 'Volver' }, { texto: 'Asignar', clase: 'btn-pri', fn: () => { DB.cubrirBaja(b, t.id, ses().nombre); DB.guardar(); UI.toast('Sustitución registrada'); ir('c-bajas'); } }] }); };

  /* Cuadrantes y acuses (CU-016, CU-018) */
  ruta('c-cuadrantes', G, () => {
    const cs = [...S().cuadrantes].sort((a, b) => DB.sol(a).fecha.localeCompare(DB.sol(b).fecha));
    return marco({ titulo: 'Cuadrantes', sub: 'Personal y confirmaciones', tab: 'c-cuadrantes', cuerpo: `
      <ul class="lista">${cs.map(c => { const so = DB.sol(c); const d = UI.diaCorto(so.fecha); const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
        return `<li><a href="#c-cuadrante-${c.id}"><div class="mini-fecha"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(DB.hermandad(so.hermandad).nombre)}</b><div class="tenue">${c.estado === 'Publicado' ? `${conf} de ${c.puestos.length} confirmados` : `${c.puestos.filter(a => a.trabajador).length} de ${c.puestos.length} cubiertos`}</div></div>${chip(c.estado)}</a></li>`; }).join('')}</ul>
      ${soloWeb('Generar, editar y publicar cuadrantes se hace desde el portal web, donde cabe la tabla completa.')}` });
  });
  ruta('c-cuadrante', G, () => {
    const c = DB.cuadrante(A.param) || S().cuadrantes[0]; const so = DB.sol(c); const h = DB.hermandad(so.hermandad);
    const pend = c.puestos.filter(a => a.acuse === 'Pendiente').length; const pub = c.estado === 'Publicado';
    return marco({ titulo: h.nombre, sub: `${UI.fechaLarga(so.fecha)}, ${esc(cit(so.horario))} h`, volver: 'c-cuadrantes', cuerpo: `
      <ul class="lista">${c.puestos.map(a => { const t = DB.trabajador(a.trabajador);
        return `<li><div class="item-v"><div class="fila-v"><div><b>${esc(a.puesto)}</b><div class="tenue">${a.acuse === 'Baja' ? 'Buscando sustituto' : esc(t ? t.nombre : 'Sin cubrir')} ${a.acuse !== 'Baja' ? tel(t) : ''}</div></div>${pub ? chip(a.acuse, a.acuse === 'Pendiente' ? 'Sin confirmar' : a.acuse) : ''}</div>
          ${pub && a.acuse === 'Pendiente' && t ? `<div class="botones"><button class="btn btn-peq" data-act="c-recordar" data-c="${c.id}" data-a="${a.id}">Recordar${a.recordado ? ' otra vez' : ''}</button></div>` : ''}${pub && a.acuse === 'Baja' ? `<div class="botones"><a class="btn btn-peq btn-urg" href="#c-bajas">Ver baja</a></div>` : ''}</div></li>`; }).join('')}</ul>
      ${pub ? `<button class="btn btn-pri btn-bloque" data-act="c-recordar" data-c="${c.id}" ${pend ? '' : 'disabled'}>Recordar a los ${pend} pendientes</button>` : soloWeb('Este cuadrante está en borrador. Se termina y publica desde el portal web.')}` });
  });
  acciones['c-recordar'] = b => { const c = DB.cuadrante(b.dataset.c); const n = DB.recordarAcuses(c, b.dataset.a ? [b.dataset.a] : null, ses().nombre); DB.guardar(); UI.toast(`Recordatorio enviado a ${n}`); pintar(); };

  /* Más */
  ruta('c-mas', G, () => {
    const adm = ses().rol === 'Administrador';
    const it = (h, t, x) => `<li><a href="#${h}"><div><b>${t}</b><div class="tenue">${x}</div></div><span class="tenue">›</span></a></li>`;
    return marco({ titulo: 'Más', sub: `${esc(ses().nombre)}, ${ses().rol.toLowerCase()}`, tab: 'c-mas', cuerpo: `
      <ul class="lista menu-mas">${it('c-avisos', 'Tablón de avisos', 'Publicar y consultar avisos')}${it('c-presupuestos', 'Presupuestos', 'Estado y desglose')}${it('c-personal', 'Personal', 'Fichas y teléfonos')}${it('c-capacitaciones', 'Capacitaciones', 'Aprobar o rechazar')}${it('c-eventos', 'Eventos', 'Días con trabajo')}</ul>
      ${adm ? `<p class="seccion-t">Administración</p><ul class="lista menu-mas">${it('c-usuarios', 'Usuarios y permisos', 'Activar o desactivar cuentas')}${it('c-auditoria', 'Registro de auditoría', 'Últimas acciones')}${it('c-sistema', 'Estado del sistema', 'Disponibilidad y rendimiento')}</ul>` : ''}
      ${soloWeb('Generar cuadrantes, elaborar presupuestos y dar de alta trabajadores o usuarios se hace desde el portal web.')}
      <button class="btn btn-bloque" data-act="salir">Cerrar sesión</button>` });
  });

  /* Tablón (CU-019) */
  ruta('c-avisos', G, () => marco({ titulo: 'Tablón de avisos', volver: 'c-mas', cuerpo: `
    <button class="btn btn-pri btn-bloque" data-act="c-publicar">Publicar aviso</button>
    <ul class="lista">${S().avisos.map(v => `<li><div class="item-v"><b>${esc(v.titulo)}</b><span class="muted">${esc(v.texto)}</span><span class="tenue">${fecha(v.fecha)}, para ${esc(v.destinatarios.join(', ').toLowerCase())}. Leído por ${v.leidos.length}.</span></div></li>`).join('')}</ul>` }));
  acciones['c-publicar'] = () => UI.modal({ titulo: 'Publicar aviso', cuerpo: `<div class="campo"><label for="at">Título</label><input id="at"></div><div class="campo"><label for="ax">Mensaje</label><textarea id="ax"></textarea></div>
    <div class="campo"><label for="ad">Para</label><select id="ad"><option>Todos</option>${DB.FUNCIONES.map(f => `<option>${f}</option>`).join('')}</select></div><label class="check"><input type="checkbox" id="ap" checked> Enviar también como notificación push</label>`,
    acciones: [{ texto: 'Cancelar' }, { texto: 'Publicar', clase: 'btn-pri', fn: m => { const t = m.querySelector('#at').value.trim(); const x = m.querySelector('#ax').value.trim(); if (!t || !x) { UI.toast('Escribe título y mensaje', 'urg'); return false; }
      DB.publicarAviso(t, x, [m.querySelector('#ad').value], m.querySelector('#ap').checked, ses().nombre); DB.guardar(); UI.toast('Aviso publicado'); pintar(); } }] });

  /* Presupuestos (CU-022) */
  ruta('c-presupuestos', G, () => marco({ titulo: 'Presupuestos', volver: 'c-mas', cuerpo: `
    <ul class="lista">${[...S().presupuestos].filter(p => p.estado !== 'Borrador').sort((a, b) => (b.enviado || '').localeCompare(a.enviado || '')).map(p => { const so = DB.solicitud(p.solicitud);
      return `<li><a href="#c-presupuesto-${p.id}"><div><b>${esc(DB.hermandad(so.hermandad).nombre)}</b><div class="tenue">${esc(p.codigo)}, ${euros(DB.totales(p).total)}</div></div><span></span>${chip(p.estado)}</a></li>`; }).join('')}</ul>
    ${soloWeb('Elaborar presupuestos nuevos y exportarlos a contabilidad se hace desde el portal web.')}` }));
  ruta('c-presupuesto', G, () => {
    const p = DB.presupuesto(A.param) || S().presupuestos[0]; const so = DB.solicitud(p.solicitud); const t = DB.totales(p);
    return marco({ titulo: p.codigo, sub: esc(DB.hermandad(so.hermandad).nombre), volver: 'c-presupuestos', cuerpo: desglose(p, so, t) + (p.estado === 'Enviado' ? `<button class="btn btn-bloque" data-act="c-reenviar" data-id="${p.id}">Reenviar a la hermandad</button>` : '') });
  });
  acciones['c-reenviar'] = b => { const p = DB.presupuesto(b.dataset.id); p.enviado = S().hoy; DB.auditar('Reenviar presupuesto', p.codigo, 'Correcto', ses().nombre); DB.guardar(); UI.toast('Presupuesto reenviado'); };
  function desglose(p, so, t) {
    return `<div class="tarjeta"><p class="tenue">${esc(so.acto)}, ${UI.fechaLarga(so.fecha)}</p><div style="margin:8px 0">${chip(p.estado)}</div>
      ${p.lineas.map(l => `<div class="dato"><span>${l.cantidad} × ${esc(l.funcion.toLowerCase())}<br><small class="tenue">${l.horas} h a ${euros(l.tarifa)}/h</small></span><span>${euros(l.cantidad * l.horas * l.tarifa)}</span></div>`).join('')}
      <div class="dato"><span>Base imponible</span><span>${euros(t.base)}</span></div><div class="dato"><span>IVA (${p.iva}%)</span><span>${euros(t.iva)}</span></div><div class="dato"><span><b>Total</b></span><span><b>${euros(t.total)}</b></span></div>
      ${p.motivo ? `<p class="texto-urgente" style="margin-top:8px">Motivo del rechazo: ${esc(p.motivo)}</p>` : ''}</div>`;
  }

  /* Personal (CU-003) */
  let q = '';
  ruta('c-personal', G, () => {
    const ts = S().trabajadores.filter(t => !t.baja && t.nombre.toLowerCase().includes(q.toLowerCase()));
    return marco({ titulo: 'Personal', volver: 'c-mas', cuerpo: `<input class="buscar-app" type="search" placeholder="Buscar por nombre" value="${esc(q)}" data-act-input="c-buscar" aria-label="Buscar">
      <ul class="lista">${ts.map(t => `<li><a href="#c-ficha-${t.id}"><div class="mini-fecha"><b style="font-size:15px">${UI.iniciales(t.nombre)}</b></div><div><b>${esc(t.nombre)}</b><div class="tenue">${esc(t.capacitaciones.filter(c => c.estado === 'Aprobada').map(c => c.rol).join(', '))}</div></div><span class="tenue">›</span></a></li>`).join('')}</ul>` });
  });
  document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.actInput === 'c-buscar') { q = e.target.value; const pos = e.target.selectionStart; pintar(); const n = document.querySelector('[data-act-input="c-buscar"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } } });
  ruta('c-ficha', G, () => {
    const t = DB.trabajador(A.param) || S().trabajadores[0]; const turnos = DB.turnosDe(t.id);
    const dias = Object.entries(t.disponibilidad).filter(([, f]) => f.length);
    return marco({ titulo: t.nombre, sub: esc(t.zona), volver: 'c-personal', cuerpo: `
      <div class="tarjeta"><div class="dato"><span>Teléfono</span><span>${tel(t)}</span></div><div class="dato"><span>Correo</span><span>${esc(t.correo)}</span></div><div class="dato"><span>Talla y calzado</span><span>${esc(t.talla)}, ${esc(t.calzado)}</span></div></div>
      <p class="seccion-t">Capacitaciones</p><div class="tarjeta">${t.capacitaciones.map(c => `<div class="dato"><span>${esc(c.rol)}</span><span>${chip(c.estado)}</span></div>`).join('')}</div>
      <p class="seccion-t">Disponibilidad</p><div class="tarjeta">${dias.length ? dias.map(([d, f]) => `<div class="dato"><span>${UI.fechaLarga(d)}</span><span>${f.join(', ')}</span></div>`).join('') : '<p class="muted">No ha declarado disponibilidad.</p>'}</div>
      <p class="seccion-t">Próximos turnos</p>${turnos.length ? `<ul class="lista">${turnos.map(x => `<li><a href="#c-cuadrante-${x.cuadrante.id}"><div class="mini-fecha"><b>${UI.diaCorto(x.solicitud.fecha).dia}</b><span>${UI.diaCorto(x.solicitud.fecha).mes}</span></div><div><b>${esc(x.asignacion.puesto)}</b><div class="tenue">${esc(x.hermandad.nombre)}</div></div>${chip(x.asignacion.acuse)}</a></li>`).join('')}</ul>` : '<p class="muted">Sin turnos asignados.</p>'}` });
  });

  /* Capacitaciones (CU-002) */
  ruta('c-capacitaciones', G, () => {
    const pend = []; S().trabajadores.forEach(t => t.capacitaciones.forEach((c, i) => { if (c.estado === 'Pendiente') pend.push({ t, c, i }); }));
    return marco({ titulo: 'Capacitaciones', sub: 'Solicitudes pendientes', volver: 'c-mas', cuerpo: pend.length ? `<ul class="lista">${pend.map(x => `<li><div class="item-v"><div><b>${esc(x.t.nombre)}</b><div class="tenue">Solicita: ${esc(x.c.rol)}</div></div><span class="muted">${esc(x.c.experiencia || '')}</span>
      <div class="botones"><button class="btn btn-peq" data-act="c-cap" data-t="${x.t.id}" data-i="${x.i}" data-ok="0">Rechazar</button><button class="btn btn-peq btn-ok" data-act="c-cap" data-t="${x.t.id}" data-i="${x.i}" data-ok="1">Aprobar</button></div></div></li>`).join('')}</ul>` : vacia('Todo al día', 'No hay solicitudes de capacitación pendientes.') });
  });
  acciones['c-cap'] = b => { const t = DB.trabajador(b.dataset.t); const i = +b.dataset.i;
    if (b.dataset.ok === '1') { DB.resolverCapacitacion(t, i, true, '', ses().nombre); DB.guardar(); UI.toast('Capacitación aprobada'); return pintar(); }
    UI.modal({ titulo: 'Rechazar capacitación', cuerpo: '<div class="campo"><label for="mr">Motivo</label><input id="mr" placeholder="Sin experiencia acreditada"></div>', acciones: [{ texto: 'Cancelar' }, { texto: 'Rechazar', clase: 'btn-urg', fn: m => { const mot = m.querySelector('#mr').value.trim(); if (!mot) { UI.toast('Indica el motivo', 'urg'); return false; } DB.resolverCapacitacion(t, i, false, mot, ses().nombre); DB.guardar(); UI.toast('Solicitud rechazada'); pintar(); } }] }); };

  /* Eventos (CU-010, consulta) */
  ruta('c-eventos', G, () => marco({ titulo: 'Eventos', volver: 'c-mas', cuerpo: `<ul class="lista">${[...S().eventos].sort((a, b) => a.inicio.localeCompare(b.inicio)).map(e => { const h = DB.hermandad(e.hermandad); const d = UI.diaCorto(e.inicio);
    return `<li><div class="item" style="grid-template-columns:auto 1fr auto"><div class="mini-fecha"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(e.nombre)}</b><div class="tenue">${esc(h ? h.nombre : 'Sin hermandad')}, ${esc(e.franja)}</div></div>${chip(e.situacion)}</div></li>`; }).join('')}</ul>${soloWeb('Los eventos se registran desde el portal web.')}` }));

  /* Administración (CU-030, CU-032, CU-033) */
  ruta('c-usuarios', 'Admin', () => marco({ titulo: 'Usuarios', volver: 'c-mas', cuerpo: `<ul class="lista">${S().usuarios.map(u => `<li><div class="item-v"><div class="fila-v"><div><b>${esc(u.nombre)}</b><div class="tenue">${esc(u.rol)}, ${esc(u.correo)}</div></div>${chip(u.activo ? 'Activa' : 'Inactiva')}</div>
    ${u.id !== ses().id ? `<div class="botones"><button class="btn btn-peq" data-act="c-activar" data-id="${u.id}">${u.activo ? 'Desactivar' : 'Reactivar'}</button></div>` : ''}</div></li>`).join('')}</ul>${soloWeb('Crear cuentas y cambiar roles se hace desde el portal web.')}` }));
  acciones['c-activar'] = b => { const u = S().usuarios.find(x => x.id === b.dataset.id); u.activo = !u.activo; DB.auditar(u.activo ? 'Reactivar cuenta' : 'Desactivar cuenta', u.nombre, 'Correcto', ses().nombre); DB.guardar(); UI.toast(u.activo ? 'Cuenta reactivada' : 'Cuenta desactivada'); pintar(); };
  ruta('c-auditoria', 'Admin', () => marco({ titulo: 'Auditoría', sub: 'Últimas acciones', volver: 'c-mas', cuerpo: `<ul class="lista">${S().auditoria.slice(0, 40).map(r => `<li><div class="item-v"><div class="fila-v"><b>${esc(r.accion)}</b>${chip(r.resultado, r.resultado === 'Correcto' ? 'Correcto' : 'Fallido')}</div><span class="muted">${esc(r.elemento)}</span><span class="tenue">${esc(r.usuario)}, ${fecha(r.fecha)} ${UI.hora(r.fecha)}</span></div></li>`).join('')}</ul>` }));
  ruta('c-sistema', 'Admin', () => marco({ titulo: 'Estado del sistema', volver: 'c-mas', cuerpo: `
    <div class="kpis"><div class="kpi"><b>99,96 %</b><span>Disponibilidad (30 días)</span></div><div class="kpi"><b>194 ms</b><span>Respuesta media</span></div><div class="kpi"><b>37</b><span>Usuarios conectados</span></div><div class="kpi"><b>3</b><span>Errores en 24 h</span></div></div>
    <ul class="lista">${[['Portal web', 'Operativo'], ['App móvil (API)', 'Operativo'], ['Notificaciones push', 'Operativo'], ['Correo electrónico', 'Degradado'], ['Base de datos', 'Operativo'], ['Copia de seguridad', 'Operativo']].map(([n, e]) => `<li><div class="item" style="grid-template-columns:1fr auto"><b>${n}</b>${e === 'Operativo' ? chip('Correcto', e) : chip('Pendiente', e)}</div></li>`).join('')}</ul>` }));

  /* ======================= HERMANDAD ======================= */
  const H = 'Hermandad';
  const miH = () => DB.hermandad(ses().hermandad);
  const misSol = () => S().solicitudes.filter(x => x.hermandad === ses().hermandad);

  ruta('h-inicio', H, () => {
    const sol = misSol().filter(x => x.estado !== 'Finalizado').sort((a, b) => a.fecha.localeCompare(b.fecha));
    const pend = S().presupuestos.filter(p => p.estado === 'Enviado' && DB.solicitud(p.solicitud).hermandad === ses().hermandad);
    const destino = x => { const p = DB.presupuestoDeSolicitud(x.id); const c = p && DB.cuadranteDePresupuesto(p.id); return c && c.estado === 'Publicado' ? `h-cortejo-${c.id}` : p ? `h-presupuesto-${p.id}` : 'h-inicio'; };
    return marco({ titulo: miH().nombre, sub: 'Mis solicitudes', tab: 'h-inicio', cuerpo: `
      ${pend.length ? `<a class="urgente-banner" style="background:var(--morado)" href="#h-presupuesto-${pend[0].id}"><span>Presupuesto pendiente de respuesta</span><b>${esc(pend[0].codigo)}, ${euros(DB.totales(pend[0]).total)}</b><span class="ir" style="color:var(--morado)">Revisar</span></a>` : ''}
      <ul class="lista">${sol.map(x => { const d = UI.diaCorto(x.fecha); return `<li><a href="#${destino(x)}"><div class="mini-fecha"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(x.acto)}</b><div class="tenue">${x.funciones.reduce((n, f) => n + f.cantidad, 0)} personas, ${esc(x.horario)}</div></div>${chip(x.estado)}</a></li>`; }).join('') || '<li class="item">Todavía no hay solicitudes.</li>'}</ul>
      <a class="btn btn-pri btn-bloque" href="#h-solicitar">Solicitar un servicio</a>` });
  });

  /* Cuadrante del cortejo (CU-028, CU-024) */
  ruta('h-cortejo', H, () => {
    const mios = S().cuadrantes.filter(c => c.estado === 'Publicado' && DB.sol(c).hermandad === ses().hermandad);
    const c = mios.find(x => x.id === A.param) || mios[0];
    if (!c) return marco({ titulo: 'Cortejo', tab: 'h-cortejo', cuerpo: vacia('Sin cuadrante publicado', 'Cuando Chamorro publique el cuadrante de un servicio aceptado, veréis aquí el personal asignado.') });
    const so = DB.sol(c); const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
    return marco({ titulo: 'Cuadrante del cortejo', sub: `${UI.fechaLarga(so.fecha)}, ${conf} de ${c.puestos.length} confirmados`, tab: 'h-cortejo', cuerpo: `
      ${mios.length > 1 ? `<div class="botones">${mios.map(o => `<a class="btn btn-peq ${o.id === c.id ? 'btn-pri' : ''}" href="#h-cortejo-${o.id}">${fecha(DB.sol(o).fecha)}</a>`).join('')}</div>` : ''}
      <ul class="lista">${c.puestos.map(a => { const baja = a.acuse === 'Baja'; return `<li><div class="item" style="grid-template-columns:1fr auto"><div><b>${esc(a.puesto)}</b><div class="tenue">${baja ? 'Buscando sustituto' : esc(nombreT(a.trabajador))}, citación ${esc(cit(a.horario))}</div></div>${baja ? chip('Pendiente', 'Sustitución en curso') : chip(a.acuse, a.acuse === 'Pendiente' ? 'Sin confirmar' : a.acuse)}</div></li>`; }).join('')}</ul>
      <button class="btn btn-bloque" data-act="h-incidencia" data-c="${c.id}">Comunicar una incidencia</button>
      <p class="tenue" style="text-align:center">Coordinación de Chamorro: <a class="tel" href="tel:600000000">600 000 000</a></p>` });
  });
  acciones['h-incidencia'] = b => UI.modal({ titulo: 'Comunicar incidencia', cuerpo: `<div class="campo"><label for="it">Tipo</label><select id="it"><option>Retraso en la citación</option><option>Falta de personal</option><option>Uniformidad incorrecta</option><option>Comportamiento</option><option>Otra</option></select></div><div class="campo"><label for="id">Qué ha pasado</label><textarea id="id"></textarea></div>`,
    acciones: [{ texto: 'Cancelar' }, { texto: 'Enviar', clase: 'btn-pri', fn: m => { const d = m.querySelector('#id').value.trim(); if (!d) { UI.toast('Describe la incidencia', 'urg'); return false; } DB.comunicarIncidencia(ses().hermandad, b.dataset.c, m.querySelector('#it').value, d, ses().nombre); DB.guardar(); UI.toast('Incidencia enviada a Chamorro'); } }] });

  /* Presupuestos (CU-023) */
  const misPres = () => S().presupuestos.filter(p => p.estado !== 'Borrador' && DB.solicitud(p.solicitud).hermandad === ses().hermandad);
  ruta('h-presupuestos', H, () => marco({ titulo: 'Presupuestos', tab: 'h-presupuestos', cuerpo: `<ul class="lista">${misPres().sort((a, b) => (a.estado === 'Enviado' ? -1 : 1)).map(p => `<li><a href="#h-presupuesto-${p.id}"><div><b>${esc(DB.solicitud(p.solicitud).acto)}</b><div class="tenue">${esc(p.codigo)}, ${euros(DB.totales(p).total)}</div></div><span></span>${chip(p.estado)}</a></li>`).join('') || '<li class="item">Sin presupuestos.</li>'}</ul>` }));
  ruta('h-presupuesto', H, () => {
    const p = misPres().find(x => x.id === A.param) || misPres()[0]; const so = DB.solicitud(p.solicitud);
    return marco({ titulo: p.codigo, sub: `Versión ${p.version}`, volver: 'h-presupuestos', cuerpo: desglose(p, so, DB.totales(p)) + (p.estado === 'Enviado' ? `<div class="acciones-v"><button class="btn btn-ok btn-bloque" data-act="h-aceptar" data-id="${p.id}">Aceptar presupuesto</button><button class="btn btn-bloque" style="color:var(--burdeos)" data-act="h-rechazar" data-id="${p.id}">Rechazar</button></div>` : '') });
  });
  acciones['h-aceptar'] = b => { const p = DB.presupuesto(b.dataset.id); UI.modal({ titulo: 'Aceptar presupuesto', cuerpo: `<p>Aceptáis ${esc(p.codigo)} por <b>${euros(DB.totales(p).total)}</b>. Chamorro preparará el cuadrante.</p>`, acciones: [{ texto: 'Volver' }, { texto: 'Aceptar', clase: 'btn-ok', fn: () => { DB.responderPresupuesto(p, true, '', ses().nombre); DB.guardar(); UI.toast('Presupuesto aceptado'); pintar(); } }] }); };
  acciones['h-rechazar'] = b => { const p = DB.presupuesto(b.dataset.id); UI.modal({ titulo: 'Rechazar presupuesto', cuerpo: '<div class="campo"><label for="rm">Motivo</label><select id="rm"><option>Importe por encima de lo previsto</option><option>Necesitamos otro número de personas</option><option>Ya no necesitamos el servicio</option><option>Otro motivo</option></select></div>', acciones: [{ texto: 'Volver' }, { texto: 'Rechazar', clase: 'btn-urg', fn: m => { DB.responderPresupuesto(p, false, m.querySelector('#rm').value, ses().nombre); DB.guardar(); UI.toast('Presupuesto rechazado'); pintar(); } }] }); };

  /* Solicitar servicio (CU-027) */
  let borr = null;
  ruta('h-solicitar', H, () => {
    if (!borr) borr = { acto: '', fecha: '', inicio: '14:00', fin: '23:30', funciones: [{ funcion: 'Acólito de cirial', cantidad: 4 }] };
    const libres = DB.FUNCIONES.filter(f => !borr.funciones.some(x => x.funcion === f));
    return marco({ titulo: 'Solicitar un servicio', volver: 'h-inicio', cuerpo: `
      <div class="campo"><label for="sa">Acto</label><input id="sa" value="${esc(borr.acto)}" data-b="acto" placeholder="Estación de penitencia, besamanos…"></div>
      <div class="campo"><label for="sf">Fecha</label><input id="sf" type="date" min="${S().hoy}" value="${borr.fecha}" data-b="fecha"></div>
      <div class="kpis" style="gap:10px"><div class="campo"><label for="si">Citación</label><input id="si" type="time" value="${borr.inicio}" data-b="inicio"></div><div class="campo"><label for="sn">Fin</label><input id="sn" type="time" value="${borr.fin}" data-b="fin"></div></div>
      <p class="seccion-t">Personal que necesitáis</p>
      ${libres.length ? `<div style="display:flex;gap:8px"><select class="input" id="sfn" style="flex:1">${libres.map(f => `<option>${f}</option>`).join('')}</select><button class="btn" data-act="h-anadir">Añadir</button></div>` : ''}
      <ul class="lista">${borr.funciones.map((f, i) => `<li><div class="item" style="grid-template-columns:1fr auto auto"><div><b>${esc(f.funcion)}</b><div class="tenue">${esc(DB.DESCRIPCION_FUNCIONES[f.funcion])}</div></div><span class="contador-app"><button data-act="h-menos" data-i="${i}" aria-label="Uno menos">−</button><span>${f.cantidad}</span><button data-act="h-mas" data-i="${i}" aria-label="Uno más">+</button></span><button class="icono-btn" data-act="h-quitar" data-i="${i}" aria-label="Quitar">✕</button></div></li>`).join('')}</ul>
      <p>Total de personal: <b>${borr.funciones.reduce((n, f) => n + f.cantidad, 0)}</b></p>
      <button class="btn btn-pri btn-bloque" data-act="h-enviar">Enviar solicitud</button>` });
  });
  document.addEventListener('input', e => { if (borr && e.target.dataset && e.target.dataset.b) borr[e.target.dataset.b] = e.target.value; });
  acciones['h-anadir'] = () => { borr.funciones.push({ funcion: document.getElementById('sfn').value, cantidad: 1 }); pintar(); };
  acciones['h-mas'] = b => { borr.funciones[+b.dataset.i].cantidad++; pintar(); };
  acciones['h-menos'] = b => { const f = borr.funciones[+b.dataset.i]; if (f.cantidad > 1) f.cantidad--; pintar(); };
  acciones['h-quitar'] = b => { borr.funciones.splice(+b.dataset.i, 1); pintar(); };
  acciones['h-enviar'] = () => {
    if (!borr.acto.trim()) return UI.toast('Indica el acto', 'urg');
    if (!borr.fecha || borr.fecha < S().hoy) return UI.toast('Elige una fecha futura', 'urg');
    if (!borr.funciones.length) return UI.toast('Añade al menos una función', 'urg');
    DB.solicitarServicio(ses().hermandad, { acto: borr.acto.trim(), fecha: borr.fecha, horario: `${borr.inicio} – ${borr.fin}`, funciones: borr.funciones.map(f => ({ ...f })), lugar: miH().sede }, ses().nombre);
    DB.guardar(); borr = null; UI.toast('Solicitud enviada'); ir('h-inicio');
  };

  /* Más e historial (CU-029) */
  ruta('h-mas', H, () => marco({ titulo: 'Más', sub: `${esc(ses().nombre)}, ${esc(miH().nombre)}`, tab: 'h-mas', cuerpo: `
    <ul class="lista menu-mas"><li><a href="#h-solicitar"><div><b>Solicitar un servicio</b><div class="tenue">Acto, fecha y personal</div></div><span class="tenue">›</span></a></li><li><a href="#h-historial"><div><b>Historial de servicios</b><div class="tenue">Servicios contratados</div></div><span class="tenue">›</span></a></li></ul>
    <button class="btn btn-bloque" data-act="salir">Cerrar sesión</button>` }));
  ruta('h-historial', H, () => {
    const lista = misSol().filter(x => { const p = DB.presupuestoDeSolicitud(x.id); return x.estado === 'Finalizado' || (p && p.estado === 'Aceptado'); }).sort((a, b) => b.fecha.localeCompare(a.fecha));
    return marco({ titulo: 'Historial', volver: 'h-mas', cuerpo: `<ul class="lista">${lista.map(x => { const p = DB.presupuestoDeSolicitud(x.id); return `<li><div class="item" style="grid-template-columns:1fr auto"><div><b>${esc(x.acto)}</b><div class="tenue">${fecha(x.fecha)}${p && p.estado === 'Aceptado' ? `, ${euros(DB.totales(p).total)}` : ''}</div></div>${chip(x.estado)}</div></li>`; }).join('')}</ul>` });
  });
})();
