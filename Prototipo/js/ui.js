/* Utilidades de interfaz compartidas por el portal y la app HTML */
(function () {
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  const UI = {
    esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    fecha(iso) { if (!iso) return '—'; const [y, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${y}`; },
    fechaLarga(iso) { const d = new Date(iso.slice(0, 10) + 'T12:00'); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES_L[d.getMonth()]}`; },
    diaCorto(iso) { const d = new Date(iso + 'T12:00'); return { dia: d.getDate(), mes: MESES[d.getMonth()], semana: DIAS[d.getDay()].slice(0, 3) }; },
    euros(n) { return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); },
    hora(f) { return f && f.length > 10 ? f.slice(11) : ''; },

    estadoClase(e) {
      const m = {
        'Aprobada': 'ok', 'Confirmado': 'ok', 'Aceptado': 'ok', 'Publicado': 'ok', 'Con servicio': 'ok', 'Cubierta': 'ok', 'Resuelta': 'ok', 'Correcto': 'ok', 'Activa': 'ok', 'Cuadrante publicado': 'ok', 'Finalizado': 'neutro', 'Aceptada': 'ok',
        'Pendiente': 'aviso', 'Enviado': 'info', 'Borrador': 'neutro', 'Presupuesto enviado': 'info', 'Pendiente de solicitud': 'neutro', 'Pendiente de presupuesto': 'aviso', 'Presupuesto rechazado': 'urgente', 'Presupuesto aceptado': 'info', 'Enviada': 'info', 'Abierta': 'urgente', 'En revisión': 'aviso',
        'Rechazada': 'urgente', 'Rechazado': 'urgente', 'Baja': 'urgente', 'Cancelado': 'urgente', 'Sin cubrir': 'urgente', 'Inactiva': 'neutro', 'Caducada': 'neutro'
      };
      if (/^Fallido/.test(e)) return 'urgente';
      return m[e] || 'neutro';
    },
    chip(e, texto) { return `<span class="chip chip-${UI.estadoClase(e)}">${UI.esc(texto || e)}</span>`; },

    toast(msg, tipo = 'ok') {
      let zona = document.getElementById('toasts');
      if (!zona) { zona = document.createElement('div'); zona.id = 'toasts'; zona.setAttribute('role', 'status'); zona.setAttribute('aria-live', 'polite'); document.body.appendChild(zona); }
      const el = document.createElement('div');
      el.className = `toast toast-${tipo}`; el.textContent = msg;
      zona.appendChild(el);
      setTimeout(() => el.classList.add('fuera'), 2800);
      setTimeout(() => el.remove(), 3300);
    },

    /* Diálogo modal propio (alert/confirm están bloqueados en el visor) */
    modal({ titulo, cuerpo, acciones = [], ancho }) {
      UI.cerrarModal();
      const fondo = document.createElement('div');
      fondo.className = 'modal-fondo'; fondo.id = 'modal';
      fondo.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-t" ${ancho ? `style="max-width:${ancho}px"` : ''}>
        <div class="modal-cab"><h2 id="modal-t">${UI.esc(titulo)}</h2><button class="icono-btn" data-cerrar aria-label="Cerrar">✕</button></div>
        <div class="modal-cuerpo">${cuerpo}</div>
        <div class="modal-pie">${acciones.map((a, i) => `<button class="btn ${a.clase || 'btn-sec'}" data-accion="${i}">${UI.esc(a.texto)}</button>`).join('')}</div>
      </div>`;
      document.body.appendChild(fondo);
      fondo.addEventListener('click', e => {
        if (e.target === fondo || e.target.closest('[data-cerrar]')) UI.cerrarModal();
        const b = e.target.closest('[data-accion]');
        if (b) { const a = acciones[+b.dataset.accion]; if (!a.fn || a.fn(fondo) !== false) UI.cerrarModal(); }
      });
      document.addEventListener('keydown', UI._esc);
      const primero = fondo.querySelector('input, select, textarea, .btn-pri');
      if (primero) primero.focus();
      return fondo;
    },
    _esc(e) { if (e.key === 'Escape') UI.cerrarModal(); },
    cerrarModal() { const m = document.getElementById('modal'); if (m) m.remove(); document.removeEventListener('keydown', UI._esc); },

    iniciales(n) { return n.split(' ').map(p => p[0]).slice(0, 2).join(''); }
  };
  window.UI = UI;
})();
