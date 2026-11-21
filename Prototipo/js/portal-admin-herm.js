/* Portal web — administrador y hermandades */
(function () {
  const { esc, chip, fecha, euros } = UI;
  const S = () => DB.s;
  const RA = ['Administrador'];
  const RH = ['Hermandad'];

  /* ================= Usuarios y permisos (MOCK-022, CU-030) ================= */
  let filtroU = { q: '', rol: '' };
  P.ruta('admin-usuarios', {
    roles: RA, nav: 'admin-usuarios', titulo: 'Usuarios y permisos',
    render() {
      const us = S().usuarios.filter(u => (!filtroU.rol || u.rol === filtroU.rol) && (!filtroU.q || (u.nombre + u.correo).toLowerCase().includes(filtroU.q.toLowerCase())));
      return P.cabecera({ titulo: 'Usuarios y permisos', sub: 'Cuentas de acceso y su rol. Cada cambio queda en el registro de auditoría.', acciones: `<button class="btn btn-pri" data-act="crear-usuario">+ Crear usuario</button>` }) + `<div class="cuerpo">
        <div class="filtros"><input class="input buscar" type="search" placeholder="Buscar por nombre o correo" value="${esc(filtroU.q)}" data-cambio="filtro-u" data-k="q" aria-label="Buscar">
          <select data-cambio="filtro-u" data-k="rol" aria-label="Rol"><option value="">Todos los roles</option>${['Administrador', 'Coordinador', 'Hermandad', 'Trabajador'].map(r => `<option ${filtroU.rol === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
        <section class="bloque"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr></thead><tbody>
        ${us.map(u => `<tr><td><b>${esc(u.nombre)}</b>${u.hermandad ? `<div class="tenue">${esc((DB.hermandad(u.hermandad) || {}).nombre || '')}</div>` : ''}</td><td>${esc(u.correo)}</td><td>${esc(u.rol)}</td><td>${chip(u.activo ? 'Activa' : 'Inactiva')}</td>
          <td class="acciones-celda"><button class="btn btn-peq" data-act="editar-usuario" data-id="${u.id}">Editar</button> ${u.id === P.sesion().id ? '' : `<button class="btn btn-peq ${u.activo ? 'btn-txt' : ''}" data-act="activar-usuario" data-id="${u.id}">${u.activo ? 'Desactivar' : 'Reactivar'}</button>`}</td></tr>`).join('')}
        </tbody></table></div></section></div>`;
    }
  });
  P.accion('filtro-u', el => { filtroU[el.dataset.k] = el.value; P.pintar(); });
  const formUsuario = (u = {}) => `<div class="form-rejilla">
    <div class="campo ancho"><label for="fu1">Nombre</label><input id="fu1" name="nombre" value="${esc(u.nombre || '')}"></div>
    <div class="campo ancho"><label for="fu2">Correo</label><input id="fu2" name="correo" type="email" value="${esc(u.correo || '')}"></div>
    <div class="campo"><label for="fu3">Rol</label><select id="fu3" name="rol">${['Coordinador', 'Administrador', 'Hermandad', 'Trabajador'].map(r => `<option ${u.rol === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
    <div class="campo"><label for="fu4">Hermandad (si aplica)</label><select id="fu4" name="hermandad"><option value="">—</option>${S().hermandades.map(h => `<option value="${h.id}" ${u.hermandad === h.id ? 'selected' : ''}>${esc(h.nombre)}</option>`).join('')}</select></div></div>`;
  const leerU = m => { const g = n => m.querySelector(`[name=${n}]`).value.trim(); return { nombre: g('nombre'), correo: g('correo'), rol: g('rol'), hermandad: g('hermandad') }; };
  P.accion('crear-usuario', () => UI.modal({ titulo: 'Crear usuario', cuerpo: formUsuario(), acciones: [{ texto: 'Cancelar' }, { texto: 'Crear usuario', clase: 'btn-pri', fn: m => {
    const d = leerU(m); if (!d.nombre || !/^\S+@\S+\.\S+$/.test(d.correo)) { UI.toast('Nombre y correo válido son obligatorios', 'urg'); return false; }
    if (S().usuarios.some(u => u.correo === d.correo)) { UI.toast('Ya existe una cuenta con ese correo', 'urg'); return false; }
    S().usuarios.push({ id: DB.id('u'), ...d, activo: true, clave: 'demo' }); DB.auditar('Crear cuenta', `${d.nombre} (${d.rol})`); DB.guardar(); UI.toast('Usuario creado. Recibirá un correo para elegir contraseña.'); P.pintar(); } }] }));
  P.accion('editar-usuario', b => { const u = S().usuarios.find(x => x.id === b.dataset.id); UI.modal({ titulo: `Editar ${u.nombre}`, cuerpo: formUsuario(u), acciones: [{ texto: 'Cancelar' }, { texto: 'Guardar cambios', clase: 'btn-pri', fn: m => {
    const d = leerU(m); const antes = u.rol; Object.assign(u, d); DB.auditar(antes !== d.rol ? 'Cambiar rol' : 'Editar cuenta', antes !== d.rol ? `${u.nombre}: ${antes} a ${d.rol}` : u.nombre); DB.guardar(); UI.toast('Cambios guardados'); P.pintar(); } }] }); });
  P.accion('activar-usuario', b => { const u = S().usuarios.find(x => x.id === b.dataset.id); u.activo = !u.activo; DB.auditar(u.activo ? 'Reactivar cuenta' : 'Desactivar cuenta', u.nombre); DB.guardar(); UI.toast(u.activo ? 'Cuenta reactivada' : 'Cuenta desactivada'); P.pintar(); });

  /* ================= Registro de auditoría (CU-032) — pantalla nueva ================= */
  let filtroA = { q: '', accion: '', resultado: '', desde: '', hasta: '' };
  P.ruta('admin-auditoria', {
    roles: RA, nav: 'admin-auditoria', titulo: 'Registro de auditoría',
    render() {
      const reg = S().auditoria;
      const acciones = [...new Set(reg.map(r => r.accion))].sort();
      const lista = reg.filter(r => (!filtroA.q || (r.usuario + r.elemento).toLowerCase().includes(filtroA.q.toLowerCase())) && (!filtroA.accion || r.accion === filtroA.accion)
        && (!filtroA.resultado || (filtroA.resultado === 'ok' ? r.resultado === 'Correcto' : r.resultado !== 'Correcto')) && (!filtroA.desde || r.fecha.slice(0, 10) >= filtroA.desde) && (!filtroA.hasta || r.fecha.slice(0, 10) <= filtroA.hasta));
      return P.cabecera({ titulo: 'Registro de auditoría', sub: 'Acciones realizadas en el sistema: quién, cuándo, sobre qué y con qué resultado.', acciones: `<button class="btn" data-act="exportar-auditoria">Exportar CSV</button>` }) + `<div class="cuerpo">
        <div class="filtros"><input class="input buscar" type="search" placeholder="Usuario o elemento" value="${esc(filtroA.q)}" data-cambio="filtro-a" data-k="q" aria-label="Buscar">
          <select data-cambio="filtro-a" data-k="accion" aria-label="Acción"><option value="">Todas las acciones</option>${acciones.map(a => `<option ${filtroA.accion === a ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select>
          <select data-cambio="filtro-a" data-k="resultado" aria-label="Resultado"><option value="">Cualquier resultado</option><option value="ok" ${filtroA.resultado === 'ok' ? 'selected' : ''}>Correcto</option><option value="ko" ${filtroA.resultado === 'ko' ? 'selected' : ''}>Fallido</option></select>
          <label class="tenue">Desde <input class="input" type="date" value="${filtroA.desde}" data-cambio="filtro-a" data-k="desde"></label><label class="tenue">Hasta <input class="input" type="date" value="${filtroA.hasta}" data-cambio="filtro-a" data-k="hasta"></label></div>
        <section class="bloque"><div class="bloque-cab"><h2>${lista.length} registro${lista.length !== 1 ? 's' : ''}</h2></div><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Acción</th><th>Elemento afectado</th><th>Resultado</th></tr></thead><tbody>
        ${lista.slice(0, 200).map(r => `<tr class="${r.resultado !== 'Correcto' ? 'fila-urgente' : ''}"><td class="num" style="white-space:nowrap">${fecha(r.fecha)} ${UI.hora(r.fecha)}</td><td>${esc(r.usuario)}</td><td>${esc(r.accion)}</td><td>${esc(r.elemento)}</td><td>${chip(r.resultado)}</td></tr>`).join('') || `<tr><td colspan="5">${P.vacia('Sin registros', 'Ningún registro coincide con los filtros.')}</td></tr>`}
        </tbody></table></div></section></div>`;
    },
    despues() { if (P.entrada) { DB.auditar('Consultar registro de auditoría', 'Auditoría'); DB.guardar(); } }
  });
  P.accion('filtro-a', el => { filtroA[el.dataset.k] = el.value; P.pintar(); });
  P.accion('exportar-auditoria', () => { const csv = ['Fecha;Usuario;Acción;Elemento;Resultado', ...S().auditoria.map(r => [r.fecha, r.usuario, r.accion, r.elemento, r.resultado].map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))].join('\n'); P.descargar('auditoria.csv', csv); DB.auditar('Exportar auditoría', 'auditoria.csv'); DB.guardar(); UI.toast('Registro exportado'); });

  /* ================= Estado del sistema (CU-033) — pantalla nueva ================= */
  P.ruta('admin-sistema', {
    roles: RA, nav: 'admin-sistema', titulo: 'Estado del sistema',
    render() {
      const peticiones = [12, 8, 5, 3, 2, 2, 4, 15, 38, 52, 61, 58, 64, 70, 55, 49, 66, 88, 112, 96, 74, 51, 33, 20];
      const max = Math.max(...peticiones);
      const servicios = [['Portal web', 'Operativo', 'Respuesta media 180 ms'], ['App móvil (API)', 'Operativo', 'Respuesta media 210 ms'], ['Notificaciones push', 'Operativo', '1.284 enviadas hoy'], ['Correo electrónico', 'Degradado', 'Cola de 14 mensajes, reintentando'], ['Base de datos', 'Operativo', 'Uso de disco 38 %'], ['Copia de seguridad', 'Operativo', 'Última completa hoy a las 04:00']];
      const est = e => e === 'Operativo' ? chip('Correcto', 'Operativo') : chip('Pendiente', e);
      return P.cabecera({ titulo: 'Estado del sistema', sub: 'Disponibilidad y rendimiento en las últimas 24 horas.', acciones: `<button class="btn" data-act="refrescar-sistema">Actualizar</button>` }) + `<div class="cuerpo">
        <section class="bloque metricas"><div><div class="valor">99,96 %</div><div class="muted">Disponibilidad (30 días)</div><div class="barra" style="margin-top:8px"><i style="width:99.96%"></i></div></div>
          <div><div class="valor">194 ms</div><div class="muted">Tiempo de respuesta medio</div><div class="tenue">Objetivo: menos de 2 s</div></div>
          <div><div class="valor">37</div><div class="muted">Usuarios conectados</div><div class="tenue">Pico hoy: 112 a las 18:00</div></div>
          <div><div class="valor" style="color:var(--ambar)">3</div><div class="muted">Errores en 24 h</div><div class="tenue">0,02 % de las peticiones</div></div></section>
        <div class="rejilla-2">
          <section class="bloque"><div class="bloque-cab"><h2>Peticiones por hora</h2><span class="tenue">Hoy</span></div><div class="bloque-cuerpo">
            <div class="grafico" role="img" aria-label="Peticiones por hora, con un pico de ${max} a las 18:00">${peticiones.map((v, i) => `<i class="${v === max ? 'pico' : ''}" style="height:${v / max * 100}%" title="${i}:00, ${v} peticiones"></i>`).join('')}</div>
            <div style="display:flex;justify-content:space-between" class="tenue"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div></div></section>
          <section class="bloque"><div class="bloque-cab"><h2>Servicios</h2></div><table class="tabla"><tbody>${servicios.map(s => `<tr><td><b>${s[0]}</b><div class="tenue">${s[2]}</div></td><td class="der">${est(s[1])}</td></tr>`).join('')}</tbody></table></section>
        </div>
        <section class="bloque"><div class="bloque-cab"><h2>Alertas recientes</h2></div><table class="tabla"><tbody>
          <tr><td class="num">${fecha(S().hoy)} 11:42</td><td>Cola de correo por encima de 10 mensajes</td><td>${chip('Pendiente', 'Abierta')}</td></tr>
          <tr><td class="num">14/03/2027 21:05</td><td>Tiempo de respuesta por encima de 1 s durante 3 minutos</td><td>${chip('Resuelta')}</td></tr></tbody></table></section></div>`;
    },
    despues() { if (P.entrada) { DB.auditar('Consultar estado del sistema', 'Monitorización'); DB.guardar(); } }
  });
  P.accion('refrescar-sistema', () => { UI.toast('Datos actualizados'); P.pintar(); });

  /* ================= Hermandad: panel (MOCK-019, CU-028) ================= */
  const miH = () => DB.hermandad(P.sesion().hermandad);
  const misSol = () => S().solicitudes.filter(x => x.hermandad === P.sesion().hermandad);
  P.ruta('herm-panel', {
    roles: RH, nav: 'herm-panel', titulo: 'Mis solicitudes',
    render() {
      const h = miH();
      const sol = misSol().filter(x => x.estado !== 'Finalizado').sort((a, b) => a.fecha.localeCompare(b.fecha));
      const accion = x => { const p = DB.presupuestoDeSolicitud(x.id); const c = p && DB.cuadranteDePresupuesto(p.id);
        if (x.estado === 'Presupuesto enviado' && p) return `<a class="btn btn-pri btn-peq" href="#herm-presupuesto-${p.id}">Revisar presupuesto</a>`;
        if (c && c.estado === 'Publicado') return `<a class="btn btn-peq" href="#herm-cuadrante-${c.id}">Ver cuadrante</a>`;
        if (p) return `<a class="btn btn-peq" href="#herm-presupuesto-${p.id}">Ver presupuesto</a>`;
        return `<span class="tenue">Esperando presupuesto</span>`; };
      const pendientes = sol.filter(x => x.estado === 'Presupuesto enviado').length;
      return P.cabecera({ titulo: h.nombre, sub: pendientes ? `Tenéis ${pendientes} presupuesto${pendientes > 1 ? 's' : ''} pendiente${pendientes > 1 ? 's' : ''} de respuesta.` : 'Estado de vuestras solicitudes de servicio.', acciones: `<a class="btn" href="#herm-historial">Historial</a><a class="btn btn-pri" href="#herm-solicitud">+ Solicitar un servicio</a>` }) + `<div class="cuerpo">
        <section class="bloque">${sol.length ? `<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Acto</th><th>Fecha</th><th>Personal</th><th>Estado</th><th></th></tr></thead><tbody>
          ${sol.map(x => `<tr><td><b>${esc(x.acto)}</b><div class="tenue">Solicitado el ${fecha(x.creada)}</div></td><td class="num">${fecha(x.fecha)}<div class="tenue">${esc(x.horario)}</div></td><td>${x.funciones.reduce((n, f) => n + f.cantidad, 0)} personas</td><td>${chip(x.estado)}</td><td class="acciones-celda">${accion(x)}</td></tr>`).join('')}
          </tbody></table></div>` : P.vacia('Todavía no hay solicitudes', 'Solicitad vuestro primer servicio indicando el acto, la fecha y el personal que necesitáis.', '<a class="btn btn-pri" href="#herm-solicitud">Solicitar un servicio</a>')}</section></div>`;
    }
  });

  /* ================= Hermandad: solicitar servicio (CU-027) — pantalla nueva ================= */
  let borrador = null;
  P.ruta('herm-solicitud', {
    roles: RH, nav: 'herm-solicitud', titulo: 'Solicitar un servicio',
    render() {
      const h = miH();
      if (!borrador || borrador.h !== h.id) borrador = { h: h.id, funciones: [{ funcion: 'Acólito de cirial', cantidad: 4 }, { funcion: 'Pertiguero', cantidad: 1 }] };
      const total = borrador.funciones.reduce((n, f) => n + f.cantidad, 0);
      const libres = DB.FUNCIONES.filter(f => !borrador.funciones.some(x => x.funcion === f));
      return P.cabecera({ titulo: 'Solicitar un servicio', miga: '<a href="#herm-panel">Mis solicitudes</a>', sub: 'Chamorro os enviará un presupuesto en un plazo máximo de 72 horas.' }) + `<div class="cuerpo">
        <form data-form="solicitud" novalidate><div class="rejilla-2">
        <section class="bloque"><div class="bloque-cab"><h2>Datos del acto</h2></div><div class="bloque-cuerpo form-rejilla">
          <div class="campo ancho"><label for="so1">Acto</label><input id="so1" name="acto" placeholder="Estación de penitencia, función principal, besamanos…"></div>
          <div class="campo"><label for="so2">Fecha</label><input id="so2" name="fecha" type="date" min="${S().hoy}"></div>
          <div class="campo"><label for="so5">Clase de acto</label><select id="so5" name="clase"><option>Salida procesional</option><option>Acto de culto</option><option>Otro acto</option></select></div>
          <div class="campo"><label for="so3">Hora de citación</label><input id="so3" name="inicio" type="time" value="14:00"></div>
          <div class="campo"><label for="so4">Hora estimada de fin</label><input id="so4" name="fin" type="time" value="23:30"></div>
          <div class="campo ancho"><label for="so6">Lugar de citación</label><input id="so6" name="lugar" value="${esc(h.sede)}"></div>
          <div class="campo ancho"><label for="so7">Observaciones</label><textarea id="so7" name="obs" placeholder="Uniformidad especial, recorrido, acceso al templo…"></textarea></div>
        </div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Personal que necesitáis</h2></div><div class="bloque-cuerpo" style="display:flex;flex-direction:column;gap:14px">
          ${libres.length ? `<div style="display:flex;gap:8px"><select class="input" id="nueva-f" aria-label="Función">${libres.map(f => `<option title="${esc(DB.DESCRIPCION_FUNCIONES[f])}">${f}</option>`).join('')}</select><button type="button" class="btn" data-act="sol-anadir">+ Añadir</button></div>` : ''}
          ${borrador.funciones.length ? `<table class="tabla"><tbody>${borrador.funciones.map((f, i) => `<tr><td><b>${esc(f.funcion)}</b><div class="tenue">${esc(DB.DESCRIPCION_FUNCIONES[f.funcion] || '')}</div></td><td class="der"><span class="contador"><button type="button" data-act="sol-menos" data-i="${i}" aria-label="Uno menos">−</button><span aria-live="polite">${f.cantidad}</span><button type="button" data-act="sol-mas" data-i="${i}" aria-label="Uno más">+</button></span></td><td class="der"><button type="button" class="icono-btn" data-act="sol-quitar" data-i="${i}" aria-label="Quitar ${esc(f.funcion)}">✕</button></td></tr>`).join('')}</tbody></table>`
            : '<p class="muted">Añade al menos una función.</p>'}
          <p style="font-size:16px">Total de personal solicitado: <b class="num">${total}</b></p>
          <button class="btn btn-pri" type="submit" style="padding:11px">Enviar solicitud</button>
        </div></section></div></form></div>`;
    }
  });
  const conservar = () => { const f = document.querySelector('[data-form="solicitud"]'); if (f) borrador.campos = P.leerForm(f); };
  const restaurar = () => { const f = document.querySelector('[data-form="solicitud"]'); if (f && borrador.campos) Object.entries(borrador.campos).forEach(([k, v]) => { if (f[k]) f[k].value = v; }); };
  const repintarSol = () => { conservar(); P.pintar(); restaurar(); };
  P.accion('sol-anadir', () => { borrador.funciones.push({ funcion: document.getElementById('nueva-f').value, cantidad: 1 }); repintarSol(); });
  P.accion('sol-mas', b => { borrador.funciones[+b.dataset.i].cantidad++; repintarSol(); });
  P.accion('sol-menos', b => { const f = borrador.funciones[+b.dataset.i]; if (f.cantidad > 1) f.cantidad--; repintarSol(); });
  P.accion('sol-quitar', b => { borrador.funciones.splice(+b.dataset.i, 1); repintarSol(); });
  P.formulario('solicitud', (f, d) => {
    let ok = true;
    if (!d.acto.trim()) { P.errorCampo(f, 'acto', 'Indica el acto.'); ok = false; }
    if (!d.fecha) { P.errorCampo(f, 'fecha', 'Elige la fecha.'); ok = false; }
    else if (d.fecha < S().hoy) { P.errorCampo(f, 'fecha', 'La fecha ya ha pasado.'); ok = false; }
    if (!d.inicio) { P.errorCampo(f, 'inicio', 'Indica la hora de citación.'); ok = false; }
    if (!borrador.funciones.length) { UI.toast('Añade al menos una función', 'urg'); ok = false; }
    if (!ok) return;
    const so = { id: DB.id('s'), hermandad: P.sesion().hermandad, evento: '', acto: d.acto.trim(), fecha: d.fecha, horario: `${d.inicio} – ${d.fin}`, funciones: borrador.funciones.map(x => ({ ...x })), estado: 'Pendiente de presupuesto', creada: S().hoy, lugar: d.lugar, obs: d.obs };
    S().solicitudes.push(so); DB.auditar('Solicitar servicio', `${miH().nombre}: ${so.acto}`); DB.guardar(); borrador = null;
    UI.toast('Solicitud enviada. Recibiréis el presupuesto en el portal.'); P.ir('herm-panel');
  });

  /* ================= Hermandad: revisar presupuesto (MOCK-020, CU-023) ================= */
  P.ruta('herm-presupuesto', {
    roles: RH, nav: 'herm-presupuesto', titulo: 'Presupuestos',
    render() {
      const mios = S().presupuestos.filter(p => DB.solicitud(p.solicitud).hermandad === P.sesion().hermandad && p.estado !== 'Borrador').sort((a, b) => (a.estado === 'Enviado' ? -1 : 1) - (b.estado === 'Enviado' ? -1 : 1) || b.enviado.localeCompare(a.enviado));
      const p = (DB.presupuesto(P.param) && mios.find(x => x.id === P.param)) || mios[0];
      if (!p) return P.cabecera({ titulo: 'Presupuestos' }) + `<div class="cuerpo">${P.vacia('Sin presupuestos', 'Cuando Chamorro responda a una solicitud, el presupuesto aparecerá aquí.')}</div>`;
      const so = DB.solicitud(p.solicitud); const t = DB.totales(p);
      return P.cabecera({ titulo: `Presupuesto ${p.codigo}`, sub: `${esc(so.acto)}, ${UI.fechaLarga(so.fecha)}.` }) + `<div class="cuerpo">
        ${mios.length > 1 ? `<div class="filtros"><select data-cambio="elegir-hp" aria-label="Presupuesto">${mios.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(x.codigo)}, ${esc(DB.solicitud(x.solicitud).acto)} (${x.estado.toLowerCase()})</option>`).join('')}</select></div>` : ''}
        <section class="bloque"><div class="bloque-cab"><div><h2>Desglose</h2><span class="tenue">Versión ${p.version}, recibido el ${fecha(p.enviado)}</span></div>${chip(p.estado)}</div>
          <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Puesto</th><th class="der">Personas</th><th class="der">Horas</th><th class="der">Tarifa</th><th class="der">Importe</th></tr></thead><tbody>
          ${p.lineas.map(l => `<tr><td>${esc(l.funcion)}</td><td class="der num">${l.cantidad}</td><td class="der num">${l.horas}</td><td class="der num">${euros(l.tarifa)}/h</td><td class="der num">${euros(l.cantidad * l.horas * l.tarifa)}</td></tr>`).join('')}</tbody></table></div>
          <div class="bloque-cuerpo"><div class="totales"><span>Base imponible</span><span class="der num">${euros(t.base)}</span><span>IVA (${p.iva}%)</span><span class="der num">${euros(t.iva)}</span><span class="t">Total</span><span class="t der num">${euros(t.total)}</span></div></div>
          <div class="bloque-pie">${p.motivo ? `<span class="resumen">Motivo del rechazo: ${esc(p.motivo)}</span>` : ''}<button class="btn" data-act="pdf-hp" data-id="${p.id}">Descargar PDF</button>
            ${p.estado === 'Enviado' ? `<button class="btn" data-act="rechazar-hp" data-id="${p.id}" style="color:var(--burdeos)">Rechazar</button><button class="btn btn-ok" data-act="aceptar-hp" data-id="${p.id}">Aceptar presupuesto</button>` : ''}</div></section></div>`;
    }
  });
  P.accion('elegir-hp', el => P.ir('herm-presupuesto-' + el.value));
  P.accion('pdf-hp', b => { const p = DB.presupuesto(b.dataset.id); UI.modal({ titulo: p.codigo, ancho: 680, cuerpo: P.presupuestoDoc(p), acciones: [{ texto: 'Cerrar' }, { texto: 'Descargar', clase: 'btn-pri', fn: () => { P.descargar(`${p.codigo}.html`, `<!DOCTYPE html><meta charset="utf-8"><title>${p.codigo}</title><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/portal.css"><body style="padding:30px">${P.presupuestoDoc(p)}`, 'text/html'); UI.toast('Presupuesto descargado'); } }] }); });
  P.accion('aceptar-hp', b => { const p = DB.presupuesto(b.dataset.id); const so = DB.solicitud(p.solicitud);
    UI.modal({ titulo: 'Aceptar presupuesto', cuerpo: `<p>Al aceptar <b>${esc(p.codigo)}</b> por <b>${euros(DB.totales(p).total)}</b>, Chamorro preparará el cuadrante de personal para vuestro acto.</p>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Aceptar presupuesto', clase: 'btn-ok', fn: () => { p.estado = 'Aceptado'; p.respuesta = S().hoy; so.estado = 'Presupuesto aceptado'; const ev = S().eventos.find(e => e.id === so.evento); if (ev) ev.situacion = 'Con servicio';
        DB.auditar('Aceptar presupuesto', p.codigo); DB.guardar(); UI.toast('Presupuesto aceptado'); P.pintar(); } }] }); });
  P.accion('rechazar-hp', b => { const p = DB.presupuesto(b.dataset.id); const so = DB.solicitud(p.solicitud);
    UI.modal({ titulo: 'Rechazar presupuesto', cuerpo: `<p>Contadnos el motivo para que Chamorro pueda enviaros una versión ajustada.</p><div class="campo"><label for="rm">Motivo</label><select id="rm"><option>Importe por encima de lo previsto</option><option>Necesitamos otro número de personas</option><option>Ya no necesitamos el servicio</option><option>Otro motivo</option></select></div>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Rechazar', clase: 'btn-urg', fn: m => { p.estado = 'Rechazado'; p.respuesta = S().hoy; p.motivo = m.querySelector('#rm').value; so.estado = 'Pendiente de presupuesto';
        DB.auditar('Rechazar presupuesto', p.codigo); DB.guardar(); UI.toast('Presupuesto rechazado'); P.pintar(); } }] }); });

  /* ================= Hermandad: cuadrante del cortejo (MOCK-021, CU-024) ================= */
  P.ruta('herm-cuadrante', {
    roles: RH, nav: 'herm-cuadrante', titulo: 'Cuadrante del cortejo',
    render() {
      const mios = S().cuadrantes.filter(c => c.estado === 'Publicado' && DB.solicitud(DB.presupuesto(c.presupuesto).solicitud).hermandad === P.sesion().hermandad);
      const c = mios.find(x => x.id === P.param) || mios[0];
      if (!c) return P.cabecera({ titulo: 'Cuadrante del cortejo' }) + `<div class="cuerpo">${P.vacia('Sin cuadrante publicado', 'Cuando Chamorro publique el cuadrante de un servicio aceptado, veréis aquí el personal asignado.')}</div>`;
      const so = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud); const h = DB.hermandad(so.hermandad);
      const inc = S().incidencias.filter(i => i.hermandad === h.id);
      const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
      return P.cabecera({ titulo: 'Cuadrante del cortejo', sub: `${esc(so.acto)}, ${UI.fechaLarga(so.fecha)}. Citación ${esc(so.horario)} en ${esc(h.sede)}.`,
        acciones: `<button class="btn" data-act="exportar-cuadrante-h" data-id="${c.id}">Descargar PDF</button><button class="btn btn-pri" data-act="incidencia" data-c="${c.id}">Comunicar incidencia</button>` }) + `<div class="cuerpo">
        <section class="bloque"><div class="bloque-cab"><h2>${conf} de ${c.puestos.length} han confirmado</h2></div><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Puesto</th><th>Persona</th><th>Citación</th><th>Confirmación</th></tr></thead><tbody>
          ${c.puestos.map(a => { const t = DB.trabajador(a.trabajador); const baja = a.acuse === 'Baja'; return `<tr><td><b>${esc(a.puesto)}</b></td><td>${baja ? '<span class="muted">Buscando sustituto</span>' : esc(t ? t.nombre : 'Por asignar')}</td><td class="num">${esc(a.horario.split(' – ')[0])}</td><td>${baja ? chip('Pendiente', 'Sustitución en curso') : chip(a.acuse)}</td></tr>`; }).join('')}
          </tbody></table></div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Incidencias comunicadas</h2></div>${inc.length ? `<table class="tabla"><tbody>${inc.map(i => `<tr><td class="num">${fecha(i.fecha)}</td><td><b>${esc(i.tipo)}</b><div class="tenue">${esc(i.descripcion)}</div></td><td>${chip(i.estado)}</td></tr>`).join('')}</tbody></table>` : P.vacia('Sin incidencias', 'Si algo no va según lo contratado, comunicadlo desde aquí.')}</section></div>`;
    }
  });
  P.accion('exportar-cuadrante-h', b => { const c = DB.cuadrante(b.dataset.id); UI.modal({ titulo: 'Cuadrante del cortejo', ancho: 700, cuerpo: P.cuadranteDoc(c, false), acciones: [{ texto: 'Cerrar' }, { texto: 'Descargar', clase: 'btn-pri', fn: () => { P.descargar('cuadrante-cortejo.html', `<!DOCTYPE html><meta charset="utf-8"><title>Cuadrante</title><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/portal.css"><body style="padding:30px">${P.cuadranteDoc(c, false)}`, 'text/html'); UI.toast('Cuadrante descargado'); } }] }); });
  P.accion('incidencia', b => {
    const c = DB.cuadrante(b.dataset.c);
    UI.modal({ titulo: 'Comunicar incidencia', cuerpo: `<div class="campo"><label for="it">Tipo</label><select id="it"><option>Retraso en la citación</option><option>Falta de personal</option><option>Uniformidad incorrecta</option><option>Comportamiento</option><option>Otra</option></select></div>
      <div class="campo"><label for="id">Qué ha pasado</label><textarea id="id" placeholder="Describe la incidencia con el puesto y la hora"></textarea></div>`,
      acciones: [{ texto: 'Cancelar' }, { texto: 'Enviar incidencia', clase: 'btn-pri', fn: m => { const d = m.querySelector('#id').value.trim(); if (!d) { UI.toast('Describe la incidencia', 'urg'); return false; }
        S().incidencias.unshift({ id: DB.id('i'), hermandad: P.sesion().hermandad, cuadrante: c.id, tipo: m.querySelector('#it').value, descripcion: d, fecha: S().hoy, estado: 'En revisión' });
        DB.auditar('Registrar incidencia', `${miH().nombre}: ${m.querySelector('#it').value}`); DB.guardar(); UI.toast('Incidencia enviada a Chamorro'); P.pintar(); } }] });
  });

  /* ================= Hermandad: historial (CU-029) — pantalla nueva ================= */
  let anio = '';
  P.ruta('herm-historial', {
    roles: RH, nav: 'herm-historial', titulo: 'Historial de servicios',
    render() {
      const todos = misSol().filter(x => { const p = DB.presupuestoDeSolicitud(x.id); return x.estado === 'Finalizado' || (p && p.estado === 'Aceptado'); }).sort((a, b) => b.fecha.localeCompare(a.fecha));
      const anios = [...new Set(todos.map(x => x.fecha.slice(0, 4)))];
      const lista = todos.filter(x => !anio || x.fecha.startsWith(anio));
      const gasto = lista.reduce((n, x) => { const p = DB.presupuestoDeSolicitud(x.id); return n + (p && p.estado === 'Aceptado' ? DB.totales(p).total : 0); }, 0);
      return P.cabecera({ titulo: 'Historial de servicios', miga: '<a href="#herm-panel">Mis solicitudes</a>', sub: 'Servicios contratados con Chamorro Servicios Cofrades.' }) + `<div class="cuerpo">
        <div class="filtros"><select data-cambio="anio" aria-label="Año"><option value="">Todos los años</option>${anios.map(a => `<option ${anio === a ? 'selected' : ''}>${a}</option>`).join('')}</select><span class="tenue">Importe contratado: <b class="num">${euros(gasto)}</b></span></div>
        <section class="bloque"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Fecha</th><th>Acto</th><th>Personal</th><th class="der">Importe</th><th>Estado</th><th></th></tr></thead><tbody>
          ${lista.map(x => { const p = DB.presupuestoDeSolicitud(x.id); return `<tr><td class="num">${fecha(x.fecha)}</td><td><b>${esc(x.acto)}</b></td><td>${x.funciones.map(f => `${f.cantidad} ${esc(f.funcion.toLowerCase())}`).join(', ')}</td><td class="der num">${p && p.estado === 'Aceptado' ? euros(DB.totales(p).total) : '—'}</td><td>${chip(x.estado)}</td><td class="acciones-celda">${p ? `<a class="btn btn-txt btn-peq" href="#herm-presupuesto-${p.id}">Presupuesto</a>` : ''}</td></tr>`; }).join('') || `<tr><td colspan="6">${P.vacia('Sin servicios', 'Aún no hay servicios contratados.')}</td></tr>`}
          </tbody></table></div></section></div>`;
    }
  });
  P.accion('anio', el => { anio = el.value; P.pintar(); });
})();
