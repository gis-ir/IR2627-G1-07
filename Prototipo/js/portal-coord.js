/* Portal web — pantallas del coordinador */
(function () {
  const { esc, chip, fecha, euros } = UI;
  const S = () => DB.s;
  const R = ['Coordinador', 'Administrador'];
  const nombreT = id => (DB.trabajador(id) || {}).nombre || '';
  const servicioTexto = c => { const p = DB.presupuesto(c.presupuesto); const s = DB.solicitud(p.solicitud); return `${DB.hermandad(s.hermandad).nombre}, ${s.acto.replace('Estación de penitencia, ', '')} ${fecha(s.fecha)}`; };
  const solDe = c => DB.solicitud(DB.presupuesto(c.presupuesto).solicitud);
  const diasHasta = iso => Math.round((new Date(iso + 'T12:00') - new Date(S().hoy + 'T12:00')) / 864e5);

  /* ================= Panel principal (MOCK-007) ================= */
  P.ruta('coord-panel', {
    roles: R, nav: 'coord-panel', titulo: 'Panel',
    render() {
      const s = S();
      const semana = s.solicitudes.filter(x => { const d = diasHasta(x.fecha); return d >= 0 && d <= 7 && x.estado !== 'Finalizado'; }).length;
      const bajas = s.bajas.filter(b => b.estado === 'Abierta').length;
      const acuses = s.cuadrantes.filter(c => c.estado === 'Publicado').reduce((n, c) => n + c.puestos.filter(a => a.acuse === 'Pendiente').length, 0);
      const presup = s.presupuestos.filter(p => p.estado === 'Enviado').length;
      const capac = s.trabajadores.reduce((n, t) => n + t.capacitaciones.filter(c => c.estado === 'Pendiente').length, 0);
      const faltan = diasHasta('2027-03-21');
      const proximos = s.eventos.filter(e => diasHasta(e.fin) >= 0).sort((a, b) => a.inicio.localeCompare(b.inicio)).slice(0, 6);
      return P.cabecera({
        titulo: `Buenos días, ${P.sesion().nombre.split(' ')[0]}`,
        sub: `Semana Santa 2027. Faltan ${faltan} días para el Domingo de Ramos.`,
        acciones: `<a class="btn" href="#coord-tablon">Publicar aviso</a><a class="btn btn-pri" href="#coord-eventos">+ Añadir evento</a>`
      }) + `<div class="cuerpo">
        <section class="hoy" aria-label="Qué necesita atención">
          <a href="#coord-cuadrantes"><span class="valor">${semana}</span><span class="etiqueta">Servicios en los próximos 7 días</span><span class="accion">Ver cuadrantes</span></a>
          <a href="#coord-bajas" class="${bajas ? 'alerta' : ''}"><span class="valor">${bajas}</span><span class="etiqueta">Bajas urgentes abiertas</span><span class="accion">Cubrir vacante</span></a>
          <a href="#coord-acuses"><span class="valor">${acuses}</span><span class="etiqueta">Turnos sin confirmar</span><span class="accion">Enviar recordatorio</span></a>
          <a href="#coord-presupuestos"><span class="valor">${presup}</span><span class="etiqueta">Presupuestos sin respuesta</span><span class="accion">Ver presupuestos</span></a>
          <a href="#coord-capacitaciones"><span class="valor">${capac}</span><span class="etiqueta">Capacitaciones por validar</span><span class="accion">Revisar</span></a>
        </section>
        <div class="rejilla-2">
          <section class="bloque"><div class="bloque-cab"><h2>Próximos eventos</h2><a class="btn btn-txt btn-peq" href="#coord-eventos">Todos los eventos</a></div>
            <ul class="agenda">${proximos.map(e => { const d = UI.diaCorto(e.inicio); const h = DB.hermandad(e.hermandad);
              return `<li><div class="dia"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(e.nombre)}</b><div class="tenue">${esc(h ? h.nombre : 'Sin hermandad')}, ${esc(e.franja)}</div></div>${chip(e.situacion)}</li>`; }).join('')}</ul></section>
          <section class="bloque"><div class="bloque-cab"><h2>Tablón de avisos</h2><a class="btn btn-txt btn-peq" href="#coord-tablon">Publicar aviso</a></div>
            <ul class="aviso-lista">${s.avisos.slice(0, 3).map(v => `<li><b>${esc(v.titulo)}</b><span class="tenue">${fecha(v.fecha)}, para ${esc(v.destinatarios.join(', ').toLowerCase())}</span></li>`).join('')}</ul></section>
        </div></div>`;
    }
  });

  /* ================= Eventos (MOCK-023, CU-010) ================= */
  P.ruta('coord-eventos', {
    roles: R, nav: 'coord-eventos', titulo: 'Eventos',
    render() {
      const s = S();
      const evs = [...s.eventos].sort((a, b) => a.inicio.localeCompare(b.inicio));
      return P.cabecera({ titulo: 'Eventos con trabajo', sub: 'Registra los días en los que habrá trabajo para planificar presupuestos y cuadrantes.' }) + `<div class="cuerpo"><div class="rejilla-2">
        <section class="bloque"><div class="bloque-cab"><h2>Próximos eventos</h2><span class="tenue">${evs.length} registrados</span></div>
          <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Evento</th><th>Hermandad</th><th>Días</th><th>Horario</th><th>Estado</th><th></th></tr></thead><tbody>
          ${evs.map(e => { const h = DB.hermandad(e.hermandad); return `<tr class="${e.situacion === 'Cancelado' ? 'fila-urgente' : ''}">
            <td><b>${esc(e.nombre)}</b><div class="tenue">${esc(e.clase)}</div></td><td>${esc(h ? h.nombre : '—')}</td>
            <td class="num">${fecha(e.inicio)}${e.fin !== e.inicio ? ` al ${fecha(e.fin)}` : ''}</td><td class="num">${esc(e.franja)}</td><td>${chip(e.situacion)}</td>
            <td class="acciones-celda">${e.situacion !== 'Cancelado' ? `<button class="btn btn-txt btn-peq" data-act="cancelar-evento" data-id="${e.id}">Cancelar</button>` : ''}</td></tr>`; }).join('')}
          </tbody></table></div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Añadir evento</h2></div>
          <form class="bloque-cuerpo form-rejilla" data-form="evento" novalidate>
            <div class="campo ancho"><label for="ev1">Nombre</label><input id="ev1" name="nombre" placeholder="Miércoles Santo"></div>
            <div class="campo"><label for="ev2">Clase de evento</label><select id="ev2" name="clase"><option>Salida procesional</option><option>Acto de culto</option><option>Otro acto</option></select></div>
            <div class="campo"><label for="ev3">Hermandad (opcional)</label><select id="ev3" name="hermandad"><option value="">Sin hermandad</option>${s.hermandades.map(h => `<option value="${h.id}">${esc(h.nombre)}</option>`).join('')}</select></div>
            <div class="campo"><label for="ev4">Primer día</label><input id="ev4" name="inicio" type="date" value="2027-03-24"></div>
            <div class="campo"><label for="ev5">Último día</label><input id="ev5" name="fin" type="date" value="2027-03-24"></div>
            <div class="campo ancho"><label for="ev6">Horario aproximado</label><input id="ev6" name="franja" placeholder="15:00 – 00:30"></div>
            <div class="campo ancho"><label for="ev7">Notas</label><textarea id="ev7" name="notas" placeholder="Lugar de citación, uniformidad…"></textarea></div>
            <div class="ancho" style="display:flex;justify-content:flex-end"><button class="btn btn-pri" type="submit">Guardar evento</button></div>
          </form></section></div></div>`;
    }
  });
  P.formulario('evento', (f, d) => {
    let ok = true;
    if (!d.nombre.trim()) { P.errorCampo(f, 'nombre', 'Pon un nombre al evento.'); ok = false; }
    if (!d.inicio) { P.errorCampo(f, 'inicio', 'Elige el primer día.'); ok = false; }
    if (d.fin && d.inicio && d.fin < d.inicio) { P.errorCampo(f, 'fin', 'El último día no puede ser anterior al primero.'); ok = false; }
    if (!d.franja.trim()) { P.errorCampo(f, 'franja', 'Indica el horario aproximado.'); ok = false; }
    if (!ok) return;
    S().eventos.push({ id: DB.id('e'), nombre: d.nombre.trim(), clase: d.clase, hermandad: d.hermandad, inicio: d.inicio, fin: d.fin || d.inicio, franja: d.franja.trim(), situacion: d.hermandad ? 'Pendiente de solicitud' : 'Pendiente de solicitud', notas: d.notas });
    DB.auditar('Registrar evento', d.nombre.trim()); DB.guardar();
    UI.toast('Evento guardado'); P.pintar();
  });
  P.accion('cancelar-evento', b => {
    const e = S().eventos.find(x => x.id === b.dataset.id);
    UI.modal({ titulo: `Cancelar ${e.nombre}`, cuerpo: `<p>El evento quedará marcado como cancelado y no se planificará personal para él.</p><div class="campo"><label for="mc">Motivo</label><input id="mc" name="motivo" placeholder="Suspendido por lluvia"></div>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Cancelar evento', clase: 'btn-urg', fn: m => { e.situacion = 'Cancelado'; e.notas = m.querySelector('#mc').value || e.notas; DB.auditar('Cancelar evento', e.nombre); DB.guardar(); UI.toast('Evento cancelado'); P.pintar(); } }] });
  });

  /* ================= Cuadrantes (MOCK-008, CU-006..009) ================= */
  const pestanasCuadrante = activo => `<nav class="pestanas"><a href="#coord-cuadrantes" class="${activo === 'v' ? 'activo' : ''}">Cuadrantes vigentes</a><a href="#coord-generar" class="${activo === 'g' ? 'activo' : ''}">Generar cuadrante</a></nav>`;
  P.ruta('coord-cuadrantes', {
    roles: R, nav: 'coord-cuadrantes', titulo: 'Cuadrantes',
    render() {
      const s = S();
      const cs = [...s.cuadrantes].sort((a, b) => solDe(a).fecha.localeCompare(solDe(b).fecha));
      const sinCuadrante = s.presupuestos.filter(p => p.estado === 'Aceptado' && !DB.cuadranteDePresupuesto(p.id));
      return P.cabecera({ titulo: 'Cuadrantes', sub: 'Asignación de personal a cada servicio con presupuesto aceptado.' }) + pestanasCuadrante('v') + `<div class="cuerpo" style="padding-top:0">
        ${sinCuadrante.length ? `<div class="nota">${sinCuadrante.length} servicio${sinCuadrante.length > 1 ? 's' : ''} con presupuesto aceptado sin cuadrante. <a href="#coord-generar">Generar cuadrante</a></div>` : ''}
        <section class="bloque"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Servicio</th><th>Fecha</th><th>Cubiertos</th><th>Acuses</th><th>Estado</th><th></th></tr></thead><tbody>
        ${cs.map(c => { const so = solDe(c); const cub = c.puestos.filter(a => a.trabajador && a.acuse !== 'Baja').length; const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
          return `<tr class="clicable" data-ir="coord-generar-${c.id}"><td><b>${esc(DB.hermandad(so.hermandad).nombre)}</b><div class="tenue">${esc(so.acto)}</div></td><td class="num">${fecha(so.fecha)}<div class="tenue">${esc(so.horario)}</div></td>
            <td class="num ${cub < c.puestos.length || !c.puestos.length ? 'texto-urgente' : ''}">${cub}/${c.puestos.length}</td><td class="num">${c.estado === 'Publicado' ? `${conf}/${c.puestos.length}` : '—'}</td><td>${chip(c.estado)}</td>
            <td class="acciones-celda"><button class="btn btn-peq" data-act="exportar-cuadrante" data-id="${c.id}">Exportar</button> <a class="btn btn-peq" href="#coord-generar-${c.id}">${c.estado === 'Publicado' ? 'Ver' : 'Editar'}</a></td></tr>`; }).join('')}
        </tbody></table></div></section></div>`;
    }
  });

  P.ruta('coord-generar', {
    roles: R, nav: 'coord-cuadrantes', titulo: 'Generar cuadrante',
    render() {
      const s = S();
      // Servicios elegibles: cuadrantes existentes + presupuestos aceptados sin cuadrante
      s.presupuestos.filter(p => p.estado === 'Aceptado' && !DB.cuadranteDePresupuesto(p.id)).forEach(p => s.cuadrantes.push({ id: DB.id('c'), presupuesto: p.id, estado: 'Borrador', publicado: '', plazoAcuse: '', puestos: [] }));
      const opciones = s.cuadrantes;
      let c = DB.cuadrante(P.param) || opciones.find(x => x.estado === 'Borrador') || opciones[0];
      const so = solDe(c);
      const problemas = c.puestos.length ? DB.validar(c) : {};
      const nProb = Object.values(problemas).filter(v => v !== 'Sin cubrir').length;
      const cub = c.puestos.filter(a => a.trabajador).length;
      const publicado = c.estado === 'Publicado';
      const habilitados = f => s.trabajadores.filter(t => !t.baja && DB.habilitado(t, f));
      return P.cabecera({ titulo: 'Cuadrantes', sub: 'Asignación de personal a cada servicio con presupuesto aceptado.' }) + pestanasCuadrante('g') + `<div class="cuerpo" style="padding-top:0">
        <section class="bloque"><div class="bloque-cuerpo" style="display:flex;flex-direction:column;gap:14px">
          <div class="campo" style="max-width:560px"><label for="gsel">Servicio (presupuesto aceptado)</label>
            <select id="gsel" data-cambio="elegir-cuadrante">${opciones.map(o => `<option value="${o.id}" ${o.id === c.id ? 'selected' : ''}>${esc(servicioTexto(o))}${o.estado === 'Publicado' ? ' (publicado)' : ''}</option>`).join('')}</select></div>
          <p>Puestos solicitados: ${so.funciones.map(f => `<b>${f.cantidad}</b> ${esc(f.funcion.toLowerCase())}`).join(', ')}. Citación ${esc(so.horario)}.</p>
          ${publicado ? '' : `<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-pri" data-act="proponer" data-id="${c.id}">Generar propuesta automática</button><button class="btn" data-act="validar" data-id="${c.id}">Validar solapes</button></div>`}
        </div></section>
        <section class="bloque">
          ${c.puestos.length ? `<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Puesto</th><th>Horario</th><th>Trabajador</th><th>Validación</th>${publicado ? '<th>Acuse</th>' : ''}</tr></thead><tbody>
          ${c.puestos.map(a => { const pr = problemas[a.id];
            return `<tr class="${pr ? 'fila-urgente' : ''}"><td><b>${esc(a.puesto)}</b></td><td class="num">${esc(a.horario)}</td>
            <td>${publicado ? (a.trabajador ? esc(nombreT(a.trabajador)) : '<span class="texto-urgente">Sin cubrir</span>') : `<select class="input" style="max-width:220px" data-cambio="asignar" data-c="${c.id}" data-a="${a.id}"><option value="">Sin cubrir</option>${habilitados(a.funcion).map(t => `<option value="${t.id}" ${t.id === a.trabajador ? 'selected' : ''}>${esc(t.nombre)}</option>`).join('')}</select>`}</td>
            <td>${pr ? `<span class="texto-urgente">${pr === 'Sin cubrir' ? 'Sin candidatos habilitados' : esc(pr)}</span>` : '<span class="texto-ok">Correcto</span>'}</td>${publicado ? `<td>${chip(a.acuse)}</td>` : ''}</tr>`; }).join('')}
          </tbody></table></div>` : P.vacia('Cuadrante vacío', 'Genera una propuesta automática a partir de los puestos solicitados.')}
          <div class="bloque-pie"><span class="resumen">Cubiertos <b class="num">${cub}/${c.puestos.length}</b>. Conflictos <b class="num ${nProb ? 'texto-urgente' : ''}">${nProb}</b>. Estado ${chip(c.estado)}</span>
            <button class="btn" data-act="exportar-cuadrante" data-id="${c.id}" ${c.puestos.length ? '' : 'disabled'}>Exportar PDF/CSV</button>
            ${publicado ? '' : `<button class="btn btn-pri" data-act="publicar-cuadrante" data-id="${c.id}" ${c.puestos.length ? '' : 'disabled'}>Cerrar y publicar</button>`}</div>
        </section></div>`;
    },
    despues() { DB.guardar(); }
  });
  P.accion('elegir-cuadrante', el => P.ir('coord-generar-' + el.value));
  P.accion('proponer', b => { const c = DB.cuadrante(b.dataset.id); DB.proponer(c); DB.auditar('Generar cuadrante', servicioTexto(c)); DB.guardar(); UI.toast('Propuesta generada con la disponibilidad declarada'); P.pintar(); });
  P.accion('validar', b => { const c = DB.cuadrante(b.dataset.id); const n = Object.keys(DB.validar(c)).length; UI.toast(n ? `${n} puesto${n > 1 ? 's' : ''} con problemas` : 'Sin solapes ni puestos vacíos', n ? 'urg' : 'ok'); P.pintar(); });
  P.accion('asignar', el => { const c = DB.cuadrante(el.dataset.c); const a = c.puestos.find(x => x.id === el.dataset.a); a.trabajador = el.value; DB.guardar(); P.pintar(); });
  P.accion('publicar-cuadrante', b => {
    const c = DB.cuadrante(b.dataset.id); const pr = DB.validar(c); const n = Object.keys(pr).length;
    if (n) {
      UI.modal({ titulo: 'No se puede publicar todavía', cuerpo: `<p>Resuelve estos puestos antes de publicar:</p><ul>${c.puestos.filter(a => pr[a.id]).map(a => `<li><b>${esc(a.puesto)}</b>: ${esc(pr[a.id])}</li>`).join('')}</ul>`, acciones: [{ texto: 'Revisar', clase: 'btn-pri' }] });
      DB.auditar('Publicar cuadrante', servicioTexto(c), `Fallido: ${n} conflictos`); DB.guardar(); return;
    }
    UI.modal({ titulo: 'Cerrar y publicar el cuadrante', cuerpo: `<p>Se avisará a los ${c.puestos.length} trabajadores asignados para que confirmen la recepción de su turno.</p><div class="campo"><label for="pa">Plazo para confirmar</label><input id="pa" type="date" value="2027-03-19"></div>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Publicar', clase: 'btn-pri', fn: m => {
        c.estado = 'Publicado'; c.publicado = S().hoy; c.plazoAcuse = m.querySelector('#pa').value;
        const so = solDe(c); so.estado = 'Cuadrante publicado';
        c.puestos.forEach(a => DB.notificar(a.trabajador, 'Cuadrante publicado', `Tienes turno como ${a.puesto.toLowerCase()} con la ${DB.hermandad(so.hermandad).nombre} el ${UI.fechaLarga(so.fecha)}. Confirma la recepción.`, 'turno', a.id));
        DB.auditar('Publicar cuadrante', servicioTexto(c)); DB.guardar(); UI.toast('Cuadrante publicado y trabajadores avisados'); P.pintar(); } }] });
  });

  /* Exportar cuadrante (CU-009) — pantalla nueva */
  P.cuadranteCSV = (c, contacto) => {
    const so = solDe(c);
    const filas = [['Hermandad', 'Acto', 'Fecha', 'Puesto', 'Horario', 'Trabajador', ...(contacto ? ['Teléfono'] : []), 'Acuse']];
    c.puestos.forEach(a => { const t = DB.trabajador(a.trabajador); filas.push([DB.hermandad(so.hermandad).nombre, so.acto, fecha(so.fecha), a.puesto, a.horario, t ? t.nombre : 'Sin cubrir', ...(contacto ? [t ? t.telefono : ''] : []), a.acuse]); });
    return filas.map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
  };
  P.cuadranteDoc = (c, contacto) => {
    const so = solDe(c); const h = DB.hermandad(so.hermandad);
    return `<div class="doc-pdf"><div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid var(--oro);padding-bottom:10px;margin-bottom:12px"><div><div class="titulo-serif" style="font-size:22px">Cuadrante de servicio</div><div class="tenue">${esc(h.nombre)}, ${esc(so.acto)}</div></div><div style="text-align:right">${P.CIRIO(26)}<div class="tenue">Chamorro Servicios Cofrades</div></div></div>
      <p style="margin-bottom:10px">${UI.fechaLarga(so.fecha)}, citación ${esc(so.horario)} en ${esc(h.sede)}</p>
      <table class="tabla"><thead><tr><th>Puesto</th><th>Trabajador</th>${contacto ? '<th>Teléfono</th>' : ''}<th>Acuse</th></tr></thead><tbody>${c.puestos.map(a => { const t = DB.trabajador(a.trabajador); return `<tr><td>${esc(a.puesto)}</td><td>${esc(t ? t.nombre : 'Sin cubrir')}</td>${contacto ? `<td>${esc(t ? t.telefono : '')}</td>` : ''}<td>${esc(a.acuse)}</td></tr>`; }).join('')}</tbody></table></div>`;
  };
  P.accion('exportar-cuadrante', b => {
    const c = DB.cuadrante(b.dataset.id);
    const pintar = m => {
      const fmt = m.querySelector('[name=fmt]:checked').value; const ct = m.querySelector('#ctc').checked;
      m.querySelector('#vista').innerHTML = fmt === 'CSV' ? `<textarea class="input" readonly style="min-height:160px;font-family:ui-monospace,monospace;font-size:12px">${esc(P.cuadranteCSV(c, ct))}</textarea>` : P.cuadranteDoc(c, ct);
    };
    const m = UI.modal({ titulo: 'Exportar cuadrante', ancho: 720,
      cuerpo: `<p class="muted">${esc(servicioTexto(c))}</p>
        <div style="display:flex;gap:18px;flex-wrap:wrap"><label class="check"><input type="radio" name="fmt" value="PDF" checked> PDF para imprimir</label><label class="check"><input type="radio" name="fmt" value="CSV"> CSV para hoja de cálculo</label><label class="check"><input type="checkbox" id="ctc"> Incluir teléfonos</label></div>
        <div id="vista" style="border:1px solid var(--linea);border-radius:var(--r-s);padding:14px;max-height:340px;overflow:auto"></div>`,
      acciones: [{ texto: 'Cerrar' }, { texto: 'Copiar CSV', fn: m => { P.copiar(P.cuadranteCSV(c, m.querySelector('#ctc').checked)); return false; } },
        { texto: 'Descargar', clase: 'btn-pri', fn: m => { const fmt = m.querySelector('[name=fmt]:checked').value; const ct = m.querySelector('#ctc').checked;
          if (fmt === 'CSV') P.descargar(`cuadrante-${c.id}.csv`, P.cuadranteCSV(c, ct));
          else P.descargar(`cuadrante-${c.id}.html`, `<!DOCTYPE html><meta charset="utf-8"><title>Cuadrante</title><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/portal.css"><body style="padding:30px">${P.cuadranteDoc(c, ct)}`, 'text/html');
          DB.auditar('Exportar cuadrante', `${servicioTexto(c)} (${fmt})`); DB.guardar(); UI.toast(`Cuadrante exportado en ${fmt}`); } }] });
    m.addEventListener('change', () => pintar(m)); pintar(m);
  });

  /* ================= Bajas urgentes (CU-012, 013, 015) — pantalla nueva ================= */
  P.ruta('coord-bajas', {
    roles: R, nav: 'coord-bajas', titulo: 'Bajas urgentes',
    render() {
      const s = S();
      const abiertas = s.bajas.filter(b => b.estado === 'Abierta');
      const cerradas = s.bajas.filter(b => b.estado !== 'Abierta');
      const b = s.bajas.find(x => x.id === P.param) || abiertas[0];
      let detalle = P.vacia('No hay bajas abiertas', 'Cuando un trabajador comunique una baja desde la app aparecerá aquí con los candidatos para cubrirla.');
      if (b) {
        const c = DB.cuadrante(b.cuadrante); const a = c.puestos.find(x => x.id === b.puesto); const so = solDe(c); const h = DB.hermandad(so.hermandad);
        const cands = DB.candidatos(c, a);
        const oferta = tid => b.ofertas.find(o => o.trabajador === tid);
        detalle = `<section class="bloque"><div class="bloque-cab"><div><h2>${esc(a.puesto)}, ${esc(h.nombre)}</h2><span class="tenue">${UI.fechaLarga(so.fecha)}, citación ${esc(so.horario)} en ${esc(h.sede)}</span></div>${chip(b.estado)}</div>
          <div class="bloque-cuerpo"><dl class="datos"><dt>Baja de</dt><dd>${esc(nombreT(b.trabajador))}</dd><dt>Motivo</dt><dd>${esc(b.motivo)}${b.explicacion ? `. ${esc(b.explicacion)}` : ''}</dd><dt>Comunicada</dt><dd class="num">${fecha(b.fecha)} a las ${UI.hora(b.fecha)}</dd>${b.sustituto ? `<dt>Cubierta por</dt><dd class="texto-ok">${esc(nombreT(b.sustituto))}</dd>` : ''}</dl></div></section>
          ${b.estado === 'Abierta' ? `<section class="bloque"><div class="bloque-cab"><div><h2>Candidatos propuestos</h2><span class="tenue">Habilitados para ${esc(a.funcion.toLowerCase())}, ordenados por disponibilidad y cercanía</span></div></div>
          ${cands.length ? `<div class="tabla-scroll"><table class="tabla tabla-compacta"><thead><tr><th><span class="sr">Elegir</span></th><th>Trabajador</th><th>Disponible ese día</th><th class="der">Distancia</th><th class="der">Prioridad</th><th>Oferta</th><th></th></tr></thead><tbody>
          ${cands.map(x => { const o = oferta(x.t.id); return `<tr><td><input type="checkbox" class="sel-cand" value="${x.t.id}" aria-label="Elegir a ${esc(x.t.nombre)}" ${o && o.estado !== 'Rechazada' ? 'disabled' : ''}></td><td class="nw"><b>${esc(x.t.nombre)}</b><div class="tenue">${esc(x.t.zona)}</div></td><td>${x.disp ? '<span class="texto-ok">Sí</span>' : '<span class="muted">No declarada</span>'}</td><td class="der num">${x.km.toFixed(1)} km</td><td class="der num">${x.puntos}</td><td class="nw">${o ? chip(o.estado) + `<div class="tenue">caduca ${UI.hora(o.caduca)}</div>` : '<span class="tenue">Sin enviar</span>'}</td>
            <td class="acciones-celda"><button class="btn btn-txt btn-peq" data-act="sustituir" data-b="${b.id}" data-t="${x.t.id}">Asignar</button></td></tr>`; }).join('')}</tbody></table></div>
          <div class="bloque-pie"><span class="resumen">La alerta llega como notificación push y caduca a las 12 horas.</span><button class="btn" data-act="alerta" data-b="${b.id}" data-todos="1">Enviar a todos</button><button class="btn btn-urg" data-act="alerta" data-b="${b.id}">Enviar alerta a los elegidos</button></div>`
          : P.vacia('Sin candidatos', 'No hay trabajadores habilitados libres ese día. Puedes publicar un aviso en el tablón.', '<a class="btn" href="#coord-tablon">Publicar aviso</a>')}</section>` : ''}`;
      }
      return P.cabecera({ titulo: 'Bajas urgentes', sub: 'Cobertura de vacantes de última hora.' }) + `<div class="cuerpo"><div class="rejilla-2" style="grid-template-columns:minmax(0,320px) minmax(0,1fr)">
        <section class="bloque"><div class="bloque-cab"><h2>Abiertas</h2><span class="tenue">${abiertas.length}</span></div>
          <ul class="aviso-lista">${abiertas.map(x => { const c = DB.cuadrante(x.cuadrante); const a = c.puestos.find(y => y.id === x.puesto); const so = solDe(c);
            return `<li style="${b && x.id === b.id ? 'background:var(--burdeos-claro)' : ''}"><a href="#coord-bajas-${x.id}" style="text-decoration:none;color:inherit"><b>${esc(a.puesto)}</b><span class="tenue">${esc(DB.hermandad(so.hermandad).nombre)}, ${fecha(so.fecha)}</span><br><span class="tenue">${x.ofertas.length} oferta${x.ofertas.length !== 1 ? 's' : ''} enviada${x.ofertas.length !== 1 ? 's' : ''}</span></a></li>`; }).join('') || '<li class="tenue">Ninguna</li>'}</ul>
          ${cerradas.length ? `<div class="bloque-cab" style="border-top:1px solid var(--linea)"><h2>Cubiertas</h2></div><ul class="aviso-lista">${cerradas.map(x => `<li><a href="#coord-bajas-${x.id}" style="text-decoration:none;color:inherit"><b>${esc(DB.cuadrante(x.cuadrante).puestos.find(y => y.id === x.puesto).puesto)}</b><span class="tenue">Cubierta por ${esc(nombreT(x.sustituto))}</span></a></li>`).join('')}</ul>` : ''}
        </section><div style="display:flex;flex-direction:column;gap:20px">${detalle}</div></div></div>`;
    }
  });
  P.accion('alerta', bt => {
    const b = S().bajas.find(x => x.id === bt.dataset.b);
    const c = DB.cuadrante(b.cuadrante); const a = c.puestos.find(x => x.id === b.puesto); const so = solDe(c);
    let ids = bt.dataset.todos ? DB.candidatos(c, a).map(x => x.t.id) : [...document.querySelectorAll('.sel-cand:checked')].map(i => i.value);
    ids = ids.filter(id => !b.ofertas.some(o => o.trabajador === id && o.estado !== 'Rechazada'));
    if (!ids.length) return UI.toast('Elige al menos un candidato sin oferta pendiente', 'urg');
    const env = DB.ahora(); const h = +env.slice(11, 13);
    const caduca = `${env.slice(0, 11)}${String(Math.min(h + 12, 23)).padStart(2, '0')}${env.slice(13)}`;
    ids.forEach(id => {
      b.ofertas = b.ofertas.filter(o => o.trabajador !== id);
      b.ofertas.push({ trabajador: id, estado: 'Enviada', enviada: env, caduca });
      DB.notificar(id, 'Cobertura urgente', `Se busca ${a.funcion.toLowerCase()} para la ${DB.hermandad(so.hermandad).nombre} el ${UI.fechaLarga(so.fecha)}.`, 'urgente', b.id);
    });
    DB.auditar('Enviar alerta de cobertura', `${a.puesto} (${ids.length} candidatos)`); DB.guardar();
    UI.toast(`Alerta enviada a ${ids.length} candidato${ids.length > 1 ? 's' : ''}`); P.pintar();
  });
  P.cubrirBaja = (b, tid, quien) => DB.cubrirBaja(b, tid, quien || P.sesion().nombre);
  P.accion('sustituir', bt => {
    const b = S().bajas.find(x => x.id === bt.dataset.b); const t = DB.trabajador(bt.dataset.t);
    UI.modal({ titulo: 'Registrar sustitución', cuerpo: `<p><b>${esc(t.nombre)}</b> pasará a ocupar el puesto y se actualizará el cuadrante. Se le enviará una notificación y las demás ofertas quedarán caducadas.</p>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Registrar sustitución', clase: 'btn-pri', fn: () => { P.cubrirBaja(b, t.id); DB.guardar(); UI.toast('Sustitución registrada y cuadrante actualizado'); P.pintar(); } }] });
  });

  /* ================= Acuses de turno (MOCK-011, CU-018) ================= */
  P.ruta('coord-acuses', {
    roles: R, nav: 'coord-acuses', titulo: 'Acuses de turno',
    render() {
      const pubs = S().cuadrantes.filter(c => c.estado === 'Publicado');
      const c = DB.cuadrante(P.param) || pubs.find(x => x.puestos.some(a => a.acuse === 'Pendiente')) || pubs[0];
      if (!c) return P.cabecera({ titulo: 'Acuses de turno' }) + `<div class="cuerpo">${P.vacia('Sin cuadrantes publicados', 'Publica un cuadrante para seguir quién ha confirmado su turno.')}</div>`;
      const pend = c.puestos.filter(a => a.acuse === 'Pendiente');
      const conf = c.puestos.filter(a => a.acuse === 'Confirmado').length;
      const vence = diasHasta(c.plazoAcuse);
      return P.cabecera({ titulo: 'Acuses de turno', sub: 'Quién ha confirmado la recepción de su turno y quién no.' }) + `<div class="cuerpo">
        <div class="filtros"><select data-cambio="elegir-acuses" aria-label="Cuadrante">${pubs.map(o => `<option value="${o.id}" ${o.id === c.id ? 'selected' : ''}>${esc(servicioTexto(o))}</option>`).join('')}</select></div>
        <section class="bloque"><div class="bloque-cab"><div><h2>${conf} de ${c.puestos.length} confirmados</h2><span class="tenue">Plazo para confirmar: ${fecha(c.plazoAcuse)}${vence >= 0 ? ` (quedan ${vence} día${vence !== 1 ? 's' : ''})` : ' (vencido)'}</span></div>
          <div style="min-width:200px"><div class="barra ${conf < c.puestos.length ? 'aviso' : ''}"><i style="width:${c.puestos.length ? conf / c.puestos.length * 100 : 0}%"></i></div></div></div>
          <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Puesto</th><th>Trabajador</th><th>Teléfono</th><th>Acuse</th><th></th></tr></thead><tbody>
          ${c.puestos.map(a => { const t = DB.trabajador(a.trabajador); return `<tr><td>${esc(a.puesto)}</td><td><b>${esc(t ? t.nombre : 'Sin cubrir')}</b></td><td class="num">${esc(t ? t.telefono : '')}</td><td>${chip(a.acuse)}${a.recordado ? `<div class="tenue">Recordado ${UI.hora(a.recordado)}</div>` : ''}</td>
            <td class="acciones-celda">${a.acuse === 'Pendiente' ? `<button class="btn btn-peq" data-act="recordar" data-c="${c.id}" data-a="${a.id}">Recordar</button>` : a.acuse === 'Baja' ? `<a class="btn btn-txt btn-peq" href="#coord-bajas">Ver baja</a>` : ''}</td></tr>`; }).join('')}
          </tbody></table></div>
          <div class="bloque-pie"><span class="resumen">${pend.length} pendiente${pend.length !== 1 ? 's' : ''}</span><button class="btn btn-pri" data-act="recordar" data-c="${c.id}" ${pend.length ? '' : 'disabled'}>Recordar a todos los pendientes</button></div></section></div>`;
    }
  });
  P.accion('elegir-acuses', el => P.ir('coord-acuses-' + el.value));
  P.accion('recordar', b => {
    const c = DB.cuadrante(b.dataset.c); const so = solDe(c);
    const lista = b.dataset.a ? c.puestos.filter(a => a.id === b.dataset.a) : c.puestos.filter(a => a.acuse === 'Pendiente');
    lista.forEach(a => { a.recordado = DB.ahora(); DB.notificar(a.trabajador, 'Confirma tu turno', `Aún no has confirmado tu turno con la ${DB.hermandad(so.hermandad).nombre} del ${UI.fechaLarga(so.fecha)}.`, 'turno', a.id); });
    DB.auditar('Enviar recordatorio de acuse', `${servicioTexto(c)} (${lista.length})`); DB.guardar();
    UI.toast(`Recordatorio enviado a ${lista.length} trabajador${lista.length !== 1 ? 'es' : ''}`); P.pintar();
  });

  /* ================= Tablón de avisos (MOCK-012, CU-019) ================= */
  P.ruta('coord-tablon', {
    roles: R, nav: 'coord-tablon', titulo: 'Tablón de avisos',
    render() {
      const s = S(); const activos = s.trabajadores.filter(t => !t.baja).length;
      return P.cabecera({ titulo: 'Tablón de avisos', sub: 'Comunicaciones oficiales a la plantilla.' }) + `<div class="cuerpo"><div class="rejilla-2-igual">
        <section class="bloque"><div class="bloque-cab"><h2>Publicar aviso</h2></div>
          <form class="bloque-cuerpo" style="display:flex;flex-direction:column;gap:14px" data-form="aviso" novalidate>
            <div class="campo"><label for="av1">Título</label><input id="av1" name="titulo" maxlength="80" placeholder="Recogida de uniformes"></div>
            <div class="campo"><label for="av2">Mensaje</label><textarea id="av2" name="texto" placeholder="Qué, cuándo y dónde"></textarea></div>
            <div class="campo"><span class="etq">Destinatarios</span><div style="display:flex;flex-wrap:wrap;gap:8px 16px">
              <label class="check"><input type="checkbox" name="dest" value="Todos" checked> Toda la plantilla</label>
              ${DB.FUNCIONES.map(f => `<label class="check"><input type="checkbox" name="dest" value="${f}"> ${f}</label>`).join('')}</div></div>
            <label class="check"><input type="checkbox" name="push" checked> Enviar también como notificación push</label>
            <div style="display:flex;justify-content:flex-end"><button class="btn btn-pri" type="submit">Publicar aviso</button></div>
          </form></section>
        <section class="bloque"><div class="bloque-cab"><h2>Avisos publicados</h2><span class="tenue">${s.avisos.length}</span></div>
          <ul class="aviso-lista">${s.avisos.map(v => `<li><b>${esc(v.titulo)}</b><p class="muted" style="margin:4px 0">${esc(v.texto)}</p><span class="tenue">${fecha(v.fecha)} ${UI.hora(v.fecha)}, para ${esc(v.destinatarios.join(', ').toLowerCase())}${v.push ? ', con push' : ''}. Leído por ${v.leidos.length} de ${activos}.</span></li>`).join('')}</ul></section>
      </div></div>`;
    }
  });
  P.formulario('aviso', (f, d) => {
    let ok = true;
    if (!d.titulo.trim()) { P.errorCampo(f, 'titulo', 'Escribe un título.'); ok = false; }
    if (!d.texto.trim()) { P.errorCampo(f, 'texto', 'Escribe el mensaje.'); ok = false; }
    const dest = [].concat(d.dest || []);
    if (!dest.length) { P.errorCampo(f, 'dest', 'Elige al menos un grupo.'); ok = false; }
    if (!ok) return;
    const destinatarios = dest.includes('Todos') ? ['Todos'] : dest;
    S().avisos.unshift({ id: DB.id('v'), titulo: d.titulo.trim(), texto: d.texto.trim(), destinatarios, fecha: DB.ahora(), autor: P.sesion().nombre, push: !!d.push, leidos: [] });
    S().trabajadores.filter(t => !t.baja && (destinatarios.includes('Todos') || t.capacitaciones.some(c => c.estado === 'Aprobada' && destinatarios.includes(c.rol))))
      .forEach(t => DB.notificar(t.id, 'Nuevo aviso', d.titulo.trim(), 'aviso'));
    DB.auditar('Publicar aviso', d.titulo.trim()); DB.guardar();
    UI.toast('Aviso publicado'); P.pintar();
  });

  /* ================= Presupuestos (MOCK-013, CU-021, 022, 025) ================= */
  let filtroP = { estado: '', hermandad: '' };
  P.ruta('coord-presupuestos', {
    roles: R, nav: 'coord-presupuestos', titulo: 'Presupuestos',
    render() {
      const s = S();
      const lista = s.presupuestos.filter(p => { const so = DB.solicitud(p.solicitud); return (!filtroP.estado || p.estado === filtroP.estado) && (!filtroP.hermandad || so.hermandad === filtroP.hermandad); })
        .sort((a, b) => (b.enviado || '9').localeCompare(a.enviado || '9'));
      const aceptado = s.presupuestos.filter(p => p.estado === 'Aceptado').reduce((n, p) => n + DB.totales(p).total, 0);
      const pend = s.solicitudes.filter(x => x.estado === 'Pendiente de presupuesto');
      const accion = p => ({
        'Borrador': `<a class="btn btn-peq" href="#coord-presupuesto-nuevo-${p.id}">Editar</a>`,
        'Enviado': `<button class="btn btn-peq" data-act="reenviar" data-id="${p.id}">Reenviar</button>`,
        'Aceptado': p.exportado ? '<span class="tenue">Exportado a contabilidad</span>' : `<button class="btn btn-peq btn-pri" data-act="exportar-contable" data-id="${p.id}">Exportar a contabilidad</button>`,
        'Rechazado': `<button class="btn btn-peq" data-act="nueva-version" data-id="${p.id}">Nueva versión</button>`
      }[p.estado]);
      return P.cabecera({ titulo: 'Presupuestos', sub: 'Elaboración, envío y seguimiento de los presupuestos a las hermandades.', acciones: `<a class="btn btn-pri" href="#coord-presupuesto-nuevo">+ Elaborar presupuesto</a>` }) + `<div class="cuerpo">
        ${pend.length ? `<section class="bloque"><div class="bloque-cab"><h2>Solicitudes pendientes de presupuesto</h2><span class="tenue">${pend.length}</span></div><div class="tabla-scroll"><table class="tabla"><tbody>
          ${pend.map(x => `<tr><td><b>${esc(DB.hermandad(x.hermandad).nombre)}</b><div class="tenue">${esc(x.acto)}</div></td><td class="num">${fecha(x.fecha)}</td><td>${x.funciones.map(f => `${f.cantidad} ${esc(f.funcion.toLowerCase())}`).join(', ')}</td><td class="acciones-celda"><a class="btn btn-pri btn-peq" href="#coord-presupuesto-nuevo-${x.id}">Elaborar presupuesto</a></td></tr>`).join('')}
          </tbody></table></div></section>` : ''}
        <section class="bloque"><div class="bloque-cab"><div class="filtros">
            <select data-cambio="filtro-p" data-k="estado" aria-label="Estado"><option value="">Todos los estados</option>${['Borrador', 'Enviado', 'Aceptado', 'Rechazado'].map(e => `<option ${filtroP.estado === e ? 'selected' : ''}>${e}</option>`).join('')}</select>
            <select data-cambio="filtro-p" data-k="hermandad" aria-label="Hermandad"><option value="">Todas las hermandades</option>${s.hermandades.map(h => `<option value="${h.id}" ${filtroP.hermandad === h.id ? 'selected' : ''}>${esc(h.nombre)}</option>`).join('')}</select></div>
            <span class="tenue">Importe aceptado: <b class="num" style="color:var(--romero)">${euros(aceptado)}</b></span></div>
          <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Presupuesto</th><th>Hermandad</th><th>Servicio</th><th class="der">Total</th><th>Estado</th><th></th></tr></thead><tbody>
          ${lista.map(p => { const so = DB.solicitud(p.solicitud); return `<tr><td><b class="num">${esc(p.codigo)}</b><div class="tenue">v${p.version}${p.enviado ? `, enviado ${fecha(p.enviado)}` : ''}</div></td><td>${esc(DB.hermandad(so.hermandad).nombre)}</td><td>${esc(so.acto)}<div class="tenue">${fecha(so.fecha)}</div></td><td class="der num"><b>${euros(DB.totales(p).total)}</b></td><td>${chip(p.estado)}${p.motivo ? `<div class="tenue">${esc(p.motivo)}</div>` : ''}</td><td class="acciones-celda">${accion(p)}</td></tr>`; }).join('') || `<tr><td colspan="6">${P.vacia('Sin resultados', 'Prueba con otro filtro.')}</td></tr>`}
          </tbody></table></div></section></div>`;
    }
  });
  P.accion('filtro-p', el => { filtroP[el.dataset.k] = el.value; P.pintar(); });
  P.accion('reenviar', b => { const p = DB.presupuesto(b.dataset.id); p.enviado = S().hoy; DB.auditar('Reenviar presupuesto', p.codigo); DB.guardar(); UI.toast(`${p.codigo} reenviado a la hermandad`); P.pintar(); });
  P.accion('nueva-version', b => {
    const p = DB.presupuesto(b.dataset.id);
    const n = { ...JSON.parse(JSON.stringify(p)), id: DB.id('p'), version: p.version + 1, estado: 'Borrador', enviado: '', respuesta: '', motivo: '', exportado: false };
    S().presupuestos.push(n); DB.auditar('Crear nueva versión de presupuesto', `${p.codigo} v${n.version}`); DB.guardar(); P.ir('coord-presupuesto-nuevo-' + n.id);
  });
  P.accion('exportar-contable', b => {
    const p = DB.presupuesto(b.dataset.id); const so = DB.solicitud(p.solicitud); const h = DB.hermandad(so.hermandad); const t = DB.totales(p);
    const csv = [['Fecha', 'Documento', 'Cliente', 'Cuenta', 'Concepto', 'Debe', 'Haber'],
      [fecha(p.respuesta), p.codigo, h.nombre, '430', 'Cliente', t.total.toFixed(2), ''],
      [fecha(p.respuesta), p.codigo, h.nombre, '705', 'Prestación de servicios', '', t.base.toFixed(2)],
      [fecha(p.respuesta), p.codigo, h.nombre, '477', `IVA repercutido ${p.iva}%`, '', t.iva.toFixed(2)]].map(r => r.join(';')).join('\n');
    UI.modal({ titulo: `Exportar ${p.codigo} a contabilidad`, ancho: 640, cuerpo: `<p class="muted">${esc(h.nombre)}, ${esc(so.acto)}. Se genera el asiento para importarlo en la aplicación contable externa.</p>
      <table class="tabla"><thead><tr><th>Cuenta</th><th>Concepto</th><th class="der">Debe</th><th class="der">Haber</th></tr></thead><tbody>
      <tr><td>430</td><td>Cliente</td><td class="der num">${euros(t.total)}</td><td></td></tr><tr><td>705</td><td>Prestación de servicios</td><td></td><td class="der num">${euros(t.base)}</td></tr><tr><td>477</td><td>IVA repercutido ${p.iva}%</td><td></td><td class="der num">${euros(t.iva)}</td></tr></tbody></table>`,
      acciones: [{ texto: 'Cancelar' }, { texto: 'Copiar CSV', fn: () => { P.copiar(csv); return false; } }, { texto: 'Exportar', clase: 'btn-pri', fn: () => { P.descargar(`${p.codigo}-contabilidad.csv`, csv); p.exportado = true; DB.auditar('Exportar presupuesto a contabilidad', p.codigo); DB.guardar(); UI.toast(`${p.codigo} exportado a contabilidad`); P.pintar(); } }] });
  });

  /* Elaborar presupuesto (CU-021) — pantalla nueva */
  const horasDe = horario => { const m = horario.match(/(\d{1,2}):(\d{2})\s*–\s*(\d{1,2}):(\d{2})/); if (!m) return 4; let a = +m[1] + m[2] / 60, b = +m[3] + m[4] / 60; if (b <= a) b += 24; return Math.round((b - a) * 2) / 2; };
  P.ruta('coord-presupuesto-nuevo', {
    roles: R, nav: 'coord-presupuestos', titulo: 'Elaborar presupuesto',
    render() {
      const s = S();
      let p = DB.presupuesto(P.param);
      let solId = p ? p.solicitud : (DB.solicitud(P.param) ? P.param : '');
      const solicitables = s.solicitudes.filter(x => x.estado === 'Pendiente de presupuesto' || (p && x.id === p.solicitud));
      if (!p) {
        const so = DB.solicitud(solId) || solicitables[0];
        if (!so) return P.cabecera({ titulo: 'Elaborar presupuesto' }) + `<div class="cuerpo">${P.vacia('No hay solicitudes pendientes', 'Las hermandades solicitan servicios desde su portal.')}</div>`;
        const h = horasDe(so.horario);
        const num = 27 + s.presupuestos.length;
        p = { id: DB.id('p'), codigo: `PRE-2027-0${num}`, solicitud: so.id, version: 1, iva: 21, estado: 'Borrador', enviado: '', respuesta: '', exportado: false, nuevo: true,
          lineas: so.funciones.map(f => ({ funcion: f.funcion, cantidad: f.cantidad, horas: h, tarifa: s.tarifas[f.funcion] })) };
        s.presupuestos.push(p); P._borrador = p.id; DB.guardar();
        history.replaceState(null, '', '#coord-presupuesto-nuevo-' + p.id);
      }
      const so = DB.solicitud(p.solicitud); const h = DB.hermandad(so.hermandad); const t = DB.totales(p);
      return P.cabecera({ titulo: p.version > 1 ? `${p.codigo}, versión ${p.version}` : 'Elaborar presupuesto', miga: '<a href="#coord-presupuestos">Presupuestos</a>', sub: `${esc(p.codigo)}. Las tarifas por hora vienen de la tabla de tarifas vigente y se pueden ajustar.` }) + `<div class="cuerpo">
        <section class="bloque"><div class="bloque-cuerpo form-rejilla">
          <div class="campo"><label for="ps">Solicitud</label><select id="ps" data-cambio="cambiar-solicitud" data-p="${p.id}" ${p.version > 1 ? 'disabled' : ''}>${solicitables.map(x => `<option value="${x.id}" ${x.id === so.id ? 'selected' : ''}>${esc(DB.hermandad(x.hermandad).nombre)}, ${esc(x.acto)}</option>`).join('')}</select></div>
          <div class="campo"><span class="etq">Servicio</span><p style="padding:9px 0">${UI.fechaLarga(so.fecha)}, ${esc(so.horario)}, ${esc(h.sede)}</p></div>
        </div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Desglose por puesto</h2><button class="btn btn-txt btn-peq" data-act="linea-mas" data-p="${p.id}">+ Añadir línea</button></div>
          <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Puesto</th><th class="der">Personas</th><th class="der">Horas</th><th class="der">Tarifa €/h</th><th class="der">Importe</th><th></th></tr></thead><tbody>
          ${p.lineas.map((l, i) => `<tr><td><select class="input" data-cambio="linea" data-p="${p.id}" data-i="${i}" data-k="funcion" style="max-width:220px">${DB.FUNCIONES.map(f => `<option ${f === l.funcion ? 'selected' : ''}>${f}</option>`).join('')}</select></td>
            <td class="der"><input class="input num" style="width:80px;text-align:right" type="number" min="1" value="${l.cantidad}" data-cambio="linea" data-p="${p.id}" data-i="${i}" data-k="cantidad" aria-label="Personas"></td>
            <td class="der"><input class="input num" style="width:80px;text-align:right" type="number" min="0.5" step="0.5" value="${l.horas}" data-cambio="linea" data-p="${p.id}" data-i="${i}" data-k="horas" aria-label="Horas"></td>
            <td class="der"><input class="input num" style="width:90px;text-align:right" type="number" min="0" step="0.5" value="${l.tarifa}" data-cambio="linea" data-p="${p.id}" data-i="${i}" data-k="tarifa" aria-label="Tarifa"></td>
            <td class="der num"><b>${euros(l.cantidad * l.horas * l.tarifa)}</b></td><td class="acciones-celda"><button class="icono-btn" data-act="linea-menos" data-p="${p.id}" data-i="${i}" aria-label="Quitar línea">✕</button></td></tr>`).join('')}
          </tbody></table></div>
          <div class="bloque-cuerpo"><div class="totales"><span>Base imponible</span><span class="der num">${euros(t.base)}</span><span>IVA (${p.iva}%)</span><span class="der num">${euros(t.iva)}</span><span class="t">Total</span><span class="t der num">${euros(t.total)}</span></div></div>
          <div class="bloque-pie"><button class="btn btn-txt" data-act="descartar-presupuesto" data-p="${p.id}">Descartar</button><button class="btn" data-act="vista-presupuesto" data-p="${p.id}">Vista previa PDF</button><button class="btn" data-act="guardar-presupuesto" data-p="${p.id}">Guardar borrador</button><button class="btn btn-pri" data-act="enviar-presupuesto" data-p="${p.id}">Enviar a la hermandad</button></div>
        </section></div>`;
    }
  });
  P.accion('cambiar-solicitud', el => { const p = DB.presupuesto(el.dataset.p); S().presupuestos.splice(S().presupuestos.indexOf(p), 1); DB.guardar(); P.ir('coord-presupuesto-nuevo-' + el.value); });
  P.accion('linea', el => { const p = DB.presupuesto(el.dataset.p); const l = p.lineas[+el.dataset.i]; const k = el.dataset.k; l[k] = k === 'funcion' ? el.value : Math.max(0, parseFloat(el.value) || 0); if (k === 'funcion') l.tarifa = S().tarifas[el.value]; DB.guardar(); P.pintar(); });
  P.accion('linea-mas', b => { const p = DB.presupuesto(b.dataset.p); const libre = DB.FUNCIONES.find(f => !p.lineas.some(l => l.funcion === f)) || DB.FUNCIONES[0]; p.lineas.push({ funcion: libre, cantidad: 1, horas: p.lineas[0] ? p.lineas[0].horas : 4, tarifa: S().tarifas[libre] }); DB.guardar(); P.pintar(); });
  P.accion('linea-menos', b => { const p = DB.presupuesto(b.dataset.p); p.lineas.splice(+b.dataset.i, 1); DB.guardar(); P.pintar(); });
  P.accion('descartar-presupuesto', b => { const p = DB.presupuesto(b.dataset.p); S().presupuestos.splice(S().presupuestos.indexOf(p), 1); DB.guardar(); UI.toast('Borrador descartado'); P.ir('coord-presupuestos'); });
  P.accion('guardar-presupuesto', b => { const p = DB.presupuesto(b.dataset.p); delete p.nuevo; DB.auditar('Guardar presupuesto', p.codigo); DB.guardar(); UI.toast('Borrador guardado'); P.ir('coord-presupuestos'); });
  P.presupuestoDoc = p => {
    const so = DB.solicitud(p.solicitud); const h = DB.hermandad(so.hermandad); const t = DB.totales(p);
    return `<div class="doc-pdf"><div style="display:flex;justify-content:space-between;border-bottom:2px solid var(--oro);padding-bottom:10px;margin-bottom:12px"><div><div class="titulo-serif" style="font-size:22px">Presupuesto ${esc(p.codigo)}</div><div class="tenue">Versión ${p.version}</div></div><div style="text-align:right">${P.CIRIO(26)}<div class="tenue">Chamorro Servicios Cofrades</div></div></div>
      <p><b>${esc(h.nombre)}</b><br>${esc(so.acto)}, ${UI.fechaLarga(so.fecha)} (${esc(so.horario)})</p>
      <table class="tabla" style="margin:12px 0"><thead><tr><th>Puesto</th><th class="der">Personas</th><th class="der">Horas</th><th class="der">€/h</th><th class="der">Importe</th></tr></thead><tbody>${p.lineas.map(l => `<tr><td>${esc(l.funcion)}</td><td class="der num">${l.cantidad}</td><td class="der num">${l.horas}</td><td class="der num">${euros(l.tarifa)}</td><td class="der num">${euros(l.cantidad * l.horas * l.tarifa)}</td></tr>`).join('')}</tbody></table>
      <div class="totales"><span>Base imponible</span><span class="num">${euros(t.base)}</span><span>IVA (${p.iva}%)</span><span class="num">${euros(t.iva)}</span><span class="t">Total</span><span class="t num">${euros(t.total)}</span></div>
      <p class="tenue" style="margin-top:14px">Validez de 30 días desde su envío. Incluye uniformidad y desplazamiento dentro de Sevilla capital.</p></div>`;
  };
  P.accion('vista-presupuesto', b => UI.modal({ titulo: 'Vista previa', ancho: 680, cuerpo: P.presupuestoDoc(DB.presupuesto(b.dataset.p)), acciones: [{ texto: 'Cerrar', clase: 'btn-pri' }] }));
  P.accion('enviar-presupuesto', b => {
    const p = DB.presupuesto(b.dataset.p); const so = DB.solicitud(p.solicitud); const h = DB.hermandad(so.hermandad);
    if (!p.lineas.length || DB.totales(p).base <= 0) return UI.toast('Añade al menos una línea con importe', 'urg');
    UI.modal({ titulo: 'Enviar presupuesto', cuerpo: `<p>Se enviará <b>${esc(p.codigo)}</b> por un total de <b>${euros(DB.totales(p).total)}</b> a ${esc(h.nombre)}. Podrán aceptarlo o rechazarlo desde su portal.</p>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Enviar', clase: 'btn-pri', fn: () => {
        delete p.nuevo; p.estado = 'Enviado'; p.enviado = S().hoy; so.estado = 'Presupuesto enviado';
        const ev = S().eventos.find(e => e.id === so.evento); if (ev) ev.situacion = 'Presupuesto enviado';
        DB.auditar('Enviar presupuesto', p.codigo); DB.guardar(); UI.toast(`${p.codigo} enviado a la hermandad`); P.ir('coord-presupuestos'); } }] });
  });

  /* ================= Personal (MOCK-009, 024, 010; CU-001..003) ================= */
  let filtroT = { q: '', rol: '', dia: '2027-03-22' };
  const DIAS_SS = ['2027-03-21', '2027-03-22', '2027-03-23', '2027-03-24', '2027-03-25', '2027-03-26'];
  const NOMBRES_DIA = { '2027-03-21': 'Domingo de Ramos', '2027-03-22': 'Lunes Santo', '2027-03-23': 'Martes Santo', '2027-03-24': 'Miércoles Santo', '2027-03-25': 'Jueves Santo', '2027-03-26': 'Madrugá y Viernes' };
  const pestanasPersonal = a => `<nav class="pestanas"><a href="#coord-personal" class="${a === 'c' ? 'activo' : ''}">Catálogo</a><a href="#coord-disponibilidad" class="${a === 'd' ? 'activo' : ''}">Matriz de disponibilidad</a></nav>`;
  P.ruta('coord-personal', {
    roles: R, nav: 'coord-personal', titulo: 'Personal',
    render() {
      const lista = S().trabajadores.filter(t => (!filtroT.q || t.nombre.toLowerCase().includes(filtroT.q.toLowerCase())) && (!filtroT.rol || DB.habilitado(t, filtroT.rol)))
        .sort((a, b) => (a.baja ? 1 : 0) - (b.baja ? 1 : 0) || a.nombre.localeCompare(b.nombre));
      return P.cabecera({ titulo: 'Personal', sub: `${S().trabajadores.filter(t => !t.baja).length} trabajadores en activo.`, acciones: `<button class="btn btn-pri" data-act="alta-trabajador">+ Dar de alta</button>` }) + pestanasPersonal('c') + `<div class="cuerpo" style="padding-top:0">
        <div class="filtros"><input class="input buscar" type="search" placeholder="Buscar por nombre" value="${esc(filtroT.q)}" data-cambio="filtro-t" data-k="q" aria-label="Buscar">
          <select data-cambio="filtro-t" data-k="rol" aria-label="Capacitación"><option value="">Cualquier capacitación</option>${DB.FUNCIONES.map(f => `<option ${filtroT.rol === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
          <select data-cambio="filtro-t" data-k="dia" aria-label="Día">${DIAS_SS.map(d => `<option value="${d}" ${filtroT.dia === d ? 'selected' : ''}>Disponibilidad: ${NOMBRES_DIA[d]}</option>`).join('')}</select></div>
        <section class="bloque"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Trabajador</th><th>Capacitaciones</th><th>Talla</th><th>Zona</th><th>${NOMBRES_DIA[filtroT.dia]}</th><th></th></tr></thead><tbody>
        ${lista.map(t => { const d = t.disponibilidad[filtroT.dia] || []; return `<tr class="clicable" data-ir="coord-ficha-${t.id}"><td><b>${esc(t.nombre)}</b>${t.baja ? ' ' + chip('Baja', 'De baja') : ''}<div class="tenue num">${esc(t.telefono)}</div></td>
          <td>${t.capacitaciones.filter(c => c.estado === 'Aprobada').map(c => esc(c.rol)).join(', ')}${t.capacitaciones.some(c => c.estado === 'Pendiente') ? ' ' + chip('Pendiente', '1 pendiente') : ''}</td><td>${esc(t.talla)}</td><td>${esc(t.zona)}</td>
          <td>${d.length ? `<span class="texto-ok">${d.join(', ')}</span>` : '<span class="tenue">No disponible</span>'}</td><td class="acciones-celda"><a class="btn btn-peq" href="#coord-ficha-${t.id}">Ver ficha</a></td></tr>`; }).join('')}
        </tbody></table></div></section></div>`;
    }
  });
  P.accion('filtro-t', el => { filtroT[el.dataset.k] = el.value; P.pintar(); });

  P.ruta('coord-disponibilidad', {
    roles: R, nav: 'coord-personal', titulo: 'Matriz de disponibilidad',
    render() {
      const ts = S().trabajadores.filter(t => !t.baja);
      const celda = (t, d) => { const f = t.disponibilidad[d] || []; return `<td style="text-align:center">${['mañana', 'tarde', 'noche'].map(x => `<span title="${x}" style="display:inline-block;width:14px;height:14px;margin:0 1px;border-radius:3px;background:${f.includes(x) ? 'var(--romero)' : '#E8E5EB'}"></span>`).join('')}</td>`; };
      return P.cabecera({ titulo: 'Personal', sub: 'Franjas de mañana, tarde y noche declaradas por cada trabajador.' }) + pestanasPersonal('d') + `<div class="cuerpo" style="padding-top:0"><section class="bloque"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Trabajador</th>${DIAS_SS.map(d => `<th style="text-align:center">${NOMBRES_DIA[d]}</th>`).join('')}</tr></thead><tbody>
        ${ts.map(t => `<tr class="clicable" data-ir="coord-ficha-${t.id}"><td><b>${esc(t.nombre)}</b></td>${DIAS_SS.map(d => celda(t, d)).join('')}</tr>`).join('')}</tbody></table></div>
        <div class="bloque-pie"><span class="resumen tenue">Cada día muestra tres casillas: mañana, tarde y noche. En verde, franja disponible.</span></div></section></div>`;
    }
  });

  P.ruta('coord-ficha', {
    roles: R, nav: 'coord-personal', titulo: 'Ficha del trabajador',
    render() {
      const t = DB.trabajador(P.param) || DB.trabajador('t1');
      const turnos = DB.turnosDe(t.id);
      return P.cabecera({ titulo: t.nombre, miga: '<a href="#coord-personal">Personal</a>', sub: `${t.baja ? 'De baja. ' : ''}En la plantilla desde ${fecha(t.alta)}.`,
        acciones: t.baja ? '' : `<button class="btn" data-act="editar-trabajador" data-id="${t.id}">Editar ficha</button><button class="btn btn-txt" data-act="baja-trabajador" data-id="${t.id}" style="color:var(--burdeos)">Dar de baja</button>` }) + `<div class="cuerpo"><div class="rejilla-2-igual">
        <section class="bloque"><div class="bloque-cab"><h2>Datos de contacto</h2></div><div class="bloque-cuerpo"><dl class="datos">
          <dt>Teléfono</dt><dd class="num">${esc(t.telefono)}</dd><dt>Correo</dt><dd>${esc(t.correo)}</dd><dt>Zona</dt><dd>${esc(t.zona)}</dd><dt>Talla de uniforme</dt><dd>${esc(t.talla)}</dd><dt>Calzado</dt><dd>${esc(t.calzado)}</dd></dl></div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Capacitaciones</h2></div><table class="tabla"><tbody>
          ${t.capacitaciones.map(c => `<tr class="${c.estado === 'Rechazada' ? 'fila-urgente' : ''}"><td><b>${esc(c.rol)}</b></td><td>${chip(c.estado)}</td><td class="tenue">${c.por ? `Resuelta por ${esc(c.por)}` : esc(c.experiencia || '')}${c.motivo ? `. ${esc(c.motivo)}` : ''}</td></tr>`).join('')}</tbody></table></section>
        <section class="bloque"><div class="bloque-cab"><h2>Disponibilidad declarada</h2></div><div class="bloque-cuerpo"><div class="disp"><span></span><span class="h" style="text-align:center">Mañana</span><span class="h" style="text-align:center">Tarde</span><span class="h" style="text-align:center">Noche</span>
          ${DIAS_SS.map(d => `<span class="h">${NOMBRES_DIA[d]}</span>${['mañana', 'tarde', 'noche'].map(f => `<span class="c ${(t.disponibilidad[d] || []).includes(f) ? 'si' : ''}">${(t.disponibilidad[d] || []).includes(f) ? 'Sí' : '—'}</span>`).join('')}`).join('')}</div></div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Próximos turnos</h2></div>${turnos.length ? `<ul class="agenda">${turnos.map(x => { const d = UI.diaCorto(x.solicitud.fecha); return `<li><div class="dia"><b>${d.dia}</b><span>${d.mes}</span></div><div><b>${esc(x.asignacion.puesto)}</b><div class="tenue">${esc(x.hermandad.nombre)}, ${esc(x.asignacion.horario)}</div></div>${chip(x.asignacion.acuse)}</li>`; }).join('')}</ul>` : P.vacia('Sin turnos', 'No tiene turnos en cuadrantes publicados.')}</section>
      </div></div>`;
    }
  });
  const formTrabajador = (t = {}) => `<div class="form-rejilla">
    <div class="campo ancho"><label for="ft1">Nombre y apellidos</label><input id="ft1" name="nombre" value="${esc(t.nombre || '')}"></div>
    <div class="campo"><label for="ft2">Teléfono</label><input id="ft2" name="telefono" value="${esc(t.telefono || '')}"></div>
    <div class="campo"><label for="ft3">Correo</label><input id="ft3" name="correo" type="email" value="${esc(t.correo || '')}"></div>
    <div class="campo"><label for="ft4">Zona</label><select id="ft4" name="zona">${['Triana', 'Los Remedios', 'Centro', 'Macarena', 'Nervión', 'Cerro del Águila'].map(z => `<option ${t.zona === z ? 'selected' : ''}>${z}</option>`).join('')}</select></div>
    <div class="campo"><label for="ft5">Talla</label><select id="ft5" name="talla">${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(z => `<option ${t.talla === z ? 'selected' : ''}>${z}</option>`).join('')}</select></div>
    ${t.id ? '' : `<div class="campo ancho"><span class="etq">Capacitaciones iniciales</span><div style="display:flex;flex-wrap:wrap;gap:6px 14px">${DB.FUNCIONES.map(f => `<label class="check"><input type="checkbox" name="cap" value="${f}"> ${f}</label>`).join('')}</div></div>`}</div>`;
  const leerTrabajador = m => { const g = n => m.querySelector(`[name=${n}]`).value.trim(); return { nombre: g('nombre'), telefono: g('telefono'), correo: g('correo'), zona: g('zona'), talla: g('talla') }; };
  P.accion('alta-trabajador', () => UI.modal({ titulo: 'Dar de alta a un trabajador', ancho: 600, cuerpo: formTrabajador(),
    acciones: [{ texto: 'Cancelar' }, { texto: 'Dar de alta', clase: 'btn-pri', fn: m => {
      const d = leerTrabajador(m); if (!d.nombre || !d.telefono) { UI.toast('Nombre y teléfono son obligatorios', 'urg'); return false; }
      const t = { id: DB.id('t'), ...d, calzado: 42, alta: S().hoy, capacitaciones: [...m.querySelectorAll('[name=cap]:checked')].map(i => ({ rol: i.value, estado: 'Aprobada', por: P.sesion().nombre })), disponibilidad: {} };
      S().trabajadores.push(t); S().usuarios.push({ id: DB.id('u'), nombre: t.nombre, correo: t.correo, rol: 'Trabajador', trabajador: t.id, activo: true, clave: 'demo' });
      DB.auditar('Dar de alta trabajador', t.nombre); DB.guardar(); UI.toast(`${t.nombre} dado de alta`); P.ir('coord-ficha-' + t.id); } }] }));
  P.accion('editar-trabajador', b => { const t = DB.trabajador(b.dataset.id); UI.modal({ titulo: 'Editar ficha', ancho: 600, cuerpo: formTrabajador(t),
    acciones: [{ texto: 'Cancelar' }, { texto: 'Guardar cambios', clase: 'btn-pri', fn: m => { Object.assign(t, leerTrabajador(m)); DB.auditar('Editar ficha de trabajador', t.nombre); DB.guardar(); UI.toast('Ficha actualizada'); P.pintar(); } }] }); });
  P.accion('baja-trabajador', b => { const t = DB.trabajador(b.dataset.id); UI.modal({ titulo: `Dar de baja a ${t.nombre}`, cuerpo: '<p>Dejará de aparecer como candidato en cuadrantes y sustituciones. Su historial se conserva.</p>',
    acciones: [{ texto: 'Cancelar' }, { texto: 'Dar de baja', clase: 'btn-urg', fn: () => { t.baja = true; DB.auditar('Dar de baja trabajador', t.nombre); DB.guardar(); UI.toast(`${t.nombre} dado de baja`); P.pintar(); } }] }); });

  /* Validar capacitaciones (MOCK-010, CU-002) */
  P.ruta('coord-capacitaciones', {
    roles: R, nav: 'coord-capacitaciones', titulo: 'Capacitaciones',
    render() {
      const pend = []; const res = [];
      S().trabajadores.forEach(t => t.capacitaciones.forEach((c, i) => (c.estado === 'Pendiente' ? pend : res).push({ t, c, i })));
      return P.cabecera({ titulo: 'Validar capacitaciones', sub: 'Solicitudes de los trabajadores para habilitarse en un nuevo puesto.' }) + `<div class="cuerpo">
        <section class="bloque"><div class="bloque-cab"><h2>Pendientes</h2><span class="tenue">${pend.length}</span></div>
        ${pend.length ? `<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Trabajador</th><th>Puesto solicitado</th><th>Experiencia aportada</th><th></th></tr></thead><tbody>
          ${pend.map(x => `<tr><td><b>${esc(x.t.nombre)}</b><div class="tenue">${esc(x.t.capacitaciones.filter(c => c.estado === 'Aprobada').map(c => c.rol).join(', '))}</div></td><td>${esc(x.c.rol)}</td><td style="max-width:360px">${esc(x.c.experiencia || '')}</td>
            <td class="acciones-celda"><button class="btn btn-peq" data-act="rechazar-cap" data-t="${x.t.id}" data-i="${x.i}">Rechazar</button> <button class="btn btn-peq btn-ok" data-act="aprobar-cap" data-t="${x.t.id}" data-i="${x.i}">Aprobar</button></td></tr>`).join('')}</tbody></table></div>`
          : P.vacia('Todo al día', 'No hay solicitudes de capacitación pendientes.')}</section>
        <section class="bloque"><div class="bloque-cab"><h2>Resueltas</h2></div><div class="tabla-scroll"><table class="tabla"><tbody>
          ${res.filter(x => x.c.por).slice(0, 12).map(x => `<tr><td>${esc(x.t.nombre)}</td><td>${esc(x.c.rol)}</td><td>${chip(x.c.estado)}</td><td class="tenue">${esc(x.c.por)}${x.c.motivo ? `: ${esc(x.c.motivo)}` : ''}</td></tr>`).join('')}</tbody></table></div></section></div>`;
    }
  });
  P.accion('aprobar-cap', b => { const t = DB.trabajador(b.dataset.t); const c = t.capacitaciones[+b.dataset.i]; c.estado = 'Aprobada'; c.por = P.sesion().nombre;
    DB.notificar(t.id, 'Capacitación aprobada', `Ya puedes ser asignado como ${c.rol.toLowerCase()}.`, 'info'); DB.auditar('Aprobar capacitación', `${t.nombre}: ${c.rol}`); DB.guardar(); UI.toast(`${t.nombre} habilitado como ${c.rol.toLowerCase()}`); P.pintar(); });
  P.accion('rechazar-cap', b => { const t = DB.trabajador(b.dataset.t); const c = t.capacitaciones[+b.dataset.i];
    UI.modal({ titulo: `Rechazar ${c.rol.toLowerCase()}`, cuerpo: `<p>${esc(t.nombre)} recibirá el motivo en la app.</p><div class="campo"><label for="mr">Motivo</label><input id="mr" placeholder="Sin experiencia acreditada"></div>`,
      acciones: [{ texto: 'Cancelar' }, { texto: 'Rechazar', clase: 'btn-urg', fn: m => { const mot = m.querySelector('#mr').value.trim(); if (!mot) { UI.toast('Indica el motivo', 'urg'); return false; }
        c.estado = 'Rechazada'; c.por = P.sesion().nombre; c.motivo = mot; DB.notificar(t.id, 'Capacitación rechazada', `${c.rol}: ${mot}`, 'info'); DB.auditar('Rechazar capacitación', `${t.nombre}: ${c.rol}`); DB.guardar(); UI.toast('Solicitud rechazada'); P.pintar(); } }] }); });
})();
