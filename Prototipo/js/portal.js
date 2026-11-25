/* Portal web — núcleo: rutas, sesión, maquetación, acceso */
(function () {
  const { esc, chip } = UI;
  const S = () => DB.s;

  const CIRIO = (h = 30, color = '#C9A24A') => `<svg width="${Math.round(h * .45)}" height="${h}" viewBox="0 0 18 40" aria-hidden="true"><path d="M9 1c2.6 3.4 3.4 5.6 3.4 7.4A3.4 3.4 0 0 1 9 11.8a3.4 3.4 0 0 1-3.4-3.4C5.6 6.6 6.4 4.4 9 1z" fill="${color}"/><rect x="5" y="14" width="8" height="22" rx="1.5" fill="#F4EEDD"/><rect x="2" y="36" width="14" height="3" rx="1" fill="${color}"/></svg>`;

  const P = window.P = {
    rutas: {}, param: '', CIRIO,
    ruta(nombre, def) { P.rutas[nombre] = def; },
    ir(hash) { if (location.hash === '#' + hash) P.pintar(); else location.hash = hash; },
    acciones: {},
    accion(nombre, fn) { P.acciones[nombre] = fn; },
    formularios: {},
    formulario(nombre, fn) { P.formularios[nombre] = fn; },
    sesion() { return S().sesion; },
    entrar(u) {
      S().sesion = { id: u.id, nombre: u.nombre, rol: u.rol, hermandad: u.hermandad || '', trabajador: u.trabajador || '' };
      DB.auditar('Iniciar sesión', 'Portal web', 'Correcto', u.nombre); DB.guardar();
    },
    salir() {
      const s = S().sesion; if (s) DB.auditar('Cerrar sesión', 'Portal web', 'Correcto', s.nombre);
      S().sesion = null; DB.guardar(); P.ir('login');
    },
    /* Encabezado de página */
    cabecera({ titulo, sub = '', miga = '', acciones = '' }) {
      return `<header class="cabecera"><div>${miga ? `<div class="miga">${miga}</div>` : ''}<h1>${esc(titulo)}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div><div class="acciones">${acciones}</div></header>`;
    },
    vacia(t, txt, boton = '') { return `<div class="vacia"><h3>${esc(t)}</h3><p>${txt}</p>${boton ? `<p style="margin-top:14px">${boton}</p>` : ''}</div>`; },
    leerForm(form) { const o = {}; new FormData(form).forEach((v, k) => { if (o[k] !== undefined) o[k] = [].concat(o[k], v); else o[k] = v; }); return o; },
    errorCampo(form, nombre, msg) {
      const el = form.querySelector(`[name="${nombre}"]`); if (!el) return;
      const c = el.closest('.campo'); if (!c) return;
      c.classList.add('invalido');
      let e = c.querySelector('.error'); if (!e) { e = document.createElement('span'); e.className = 'error'; c.appendChild(e); }
      e.textContent = msg;
    },
    limpiarErrores(form) { form.querySelectorAll('.campo.invalido').forEach(c => { c.classList.remove('invalido'); const e = c.querySelector('.error'); if (e) e.remove(); }); },
    /* Descarga de un archivo generado; en el visor de artefactos puede estar bloqueada */
    descargar(nombre, contenido, tipo = 'text/csv') {
      try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob(['﻿' + contenido], { type: tipo + ';charset=utf-8' }));
        a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
      } catch (e) { /* ignorado */ }
    },
    copiar(texto) {
      try { navigator.clipboard.writeText(texto).then(() => UI.toast('Copiado al portapapeles'), () => UI.toast('No se pudo copiar', 'urg')); } catch (e) { UI.toast('No se pudo copiar', 'urg'); }
    }
  };

  /* Navegación por perfil */
  function contadores() {
    const s = S();
    return {
      bajas: s.bajas.filter(b => b.estado === 'Abierta').length,
      acuses: s.cuadrantes.filter(c => c.estado === 'Publicado').reduce((n, c) => n + c.puestos.filter(a => a.acuse === 'Pendiente').length, 0),
      capac: s.trabajadores.reduce((n, t) => n + t.capacitaciones.filter(c => c.estado === 'Pendiente').length, 0),
      presup: s.presupuestos.filter(p => p.estado === 'Enviado').length,
      solic: s.solicitudes.filter(x => x.estado === 'Pendiente de presupuesto').length
    };
  }
  function navCoordinador(activo, esAdmin) {
    const k = contadores();
    const l = (h, t, n, urg) => `<a href="#${h}" class="${activo === h ? 'activo' : ''}">${t}${n ? `<span class="cuenta ${urg ? '' : 'suave'}">${n}</span>` : ''}</a>`;
    return `<span class="nav-grupo">Planificación</span>
      ${l('coord-panel', 'Panel')}
      ${l('coord-eventos', 'Eventos')}
      ${l('coord-cuadrantes', 'Cuadrantes')}
      ${l('coord-bajas', 'Bajas urgentes', k.bajas, true)}
      ${l('coord-acuses', 'Acuses de turno', k.acuses)}
      <span class="nav-grupo">Clientes</span>
      ${l('coord-presupuestos', 'Presupuestos', k.solic)}
      <span class="nav-grupo">Plantilla</span>
      ${l('coord-personal', 'Personal')}
      ${l('coord-capacitaciones', 'Capacitaciones', k.capac)}
      ${l('coord-tablon', 'Tablón de avisos')}
      ${esAdmin ? `<span class="nav-grupo">Administración</span>
      ${l('admin-usuarios', 'Usuarios y permisos')}
      ${l('admin-auditoria', 'Registro de auditoría')}
      ${l('admin-sistema', 'Estado del sistema')}` : ''}`;
  }
  function navHermandad(activo) {
    const l = (h, t) => `<a href="#${h}" class="${activo === h ? 'activo' : ''}">${t}</a>`;
    return `<span class="nav-grupo">Mi hermandad</span>
      ${l('herm-panel', 'Mis solicitudes')}
      ${l('herm-solicitud', 'Solicitar un servicio')}
      ${l('herm-presupuesto', 'Presupuestos')}
      ${l('herm-cuadrante', 'Cuadrante del cortejo')}
      ${l('herm-historial', 'Historial de servicios')}`;
  }

  function navTrabajador(activo) {
    const s = P.sesion(); const of = DB.ofertasPara(s.trabajador).length;
    const sin = DB.avisosPara(s.trabajador).filter(v => !v.leidos.includes(s.trabajador)).length;
    const l = (h, t, n, urg) => `<a href="#${h}" class="${activo === h ? 'activo' : ''}">${t}${n ? `<span class="cuenta ${urg ? '' : 'suave'}">${n}</span>` : ''}</a>`;
    return `<span class="nav-grupo">Mi trabajo</span>
      ${l('trab-turnos', 'Mis turnos', of, true)}
      ${l('trab-cuadrante', 'Cuadrantes')}
      ${l('trab-disponibilidad', 'Disponibilidad')}
      ${l('trab-avisos', 'Tablón de avisos', sin)}
      ${l('trab-perfil', 'Mi perfil')}`;
  }

  function maquetar(def, contenido) {
    const s = P.sesion();
    const sub = s.rol === 'Hermandad' ? (DB.hermandad(s.hermandad) || {}).nombre : s.rol;
    const nav = s.rol === 'Hermandad' ? navHermandad(def.nav) : s.rol === 'Trabajador' ? navTrabajador(def.nav) : navCoordinador(def.nav, s.rol === 'Administrador');
    return `<div class="app">
      <aside class="lateral">
        <div class="marca">${CIRIO(32)}<div><div class="marca-nombre">Chamorro</div><div class="marca-sub">Servicios Cofrades</div></div></div>
        <nav class="nav" aria-label="Secciones">${nav}</nav>
        <div class="usuario"><div class="avatar">${UI.iniciales(s.nombre)}</div><div><div class="usuario-n">${esc(s.nombre)}</div><div class="usuario-r">${esc(sub)}</div></div>
          <button class="icono-btn" data-act="salir" title="Cerrar sesión" aria-label="Cerrar sesión"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg></button></div>
      </aside>
      <main class="principal" id="principal">${contenido}</main>
    </div>`;
  }

  /* Sesión de demostración: si se entra directamente a una pantalla (p. ej. desde la presentación) */
  const DEMO = { Coordinador: 'u1', Administrador: 'u2', Hermandad: 'u3', Trabajador: 'u5' };
  function asegurarSesion(roles) {
    const s = P.sesion();
    if (s && roles.includes(s.rol)) return true;
    const u = S().usuarios.find(x => x.id === DEMO[roles[0]]);
    S().sesion = { id: u.id, nombre: u.nombre, rol: u.rol, hermandad: u.hermandad || '', trabajador: u.trabajador || '' };
    DB.guardar();
    return true;
  }

  P.pintar = function () {
    DB.recargar();
    UI.cerrarModal();
    let h = (location.hash || '').slice(1) || (P.sesion() ? inicio() : 'login');
    let def = P.rutas[h]; P.param = '';
    if (!def) { const i = h.lastIndexOf('-'); if (i > 0 && P.rutas[h.slice(0, i)]) { P.param = h.slice(i + 1); def = P.rutas[h.slice(0, i)]; h = h.slice(0, i); } }
    if (!def) { def = P.rutas[P.sesion() ? inicio() : 'login']; }
    if (h !== 'coord-presupuesto-nuevo' && S().presupuestos.some(p => p.nuevo)) { S().presupuestos = S().presupuestos.filter(p => !p.nuevo); DB.guardar(); }
    const raiz = document.getElementById('raiz');
    if (def.publica) { raiz.innerHTML = def.render(); }
    else { asegurarSesion(def.roles); raiz.innerHTML = maquetar(def, def.render()); }
    document.title = (def.titulo ? def.titulo + ' · ' : '') + 'Chamorro Servicios Cofrades';
    P.entrada = P.actual !== h; P.actual = h;
    if (def.despues) def.despues();
    window.scrollTo(0, 0);
  };
  function inicio() { const s = P.sesion(); return s.rol === 'Hermandad' ? 'herm-panel' : s.rol === 'Trabajador' ? 'trab-turnos' : 'coord-panel'; }
  P.inicio = inicio;

  /* Delegación de eventos */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (b && P.acciones[b.dataset.act]) { e.preventDefault(); P.acciones[b.dataset.act](b, e); }
    const fila = e.target.closest('tr[data-ir]');
    if (fila && !e.target.closest('button, a, input, select')) P.ir(fila.dataset.ir);
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]');
    if (f && P.formularios[f.dataset.form]) { e.preventDefault(); P.limpiarErrores(f); P.formularios[f.dataset.form](f, P.leerForm(f)); }
  });
  document.addEventListener('change', e => {
    const el = e.target.closest('[data-cambio]');
    if (el && P.acciones[el.dataset.cambio]) P.acciones[el.dataset.cambio](el, e);
  });
  window.addEventListener('hashchange', P.pintar);
  window.addEventListener('storage', () => P.pintar());

  P.accion('salir', () => P.salir());
  P.accion('reiniciar', () => { DB.reiniciar(); UI.toast('Datos de demostración restablecidos'); P.ir('login'); });

  /* ---------- Acceso ---------- */
  const arte = (titulo, texto) => `<section class="acceso-arte">
      <div class="marca" style="padding:0;border:0">${CIRIO(34)}<div><div class="marca-nombre">Chamorro</div><div class="marca-sub">Servicios Cofrades</div></div></div>
      <div><h1>${titulo}</h1><p style="margin-top:18px">${texto}</p></div>
      <div class="cirios" aria-hidden="true">${[64, 92, 120, 92, 64].map(h => CIRIO(h, '#C9A24A')).join('')}</div>
    </section>`;

  P.ruta('login', {
    publica: true, titulo: 'Iniciar sesión',
    render: () => `<div class="acceso">
      ${arte('Semana Santa 2027', 'Cuadrantes, sustituciones y presupuestos de los acólitos, pertigueros y auxiliares que acompañan a las hermandades.')}
      <section class="acceso-form"><form class="acceso-caja" data-form="login" novalidate>
        <h2>Iniciar sesión</h2>
        <p class="muted">Entra con tu cuenta de Chamorro: coordinación, hermandades o trabajadores. También puedes usar la app móvil.</p>
        <div class="campo"><label for="correo">Correo electrónico</label><input id="correo" name="correo" type="email" autocomplete="username" required></div>
        <div class="campo"><label for="clave">Contraseña</label><input id="clave" name="clave" type="password" autocomplete="current-password" required></div>
        <button class="btn btn-pri" type="submit" style="padding:11px">Entrar</button>
        <div style="display:flex;justify-content:space-between;font-size:14px"><a href="#recuperar">He olvidado mi contraseña</a><a href="#registro">Registrar una hermandad</a></div>
        <div class="demo">Cuentas de prueba (contraseña <b>demo</b>):
          <button type="button" data-act="demo" data-correo="luis@chamorrocofrades.es">coordinador</button>,
          <button type="button" data-act="demo" data-correo="admin@chamorrocofrades.es">administrador</button>,
          <button type="button" data-act="demo" data-correo="secretaria@hdadestrella.es">hermandad</button>,
          <button type="button" data-act="demo" data-correo="juan.perez@correo.es">trabajador</button>.
          <br><button type="button" data-act="reiniciar">Restablecer datos de demostración</button></div>
      </form></section></div>`
  });
  P.accion('demo', b => {
    const f = document.querySelector('[data-form="login"]');
    f.correo.value = b.dataset.correo; f.clave.value = 'demo';
  });
  P.formulario('login', (f, d) => {
    if (!d.correo) return P.errorCampo(f, 'correo', 'Escribe tu correo.');
    if (!d.clave) return P.errorCampo(f, 'clave', 'Escribe tu contraseña.');
    const u = S().usuarios.find(x => x.correo.toLowerCase() === d.correo.trim().toLowerCase());
    if (!u || u.clave !== d.clave) { DB.auditar('Iniciar sesión', d.correo, 'Fallido: credenciales incorrectas', 'desconocido'); DB.guardar(); return P.errorCampo(f, 'clave', 'El correo o la contraseña no son correctos.'); }
    if (!u.activo) return P.errorCampo(f, 'correo', 'Esta cuenta está desactivada. Contacta con el coordinador.');
    P.entrar(u); P.ir(inicio());
  });

  P.ruta('recuperar', {
    publica: true, titulo: 'Recuperar contraseña',
    render: () => `<div class="acceso">${arte('Recupera el acceso', 'Te enviaremos un enlace para crear una contraseña nueva.')}
      <section class="acceso-form"><form class="acceso-caja" data-form="recuperar" novalidate>
        <h2>Recuperar contraseña</h2>
        <div class="campo"><label for="rc">Correo electrónico de tu cuenta</label><input id="rc" name="correo" type="email" required></div>
        <button class="btn btn-pri" type="submit" style="padding:11px">Enviar enlace</button>
        <a href="#login" style="font-size:14px">Volver a iniciar sesión</a>
      </form></section></div>`
  });
  P.formulario('recuperar', (f, d) => {
    if (!/^\S+@\S+\.\S+$/.test(d.correo || '')) return P.errorCampo(f, 'correo', 'Escribe un correo válido.');
    f.innerHTML = `<h2>Revisa tu correo</h2><p class="muted">Si ${esc(d.correo)} tiene una cuenta, recibirá un enlace válido durante 24 horas.</p><a class="btn" href="#login">Volver a iniciar sesión</a>`;
  });

  /* Registro de hermandad (CU-026) */
  P.ruta('registro', {
    publica: true, titulo: 'Registrar una hermandad',
    render: () => `<div class="acceso">${arte('Alta de hermandad', 'Con la cuenta podréis solicitar servicios, revisar presupuestos y ver qué personal acompañará a vuestro cortejo.')}
      <section class="acceso-form"><form class="acceso-caja" style="max-width:460px" data-form="registro" novalidate>
        <h2>Registrar una hermandad</h2>
        <div class="form-rejilla">
          <div class="campo ancho"><label for="r1">Nombre de la hermandad</label><input id="r1" name="hermandad" placeholder="Hdad. de …" required></div>
          <div class="campo ancho"><label for="r2">Sede canónica</label><input id="r2" name="sede" placeholder="Parroquia, capilla o basílica"></div>
          <div class="campo"><label for="r3">Representante</label><input id="r3" name="nombre" required></div>
          <div class="campo"><label for="r4">Cargo</label><select id="r4" name="cargo"><option>Secretaría</option><option>Mayordomía</option><option>Diputación mayor de gobierno</option><option>Hermano mayor</option></select></div>
          <div class="campo"><label for="r5">Correo electrónico</label><input id="r5" name="correo" type="email" required></div>
          <div class="campo"><label for="r6">Teléfono</label><input id="r6" name="telefono" type="tel"></div>
          <div class="campo"><label for="r7">Contraseña</label><input id="r7" name="clave" type="password" required></div>
          <div class="campo"><label for="r8">Repite la contraseña</label><input id="r8" name="clave2" type="password" required></div>
          <div class="campo ancho"><label class="check"><input type="checkbox" name="acepto"> Acepto las condiciones del servicio y la política de privacidad</label></div>
        </div>
        <button class="btn btn-pri" type="submit" style="padding:11px">Crear cuenta</button>
        <a href="#login" style="font-size:14px">Ya tengo cuenta</a>
      </form></section></div>`
  });
  P.formulario('registro', (f, d) => {
    let ok = true;
    const err = (k, m) => { P.errorCampo(f, k, m); ok = false; };
    if (!d.hermandad?.trim()) err('hermandad', 'Indica el nombre de la hermandad.');
    if (!d.nombre?.trim()) err('nombre', 'Indica quién la representa.');
    if (!/^\S+@\S+\.\S+$/.test(d.correo || '')) err('correo', 'Escribe un correo válido.');
    else if (S().usuarios.some(u => u.correo === d.correo)) err('correo', 'Ya existe una cuenta con este correo.');
    if ((d.clave || '').length < 8) err('clave', 'Usa al menos 8 caracteres.');
    if (d.clave !== d.clave2) err('clave2', 'Las contraseñas no coinciden.');
    if (!d.acepto) err('acepto', 'Tienes que aceptar las condiciones.');
    if (!ok) return;
    const h = { id: DB.id('h'), nombre: d.hermandad.trim(), sede: d.sede || '', contacto: d.nombre, telefono: d.telefono || '' };
    const u = { id: DB.id('u'), nombre: d.nombre.trim(), correo: d.correo.trim(), rol: 'Hermandad', hermandad: h.id, activo: true, clave: d.clave };
    S().hermandades.push(h); S().usuarios.push(u);
    DB.auditar('Registrar hermandad', h.nombre, 'Correcto', u.nombre);
    P.entrar(u); UI.toast('Cuenta creada. Ya podéis solicitar servicios.'); P.ir('herm-panel');
  });
})();
