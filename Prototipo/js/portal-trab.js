/* Portal web — trabajadores (acceso desde el ordenador: ver turnos y cuadrantes en grande) */
(function () {
  const { esc, chip, fecha } = UI;
  const S = () => DB.s;
  const R = ['Trabajador'];
  const yo = () => DB.trabajador(P.sesion().trabajador);
  const citacion = h => h.split(' – ')[0];
  const textoAcuse = a => (a === 'Pendiente' ? 'Sin confirmar' : a);
  const DIAS = [['2027-03-21', 'Domingo de Ramos'], ['2027-03-22', 'Lunes Santo'], ['2027-03-23', 'Martes Santo'], ['2027-03-24', 'Miércoles Santo'], ['2027-03-25', 'Jueves Santo'], ['2027-03-26', 'Madrugá y Viernes Santo'], ['2027-03-27', 'Sábado Santo'], ['2027-03-28', 'Domingo de Resurrección']];
  const FRANJAS = ['mañana', 'tarde', 'noche'];

  /* Oferta de sustitución urgente, común a varias pantallas */
  function bannerOfertas() {
    return DB.ofertasPara(yo().id).map(b => {
      const x = DB.buscarTurno(b.puesto); const o = b.ofertas.find(y => y.trabajador === yo().id);
      return `<div class="nota nota-urg" style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
        <div><b>Cobertura urgente:</b> se busca ${esc(x.a.funcion.toLowerCase())} para la ${esc(x.h.nombre)} el ${UI.fechaLarga(x.so.fecha)} a las ${esc(citacion(x.a.horario))}. La oferta caduca a las ${esc(UI.hora(o.caduca))}.</div>
        <div style="display:flex;gap:8px"><button class="btn btn-peq" data-act="t-rechazar" data-b="${b.id}">No puedo</button><button class="btn btn-peq btn-urg" data-act="t-aceptar" data-b="${b.id}">Aceptar sustitución</button></div></div>`;
    }).join('');
  }
  P.accion('t-aceptar', bt => {
    const b = S().bajas.find(x => x.id === bt.dataset.b);
    if (b.estado !== 'Abierta') { UI.toast('Otro compañero ya ha cubierto el puesto', 'urg'); return P.pintar(); }
    DB.cubrirBaja(b, yo().id, yo().nombre, 'Aceptar sustitución'); DB.guardar(); UI.toast('Sustitución aceptada. Ya está en tus turnos.'); P.pintar();
  });
  P.accion('t-rechazar', bt => { const b = S().bajas.find(x => x.id === bt.dataset.b); DB.rechazarOferta(b, yo().id, yo().nombre); DB.guardar(); UI.toast('Oferta rechazada'); P.pintar(); });

  /* ================= Mis turnos (CU-016, CU-017, CU-011, CU-014) ================= */
  P.ruta('trab-turnos', {
    roles: R, nav: 'trab-turnos', titulo: 'Mis turnos',
    render() {
      const t = yo();
      const turnos = DB.turnosDe(t.id);
      const pend = turnos.filter(x => x.asignacion.acuse === 'Pendiente').length;
      return P.cabecera({ titulo: `Hola, ${t.nombre.split(' ')[0]}`, sub: pend ? `Tienes ${pend} turno${pend > 1 ? 's' : ''} sin confirmar.` : 'Todos tus turnos están confirmados.' }) + `<div class="cuerpo">
        ${bannerOfertas()}
        <section class="bloque"><div class="bloque-cab"><h2>Mis turnos</h2><span class="tenue">Semana Santa 2027</span></div>
        ${turnos.length ? `<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Día</th><th>Hermandad y acto</th><th>Puesto</th><th>Citación</th><th>Estado</th><th></th></tr></thead><tbody>
          ${turnos.map(x => { const a = x.asignacion; const baja = a.acuse === 'Baja'; return `<tr class="${baja ? 'fila-urgente' : ''}"><td class="num">${UI.fechaLarga(x.solicitud.fecha)}</td><td><b>${esc(x.hermandad.nombre)}</b><div class="tenue">${esc(x.solicitud.acto)}</div></td><td>${esc(a.puesto)}</td><td class="num">${esc(citacion(a.horario))} h<div class="tenue">${esc(x.hermandad.sede)}</div></td><td>${chip(a.acuse, textoAcuse(a.acuse))}</td>
            <td class="acciones-celda"><a class="btn btn-peq" href="#trab-cuadrante-${x.cuadrante.id}">Ver cuadrante</a> ${a.acuse === 'Pendiente' ? `<button class="btn btn-peq btn-pri" data-act="t-confirmar" data-a="${a.id}">Confirmar</button>` : ''} ${!baja ? `<button class="btn btn-peq btn-txt" style="color:var(--burdeos)" data-act="t-baja" data-a="${a.id}">No puedo asistir</button>` : ''}</td></tr>`; }).join('')}
          </tbody></table></div>` : P.vacia('Sin turnos asignados', 'Cuando el coordinador publique un cuadrante en el que estés, aparecerá aquí. Mantén al día tu disponibilidad.', '<a class="btn" href="#trab-disponibilidad">Marcar disponibilidad</a>')}</section></div>`;
    }
  });
  P.accion('t-confirmar', b => { DB.confirmarTurno(b.dataset.a, yo().nombre); DB.guardar(); UI.toast('Turno confirmado'); P.pintar(); });
  P.accion('t-baja', b => {
    const x = DB.buscarTurno(b.dataset.a);
    UI.modal({ titulo: 'Comunicar baja', cuerpo: `<p><b>${esc(x.a.puesto)}</b>, ${esc(x.h.nombre)}, ${UI.fechaLarga(x.so.fecha)} a las ${esc(citacion(x.a.horario))}.</p>
      <div class="campo"><label for="bm">Motivo</label><select id="bm"><option>Enfermedad</option><option>Motivos familiares</option><option>Trabajo o estudios</option><option>Otro motivo</option></select></div>
      <div class="campo"><label for="be">Explicación</label><textarea id="be" placeholder="Cuéntale al coordinador qué ha pasado"></textarea></div>
      <div class="campo"><label for="bj">Justificante (opcional)</label><input id="bj" type="file" accept="image/*,.pdf"></div>
      <p class="nota nota-urg">Tu puesto quedará libre al instante y el coordinador buscará un sustituto.</p>`,
      acciones: [{ texto: 'Volver' }, { texto: 'Comunicar baja', clase: 'btn-urg', fn: m => {
        const mot = m.querySelector('#bm').value; const ex = m.querySelector('#be').value.trim();
        if (mot === 'Otro motivo' && !ex) { UI.toast('Explica el motivo', 'urg'); return false; }
        DB.comunicarBaja(x.a.id, yo().id, mot, ex, (m.querySelector('#bj').files[0] || {}).name, yo().nombre); DB.guardar();
        UI.toast('Baja comunicada. El coordinador ya está avisado.'); P.pintar(); } }] });
  });

  /* ================= Cuadrantes (ver el cuadrante completo en grande, CU-016) ================= */
  P.ruta('trab-cuadrante', {
    roles: R, nav: 'trab-cuadrante', titulo: 'Cuadrantes',
    render() {
      const t = yo();
      const mios = S().cuadrantes.filter(c => c.estado === 'Publicado' && c.puestos.some(a => a.trabajador === t.id)).sort((a, b) => DB.sol(a).fecha.localeCompare(DB.sol(b).fecha));
      const c = mios.find(x => x.id === P.param) || mios[0];
      if (!c) return P.cabecera({ titulo: 'Cuadrantes' }) + `<div class="cuerpo">${P.vacia('Sin cuadrantes', 'Aquí verás el cuadrante completo de cada servicio en el que trabajes.')}</div>`;
      const so = DB.sol(c); const h = DB.hermandad(so.hermandad);
      const notas = (S().eventos.find(e => e.id === so.evento) || {}).notas || '';
      return P.cabecera({ titulo: 'Cuadrante del servicio', sub: `${esc(h.nombre)}. ${esc(so.acto)}, ${UI.fechaLarga(so.fecha)}.`, acciones: `<button class="btn" data-act="t-pdf" data-id="${c.id}">Descargar PDF</button>` }) + `<div class="cuerpo">
        ${mios.length > 1 ? `<div class="filtros"><select data-cambio="t-elegir" aria-label="Servicio">${mios.map(o => `<option value="${o.id}" ${o.id === c.id ? 'selected' : ''}>${esc(DB.servicioTexto(o))} (${fecha(DB.sol(o).fecha)})</option>`).join('')}</select></div>` : ''}
        <div class="rejilla-2" style="grid-template-columns:minmax(0,1.7fr) minmax(0,1fr)">
          <section class="bloque"><div class="bloque-cab"><h2>Personal del cortejo</h2><span class="tenue">${c.puestos.length} puestos</span></div>
            <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Puesto</th><th>Persona</th><th>Citación</th><th>Confirmación</th></tr></thead><tbody>
            ${c.puestos.map(a => { const w = DB.trabajador(a.trabajador); const soyYo = a.trabajador === t.id; return `<tr style="${soyYo ? 'background:var(--morado-claro)' : ''}"><td><b>${esc(a.puesto)}</b></td><td>${a.acuse === 'Baja' ? '<span class="muted">Buscando sustituto</span>' : esc(w ? w.nombre : 'Por asignar')}${soyYo ? ' <b style="color:var(--morado)">(tú)</b>' : ''}</td><td class="num">${esc(citacion(a.horario))}</td><td>${a.acuse === 'Baja' ? chip('Pendiente', 'Sustitución en curso') : chip(a.acuse, textoAcuse(a.acuse))}</td></tr>`; }).join('')}
            </tbody></table></div></section>
          <section class="bloque"><div class="bloque-cab"><h2>Datos del servicio</h2></div><div class="bloque-cuerpo"><dl class="datos">
            <dt>Día</dt><dd>${UI.fechaLarga(so.fecha)}</dd><dt>Horario</dt><dd class="num">${esc(so.horario)}</dd><dt>Citación</dt><dd>${esc(h.sede)}</dd>${notas ? `<dt>Indicaciones</dt><dd>${esc(notas)}</dd>` : ''}<dt>Contacto</dt><dd>${esc(h.contacto)}, ${esc(h.telefono)}</dd></dl>
            <p style="margin-top:14px"><a class="btn btn-peq" href="https://www.google.com/maps/search/${encodeURIComponent(h.sede + ', Sevilla')}" target="_blank" rel="noopener">Ver ubicación en el mapa</a></p></div></section>
        </div></div>`;
    }
  });
  P.accion('t-elegir', el => P.ir('trab-cuadrante-' + el.value));
  P.accion('t-pdf', b => { const c = DB.cuadrante(b.dataset.id); UI.modal({ titulo: 'Cuadrante del servicio', ancho: 700, cuerpo: P.cuadranteDoc(c, false), acciones: [{ texto: 'Cerrar' }, { texto: 'Descargar', clase: 'btn-pri', fn: () => { P.descargar('cuadrante.html', `<!DOCTYPE html><meta charset="utf-8"><title>Cuadrante</title><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/portal.css"><body style="padding:30px">${P.cuadranteDoc(c, false)}`, 'text/html'); UI.toast('Cuadrante descargado'); } }] }); });

  /* ================= Disponibilidad (CU-004) ================= */
  let disp = null;
  P.ruta('trab-disponibilidad', {
    roles: R, nav: 'trab-disponibilidad', titulo: 'Disponibilidad',
    render() {
      if (!disp) disp = JSON.parse(JSON.stringify(yo().disponibilidad));
      return P.cabecera({ titulo: 'Disponibilidad', sub: 'Marca en qué franjas puedes trabajar cada día. El coordinador la usa para el cuadrante y las sustituciones.', acciones: `<button class="btn" data-act="t-copiar">Copiar la del año pasado</button><button class="btn btn-pri" data-act="t-guardar-disp">Guardar disponibilidad</button>` }) + `<div class="cuerpo">
        <section class="bloque"><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Día</th>${FRANJAS.map(f => `<th style="text-align:center">${f[0].toUpperCase() + f.slice(1)}</th>`).join('')}</tr></thead><tbody>
        ${DIAS.map(([d, n]) => `<tr><td><b>${n}</b><div class="tenue">${UI.fechaLarga(d)}</div></td>${FRANJAS.map(f => { const on = (disp[d] || []).includes(f); return `<td style="text-align:center"><button class="btn btn-peq ${on ? 'btn-ok' : ''}" style="min-width:110px" aria-pressed="${on}" data-act="t-franja" data-d="${d}" data-f="${f}">${on ? 'Disponible' : '—'}</button></td>`; }).join('')}</tr>`).join('')}
        </tbody></table></div></section></div>`;
    }
  });
  P.accion('t-franja', b => { const l = disp[b.dataset.d] = disp[b.dataset.d] || []; const i = l.indexOf(b.dataset.f); if (i >= 0) l.splice(i, 1); else l.push(b.dataset.f); P.pintar(); });
  P.accion('t-copiar', () => { disp = {}; DIAS.slice(0, 6).forEach(([d]) => { disp[d] = ['tarde', 'noche']; }); UI.toast('Copiada la de 2026. Revísala y guarda.'); P.pintar(); });
  P.accion('t-guardar-disp', () => { yo().disponibilidad = disp; DB.auditar('Marcar disponibilidad', 'Semana Santa 2027', 'Correcto', yo().nombre); DB.guardar(); disp = null; UI.toast('Disponibilidad guardada'); P.pintar(); });

  /* ================= Tablón de avisos (CU-020) ================= */
  P.ruta('trab-avisos', {
    roles: R, nav: 'trab-avisos', titulo: 'Tablón de avisos',
    render() {
      const t = yo(); const avisos = DB.avisosPara(t.id);
      return P.cabecera({ titulo: 'Tablón de avisos', sub: 'Comunicaciones del coordinador para la plantilla.' }) + `<div class="cuerpo"><section class="bloque">
        <ul class="aviso-lista">${avisos.map(v => { const nuevo = !v.leidos.includes(t.id); return `<li style="${nuevo ? 'border-left:3px solid var(--oro)' : ''}"><b>${esc(v.titulo)}${nuevo ? ' <span class="chip chip-aviso">Nuevo</span>' : ''}</b><p style="margin:6px 0">${esc(v.texto)}</p><span class="tenue">${esc(v.autor)}, ${fecha(v.fecha)} a las ${UI.hora(v.fecha)}. Para ${esc(v.destinatarios.join(', ').toLowerCase())}.</span></li>`; }).join('') || '<li class="tenue">No hay avisos.</li>'}</ul></section></div>`;
    },
    despues() { const t = yo(); let cambio = false; DB.avisosPara(t.id).forEach(v => { if (!v.leidos.includes(t.id)) { v.leidos.push(t.id); cambio = true; } }); if (cambio) DB.guardar(); }
  });

  /* ================= Mi perfil (CU-005, CU-002) ================= */
  P.ruta('trab-perfil', {
    roles: R, nav: 'trab-perfil', titulo: 'Mi perfil',
    render() {
      const t = yo();
      return P.cabecera({ titulo: t.nombre, sub: `${esc(t.zona)}. En la plantilla desde ${fecha(t.alta)}.`, acciones: `<button class="btn" data-act="t-editar">Editar datos y tallas</button>` }) + `<div class="cuerpo"><div class="rejilla-2-igual">
        <section class="bloque"><div class="bloque-cab"><h2>Datos y uniforme</h2></div><div class="bloque-cuerpo"><dl class="datos"><dt>Teléfono</dt><dd class="num">${esc(t.telefono)}</dd><dt>Correo</dt><dd>${esc(t.correo)}</dd><dt>Talla</dt><dd>${esc(t.talla)}</dd><dt>Calzado</dt><dd>${esc(t.calzado)}</dd></dl></div></section>
        <section class="bloque"><div class="bloque-cab"><h2>Capacitaciones</h2><button class="btn btn-pri btn-peq" data-act="t-cap">Solicitar capacitación</button></div><table class="tabla"><tbody>
          ${t.capacitaciones.map(c => `<tr><td><b>${esc(c.rol)}</b><div class="tenue">${esc(DB.DESCRIPCION_FUNCIONES[c.rol] || '')}</div></td><td>${chip(c.estado)}${c.motivo ? `<div class="tenue">${esc(c.motivo)}</div>` : ''}</td></tr>`).join('')}</tbody></table></section>
      </div></div>`;
    }
  });
  P.accion('t-editar', () => { const t = yo(); UI.modal({ titulo: 'Editar datos y tallas', cuerpo: `<div class="form-rejilla">
      <div class="campo"><label for="pt">Teléfono</label><input id="pt" value="${esc(t.telefono)}"></div><div class="campo"><label for="pc">Correo</label><input id="pc" type="email" value="${esc(t.correo)}"></div>
      <div class="campo"><label for="tt">Talla</label><select id="tt">${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(x => `<option ${x === t.talla ? 'selected' : ''}>${x}</option>`).join('')}</select></div><div class="campo"><label for="tc">Calzado</label><input id="tc" type="number" min="35" max="50" value="${t.calzado}"></div></div>`,
    acciones: [{ texto: 'Cancelar' }, { texto: 'Guardar', clase: 'btn-pri', fn: m => { t.telefono = m.querySelector('#pt').value; t.correo = m.querySelector('#pc').value; t.talla = m.querySelector('#tt').value; t.calzado = +m.querySelector('#tc').value; DB.auditar('Actualizar perfil', 'Datos y tallas', 'Correcto', t.nombre); DB.guardar(); UI.toast('Datos guardados'); P.pintar(); } }] }); });
  P.accion('t-cap', () => { const t = yo(); const libres = DB.FUNCIONES.filter(f => !t.capacitaciones.some(c => c.rol === f && c.estado !== 'Rechazada'));
    if (!libres.length) return UI.toast('Ya tienes todas las capacitaciones solicitadas');
    UI.modal({ titulo: 'Solicitar capacitación', cuerpo: `<div class="campo"><label for="cr">Función</label><select id="cr">${libres.map(f => `<option>${f}</option>`).join('')}</select></div><div class="campo"><label for="ce">Tu experiencia</label><textarea id="ce" placeholder="Dónde y cuánto tiempo lo has hecho"></textarea></div>`,
      acciones: [{ texto: 'Cancelar' }, { texto: 'Enviar solicitud', clase: 'btn-pri', fn: m => { const e = m.querySelector('#ce').value.trim(); if (!e) { UI.toast('Cuenta tu experiencia', 'urg'); return false; }
        const rol = m.querySelector('#cr').value; t.capacitaciones = t.capacitaciones.filter(c => c.rol !== rol); t.capacitaciones.push({ rol, estado: 'Pendiente', experiencia: e });
        DB.auditar('Solicitar capacitación', rol, 'Correcto', t.nombre); DB.guardar(); UI.toast('Solicitud enviada al coordinador'); P.pintar(); } }] }); });
})();
