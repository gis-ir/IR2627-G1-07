/* Chamorro Servicios Cofrades — datos simulados del prototipo.
   Compartido por el portal web (coordinador, administrador, hermandades)
   y la versión HTML de la app del trabajador. Se guarda en localStorage
   para que los cambios de un perfil se vean en el otro. */
(function () {
  const CLAVE = 'csc-prototipo-v1';
  const HOY = '2027-03-15';

  const FUNCIONES = ['Acólito de cirial', 'Acólito incensario', 'Pertiguero', 'Aguador', 'Encendedor', 'Auxiliar de cortejo'];

  function semilla() {
    return {
      hoy: HOY,
      tarifas: {
        'Acólito de cirial': 14, 'Acólito incensario': 15, 'Pertiguero': 18,
        'Aguador': 12, 'Encendedor': 12, 'Auxiliar de cortejo': 13
      },
      usuarios: [
        { id: 'u1', nombre: 'Luis Chamorro', correo: 'luis@chamorrocofrades.es', rol: 'Coordinador', activo: true, clave: 'demo' },
        { id: 'u2', nombre: 'Marta Chamorro', correo: 'admin@chamorrocofrades.es', rol: 'Administrador', activo: true, clave: 'demo' },
        { id: 'u3', nombre: 'Rafael Ortega', correo: 'secretaria@hdadestrella.es', rol: 'Hermandad', hermandad: 'h1', activo: true, clave: 'demo' },
        { id: 'u4', nombre: 'Inmaculada Ríos', correo: 'mayordomia@sangonzalo.es', rol: 'Hermandad', hermandad: 'h2', activo: true, clave: 'demo' },
        { id: 'u5', nombre: 'Juan Pérez', correo: 'juan.perez@correo.es', rol: 'Trabajador', trabajador: 't1', activo: true, clave: 'demo' },
        { id: 'u6', nombre: 'Carlos Benítez', correo: 'carlos.b@correo.es', rol: 'Trabajador', trabajador: 't3', activo: true, clave: 'demo' },
        { id: 'u7', nombre: 'Pedro Lara', correo: 'pedro.lara@correo.es', rol: 'Trabajador', trabajador: 't9', activo: false, clave: 'demo' }
      ],
      hermandades: [
        { id: 'h1', nombre: 'Hdad. de la Estrella', sede: 'Capilla de la Estrella (Triana)', contacto: 'Rafael Ortega', telefono: '954 33 12 40' },
        { id: 'h2', nombre: 'Hdad. de San Gonzalo', sede: 'Parroquia de San Gonzalo (Triana)', contacto: 'Inmaculada Ríos', telefono: '954 34 21 08' },
        { id: 'h3', nombre: 'Hdad. de la Macarena', sede: 'Basílica de la Macarena', contacto: 'José M. Vela', telefono: '954 90 18 00' },
        { id: 'h4', nombre: 'Hdad. de los Gitanos', sede: 'Santuario de los Gitanos', contacto: 'Antonio Heredia', telefono: '954 41 70 22' },
        { id: 'h5', nombre: 'Hdad. del Cerro', sede: 'Parroquia de los Dolores (Cerro del Águila)', contacto: 'Lucía Márquez', telefono: '954 63 55 19' },
        { id: 'h6', nombre: 'Hdad. de Santa Genoveva', sede: 'Parroquia de Santa Genoveva (Tiro de Línea)', contacto: 'Fernando Gil', telefono: '954 69 02 11' }
      ],
      trabajadores: [
        { id: 't1', nombre: 'Juan Pérez', telefono: '611 203 455', correo: 'juan.perez@correo.es', zona: 'Triana', talla: 'M', calzado: 43, alta: '2023-02-10',
          capacitaciones: [{ rol: 'Acólito de cirial', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Acólito incensario', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Pertiguero', estado: 'Pendiente', experiencia: 'Tres años de pertiguero en la Hdad. de la O.' }],
          disponibilidad: { '2027-03-21': ['tarde', 'noche'], '2027-03-22': ['tarde', 'noche'], '2027-03-23': ['mañana'], '2027-03-24': ['tarde'], '2027-03-25': ['tarde', 'noche'], '2027-03-26': ['mañana', 'tarde', 'noche'] } },
        { id: 't2', nombre: 'Manuel Ruiz', telefono: '622 118 902', correo: 'manuel.ruiz@correo.es', zona: 'Los Remedios', talla: 'L', calzado: 44, alta: '2022-01-15',
          capacitaciones: [{ rol: 'Acólito de cirial', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Encendedor', estado: 'Aprobada', por: 'Luis Chamorro' }],
          disponibilidad: { '2027-03-21': ['tarde'], '2027-03-22': ['tarde', 'noche'], '2027-03-25': ['noche'], '2027-03-26': ['noche'] } },
        { id: 't3', nombre: 'Carlos Benítez', telefono: '633 450 771', correo: 'carlos.b@correo.es', zona: 'Centro', talla: 'M', calzado: 42, alta: '2024-03-01',
          capacitaciones: [{ rol: 'Acólito incensario', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Aguador', estado: 'Aprobada', por: 'Luis Chamorro' }],
          disponibilidad: { '2027-03-21': ['tarde', 'noche'], '2027-03-22': ['tarde', 'noche'], '2027-03-24': ['tarde', 'noche'] } },
        { id: 't4', nombre: 'Antonio Gómez', telefono: '644 909 120', correo: 'agomez@correo.es', zona: 'Triana', talla: 'XL', calzado: 45, alta: '2019-02-20',
          capacitaciones: [{ rol: 'Pertiguero', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Acólito de cirial', estado: 'Aprobada', por: 'Luis Chamorro' }],
          disponibilidad: { '2027-03-21': ['tarde', 'noche'], '2027-03-23': ['tarde', 'noche'], '2027-03-25': ['tarde', 'noche'] } },
        { id: 't5', nombre: 'Pablo Sanz', telefono: '655 321 004', correo: 'psanz@correo.es', zona: 'Triana', talla: 'S', calzado: 41, alta: '2025-01-12',
          capacitaciones: [{ rol: 'Acólito de cirial', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Auxiliar de cortejo', estado: 'Aprobada', por: 'Luis Chamorro' }],
          disponibilidad: { '2027-03-21': ['tarde', 'noche'], '2027-03-22': ['tarde', 'noche'], '2027-03-26': ['tarde'] } },
        { id: 't6', nombre: 'Álvaro Moreno', telefono: '666 774 230', correo: 'amoreno@correo.es', zona: 'Nervión', talla: 'M', calzado: 42, alta: '2024-11-03',
          capacitaciones: [{ rol: 'Acólito de cirial', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Acólito incensario', estado: 'Pendiente', experiencia: 'Monaguillo en la parroquia de San Bernardo desde niño.' }],
          disponibilidad: { '2027-03-22': ['tarde', 'noche'], '2027-03-23': ['tarde', 'noche'], '2027-03-24': ['tarde', 'noche'] } },
        { id: 't7', nombre: 'Javier Torres', telefono: '677 002 918', correo: 'jtorres@correo.es', zona: 'Macarena', talla: 'L', calzado: 43, alta: '2021-03-08',
          capacitaciones: [{ rol: 'Aguador', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Encendedor', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Pertiguero', estado: 'Rechazada', por: 'Luis Chamorro', motivo: 'Sin experiencia acreditada' }],
          disponibilidad: { '2027-03-21': ['noche'], '2027-03-22': ['noche'], '2027-03-26': ['mañana', 'noche'] } },
        { id: 't8', nombre: 'Sergio Navarro', telefono: '688 515 377', correo: 'snavarro@correo.es', zona: 'Cerro del Águila', talla: 'M', calzado: 42, alta: '2023-12-01',
          capacitaciones: [{ rol: 'Auxiliar de cortejo', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Aguador', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Acólito de cirial', estado: 'Pendiente', experiencia: 'Acólito en su hermandad durante cuatro años.' }],
          disponibilidad: { '2027-03-21': ['noche'], '2027-03-22': ['tarde'], '2027-03-23': ['tarde', 'noche'] } },
        { id: 't9', nombre: 'Pedro Lara', telefono: '699 230 115', correo: 'pedro.lara@correo.es', zona: 'Triana', talla: 'L', calzado: 44, alta: '2020-02-02', baja: true,
          capacitaciones: [{ rol: 'Acólito incensario', estado: 'Aprobada', por: 'Luis Chamorro' }],
          disponibilidad: {} },
        { id: 't10', nombre: 'Diego Castaño', telefono: '610 884 562', correo: 'dcastano@correo.es', zona: 'Los Remedios', talla: 'M', calzado: 43, alta: '2022-02-19',
          capacitaciones: [{ rol: 'Acólito incensario', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Aguador', estado: 'Aprobada', por: 'Luis Chamorro' }, { rol: 'Pertiguero', estado: 'Pendiente', experiencia: 'Pertiguero suplente en la Hdad. del Baratillo.' }],
          disponibilidad: { '2027-03-21': ['tarde', 'noche'], '2027-03-22': ['tarde', 'noche'] } }
      ],
      eventos: [
        { id: 'e1', nombre: 'Domingo de Ramos', clase: 'Salida procesional', hermandad: 'h1', inicio: '2027-03-21', fin: '2027-03-21', franja: '14:00 – 01:30', situacion: 'Con servicio', notas: 'Citación en la capilla. Dalmática roja.' },
        { id: 'e2', nombre: 'Lunes Santo', clase: 'Salida procesional', hermandad: 'h2', inicio: '2027-03-22', fin: '2027-03-22', franja: '14:00 – 23:30', situacion: 'Con servicio', notas: 'Dalmática blanca y cíngulo.' },
        { id: 'e3', nombre: 'Madrugá', clase: 'Salida procesional', hermandad: 'h3', inicio: '2027-03-26', fin: '2027-03-26', franja: '00:00 – 14:00', situacion: 'Presupuesto enviado', notas: '' },
        { id: 'e4', nombre: 'Besamanos de la Virgen', clase: 'Acto de culto', hermandad: 'h4', inicio: '2027-03-12', fin: '2027-03-13', franja: '10:00 – 21:00', situacion: 'Con servicio', notas: 'Turnos de mañana y tarde.' },
        { id: 'e5', nombre: 'Martes Santo', clase: 'Salida procesional', hermandad: 'h5', inicio: '2027-03-23', fin: '2027-03-23', franja: '15:00 – 00:30', situacion: 'Pendiente de solicitud', notas: '' },
        { id: 'e6', nombre: 'Vía Crucis del Consejo', clase: 'Otro acto', hermandad: '', inicio: '2027-03-01', fin: '2027-03-01', franja: '19:00 – 22:00', situacion: 'Cancelado', notas: 'Suspendido por lluvia.' }
      ],
      solicitudes: [
        { id: 's1', hermandad: 'h1', evento: 'e1', acto: 'Estación de penitencia, Domingo de Ramos', fecha: '2027-03-21', horario: '14:15 – 01:30', funciones: [{ funcion: 'Acólito de cirial', cantidad: 4 }, { funcion: 'Pertiguero', cantidad: 1 }, { funcion: 'Aguador', cantidad: 2 }], estado: 'Cuadrante publicado', creada: '2027-01-20' },
        { id: 's2', hermandad: 'h2', evento: 'e2', acto: 'Estación de penitencia, Lunes Santo', fecha: '2027-03-22', horario: '14:00 – 23:30', funciones: [{ funcion: 'Acólito de cirial', cantidad: 4 }, { funcion: 'Acólito incensario', cantidad: 2 }, { funcion: 'Pertiguero', cantidad: 1 }], estado: 'Presupuesto aceptado', creada: '2027-01-28' },
        { id: 's3', hermandad: 'h3', evento: 'e3', acto: 'Estación de penitencia, Madrugá', fecha: '2027-03-26', horario: '00:00 – 14:00', funciones: [{ funcion: 'Acólito de cirial', cantidad: 6 }, { funcion: 'Acólito incensario', cantidad: 2 }, { funcion: 'Aguador', cantidad: 3 }], estado: 'Presupuesto enviado', creada: '2027-02-05' },
        { id: 's4', hermandad: 'h1', evento: '', acto: 'Función principal de instituto', fecha: '2027-04-18', horario: '11:00 – 14:00', funciones: [{ funcion: 'Acólito de cirial', cantidad: 2 }, { funcion: 'Acólito incensario', cantidad: 1 }], estado: 'Presupuesto enviado', creada: '2027-03-02' },
        { id: 's5', hermandad: 'h5', evento: 'e5', acto: 'Estación de penitencia, Martes Santo', fecha: '2027-03-23', horario: '15:00 – 00:30', funciones: [{ funcion: 'Acólito de cirial', cantidad: 4 }, { funcion: 'Auxiliar de cortejo', cantidad: 2 }], estado: 'Pendiente de presupuesto', creada: '2027-03-10' },
        { id: 's6', hermandad: 'h1', evento: '', acto: 'Besamanos de la Virgen de la Estrella', fecha: '2027-04-10', horario: '10:00 – 21:00', funciones: [{ funcion: 'Auxiliar de cortejo', cantidad: 2 }], estado: 'Presupuesto rechazado', creada: '2027-02-20' },
        { id: 's9', hermandad: 'h1', evento: '', acto: 'Besamanos de la Virgen de la Estrella', fecha: '2026-12-08', horario: '10:00 – 21:00', funciones: [{ funcion: 'Auxiliar de cortejo', cantidad: 2 }], estado: 'Finalizado', creada: '2026-11-10' },
        { id: 's8', hermandad: 'h6', evento: '', acto: 'Estación de penitencia, Lunes Santo', fecha: '2027-03-22', horario: '13:30 – 22:00', funciones: [{ funcion: 'Acólito incensario', cantidad: 1 }, { funcion: 'Auxiliar de cortejo', cantidad: 1 }], estado: 'Cuadrante publicado', creada: '2027-01-30' },
        { id: 's7', hermandad: 'h1', evento: '', acto: 'Estación de penitencia, Domingo de Ramos', fecha: '2026-03-29', horario: '14:15 – 01:30', funciones: [{ funcion: 'Acólito de cirial', cantidad: 4 }, { funcion: 'Pertiguero', cantidad: 1 }], estado: 'Finalizado', creada: '2026-01-18' }
      ],
      presupuestos: [
        { id: 'p1', codigo: 'PRE-2027-014', solicitud: 's1', version: 1, iva: 21, estado: 'Aceptado', enviado: '2027-01-25', respuesta: '2027-01-29', exportado: true,
          lineas: [{ funcion: 'Acólito de cirial', cantidad: 4, horas: 11, tarifa: 14 }, { funcion: 'Pertiguero', cantidad: 1, horas: 11, tarifa: 18 }, { funcion: 'Aguador', cantidad: 2, horas: 11, tarifa: 12 }] },
        { id: 'p2', codigo: 'PRE-2027-017', solicitud: 's2', version: 2, iva: 21, estado: 'Aceptado', enviado: '2027-02-03', respuesta: '2027-02-06', exportado: false,
          lineas: [{ funcion: 'Acólito de cirial', cantidad: 4, horas: 9.5, tarifa: 14 }, { funcion: 'Acólito incensario', cantidad: 2, horas: 9.5, tarifa: 15 }, { funcion: 'Pertiguero', cantidad: 1, horas: 9.5, tarifa: 18 }] },
        { id: 'p3', codigo: 'PRE-2027-021', solicitud: 's3', version: 1, iva: 21, estado: 'Enviado', enviado: '2027-02-12', respuesta: '', exportado: false,
          lineas: [{ funcion: 'Acólito de cirial', cantidad: 6, horas: 14, tarifa: 14 }, { funcion: 'Acólito incensario', cantidad: 2, horas: 14, tarifa: 15 }, { funcion: 'Aguador', cantidad: 3, horas: 14, tarifa: 12 }] },
        { id: 'p4', codigo: 'PRE-2027-026', solicitud: 's4', version: 1, iva: 21, estado: 'Enviado', enviado: '2027-03-06', respuesta: '', exportado: false,
          lineas: [{ funcion: 'Acólito de cirial', cantidad: 2, horas: 3, tarifa: 14 }, { funcion: 'Acólito incensario', cantidad: 1, horas: 3, tarifa: 15 }] },
        { id: 'p6', codigo: 'PRE-2027-018', solicitud: 's8', version: 1, iva: 21, estado: 'Aceptado', enviado: '2027-02-04', respuesta: '2027-02-08', exportado: true,
          lineas: [{ funcion: 'Acólito incensario', cantidad: 1, horas: 8.5, tarifa: 15 }, { funcion: 'Auxiliar de cortejo', cantidad: 1, horas: 8.5, tarifa: 13 }] },
        { id: 'p7', codigo: 'PRE-2026-031', solicitud: 's9', version: 1, iva: 21, estado: 'Aceptado', enviado: '2026-11-12', respuesta: '2026-11-14', exportado: true,
          lineas: [{ funcion: 'Auxiliar de cortejo', cantidad: 2, horas: 11, tarifa: 13 }] },
        { id: 'p8', codigo: 'PRE-2026-004', solicitud: 's7', version: 1, iva: 21, estado: 'Aceptado', enviado: '2026-01-22', respuesta: '2026-01-26', exportado: true,
          lineas: [{ funcion: 'Acólito de cirial', cantidad: 4, horas: 11, tarifa: 13 }, { funcion: 'Pertiguero', cantidad: 1, horas: 11, tarifa: 17 }] },
        { id: 'p5', codigo: 'PRE-2027-009', solicitud: 's6', version: 1, iva: 21, estado: 'Rechazado', enviado: '2027-02-24', respuesta: '2027-02-27', motivo: 'Importe por encima de lo previsto', exportado: false,
          lineas: [{ funcion: 'Auxiliar de cortejo', cantidad: 2, horas: 11, tarifa: 15 }] }
      ],
      cuadrantes: [
        { id: 'c1', presupuesto: 'p1', estado: 'Publicado', publicado: '2027-03-08', plazoAcuse: '2027-03-17',
          puestos: [
            { id: 'a1', puesto: 'Acólito de cirial 1', funcion: 'Acólito de cirial', horario: '14:15 – 01:30', trabajador: 't1', acuse: 'Pendiente' },
            { id: 'a2', puesto: 'Acólito de cirial 2', funcion: 'Acólito de cirial', horario: '14:15 – 01:30', trabajador: 't5', acuse: 'Confirmado' },
            { id: 'a3', puesto: 'Acólito de cirial 3', funcion: 'Acólito de cirial', horario: '14:15 – 01:30', trabajador: 't2', acuse: 'Confirmado' },
            { id: 'a4', puesto: 'Acólito de cirial 4', funcion: 'Acólito de cirial', horario: '14:15 – 01:30', trabajador: 't6', acuse: 'Pendiente' },
            { id: 'a5', puesto: 'Pertiguero', funcion: 'Pertiguero', horario: '14:15 – 01:30', trabajador: 't4', acuse: 'Confirmado' },
            { id: 'a6', puesto: 'Aguador 1', funcion: 'Aguador', horario: '14:15 – 01:30', trabajador: 't7', acuse: 'Confirmado' },
            { id: 'a7', puesto: 'Aguador 2', funcion: 'Aguador', horario: '14:15 – 01:30', trabajador: 't3', acuse: 'Baja' }
          ] },
        { id: 'c2', presupuesto: 'p2', estado: 'Borrador', publicado: '', plazoAcuse: '2027-03-19',
          puestos: [
            { id: 'a11', puesto: 'Acólito de cirial 1', funcion: 'Acólito de cirial', horario: '14:00 – 23:30', trabajador: 't1', acuse: 'Pendiente' },
            { id: 'a12', puesto: 'Acólito de cirial 2', funcion: 'Acólito de cirial', horario: '14:00 – 23:30', trabajador: 't2', acuse: 'Pendiente' },
            { id: 'a13', puesto: 'Acólito de cirial 3', funcion: 'Acólito de cirial', horario: '14:00 – 23:30', trabajador: 't5', acuse: 'Pendiente' },
            { id: 'a14', puesto: 'Acólito de cirial 4', funcion: 'Acólito de cirial', horario: '14:00 – 23:30', trabajador: 't6', acuse: 'Pendiente' },
            { id: 'a15', puesto: 'Acólito incensario 1', funcion: 'Acólito incensario', horario: '14:00 – 23:30', trabajador: 't3', acuse: 'Pendiente' },
            { id: 'a16', puesto: 'Acólito incensario 2', funcion: 'Acólito incensario', horario: '14:00 – 23:30', trabajador: 't10', acuse: 'Pendiente' },
            { id: 'a17', puesto: 'Pertiguero', funcion: 'Pertiguero', horario: '14:00 – 23:30', trabajador: '', acuse: 'Pendiente' }
          ] },
        { id: 'c3', presupuesto: 'p6', estado: 'Publicado', publicado: '2027-03-09', plazoAcuse: '2027-03-18',
          puestos: [
            { id: 'a21', puesto: 'Acólito incensario', funcion: 'Acólito incensario', horario: '13:30 – 22:00', trabajador: 't3', acuse: 'Baja' },
            { id: 'a22', puesto: 'Auxiliar de cortejo', funcion: 'Auxiliar de cortejo', horario: '13:30 – 22:00', trabajador: 't8', acuse: 'Pendiente' }
          ] }
      ],
      bajas: [
        { id: 'b1', cuadrante: 'c1', puesto: 'a7', trabajador: 't3', motivo: 'Enfermedad', explicacion: 'Fiebre alta desde anoche.', fecha: '2027-03-15 09:12', estado: 'Abierta', ofertas: [], sustituto: '' },
        { id: 'b2', cuadrante: 'c3', puesto: 'a21', trabajador: 't3', motivo: 'Enfermedad', explicacion: 'Fiebre alta desde anoche. Tampoco podré el Lunes Santo.', fecha: '2027-03-15 09:15', estado: 'Abierta', sustituto: '',
          ofertas: [{ trabajador: 't1', estado: 'Enviada', enviada: '2027-03-15 09:40', caduca: '2027-03-15 21:40' }, { trabajador: 't10', estado: 'Rechazada', enviada: '2027-03-15 09:40', caduca: '2027-03-15 21:40' }] }
      ],
      avisos: [
        { id: 'v1', titulo: 'Recogida de uniformes', texto: 'La recogida de dalmáticas y cíngulos será en el almacén de la calle Pureza el lunes 8 de marzo, de 18:00 a 20:00. Traed el DNI.', destinatarios: ['Todos'], fecha: '2027-03-05 12:30', autor: 'Luis Chamorro', push: true, leidos: ['t2', 't4'] },
        { id: 'v2', titulo: 'Reunión de pertigueros', texto: 'El jueves a las 20:30 nos reunimos en la Capilla de la Estrella para repasar los recorridos de esta Semana Santa.', destinatarios: ['Pertiguero'], fecha: '2027-03-03 10:05', autor: 'Luis Chamorro', push: false, leidos: ['t1', 't4'] },
        { id: 'v3', titulo: 'Plazo para confirmar turnos', texto: 'Recordad confirmar la recepción de vuestros turnos de Domingo de Ramos antes del miércoles 17. Los turnos sin confirmar se reasignarán.', destinatarios: ['Todos'], fecha: '2027-03-12 18:00', autor: 'Luis Chamorro', push: true, leidos: [] }
      ],
      incidencias: [
        { id: 'i1', hermandad: 'h4', cuadrante: '', tipo: 'Retraso en la citación', descripcion: 'Un auxiliar llegó 20 minutos tarde al turno de tarde del besamanos.', fecha: '2027-03-13', estado: 'Resuelta' }
      ],
      notificaciones: [
        { id: 'n1', trabajador: 't1', titulo: 'Cobertura urgente', texto: 'Se busca acólito incensario para la Hdad. de Santa Genoveva el Lunes Santo.', tipo: 'urgente', ref: 'b2', fecha: '2027-03-15 09:40', leida: false },
        { id: 'n2', trabajador: 't1', titulo: 'Cuadrante publicado', texto: 'Tienes turno el Domingo de Ramos con la Hdad. de la Estrella. Confirma la recepción.', tipo: 'turno', ref: 'a1', fecha: '2027-03-08 16:45', leida: true }
      ],
      auditoria: [
        { fecha: '2027-03-15 09:12', usuario: 'Carlos Benítez', accion: 'Comunicar baja', elemento: 'Aguador 2, Domingo de Ramos', resultado: 'Correcto' },
        { fecha: '2027-03-14 19:40', usuario: 'Juan Pérez', accion: 'Iniciar sesión', elemento: 'App móvil', resultado: 'Correcto' },
        { fecha: '2027-03-14 17:03', usuario: 'desconocido', accion: 'Iniciar sesión', elemento: 'luis@chamorrocofrades.es', resultado: 'Fallido: contraseña incorrecta' },
        { fecha: '2027-03-13 11:20', usuario: 'Marta Chamorro', accion: 'Desactivar cuenta', elemento: 'Pedro Lara', resultado: 'Correcto' },
        { fecha: '2027-03-08 16:45', usuario: 'Luis Chamorro', accion: 'Publicar cuadrante', elemento: 'Hdad. de la Estrella, Domingo de Ramos', resultado: 'Correcto' },
        { fecha: '2027-03-06 10:02', usuario: 'Luis Chamorro', accion: 'Enviar presupuesto', elemento: 'PRE-2027-026', resultado: 'Correcto' }
      ],
      sesion: null
    };
  }

  let estado;
  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      estado = raw ? JSON.parse(raw) : semilla();
    } catch (e) { estado = semilla(); }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento: los cambios duran hasta recargar */ }
  }
  cargar();

  const pad = n => String(n).padStart(2, '0');
  function ahora() {
    const d = new Date();
    return `${estado.hoy} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const DB = {
    FUNCIONES,
    get s() { return estado; },
    guardar,
    reiniciar() { estado = semilla(); guardar(); },
    recargar() { cargar(); },
    ahora,
    id(prefijo) { return prefijo + Math.random().toString(36).slice(2, 8); },
    trabajador(id) { return estado.trabajadores.find(t => t.id === id); },
    hermandad(id) { return estado.hermandades.find(h => h.id === id); },
    solicitud(id) { return estado.solicitudes.find(s => s.id === id); },
    presupuesto(id) { return estado.presupuestos.find(p => p.id === id); },
    cuadrante(id) { return estado.cuadrantes.find(c => c.id === id); },
    presupuestoDeSolicitud(sid) { return estado.presupuestos.filter(p => p.solicitud === sid).sort((a, b) => b.version - a.version)[0]; },
    cuadranteDePresupuesto(pid) { return estado.cuadrantes.find(c => c.presupuesto === pid); },
    totales(p) {
      const base = p.lineas.reduce((s, l) => s + l.cantidad * l.horas * l.tarifa, 0);
      const iva = base * p.iva / 100;
      return { base, iva, total: base + iva };
    },
    auditar(accion, elemento, resultado = 'Correcto', usuario) {
      const u = usuario || (estado.sesion ? estado.sesion.nombre : 'desconocido');
      estado.auditoria.unshift({ fecha: ahora(), usuario: u, accion, elemento, resultado });
    },
    notificar(trabajador, titulo, texto, tipo = 'info', ref = '') {
      estado.notificaciones.unshift({ id: DB.id('n'), trabajador, titulo, texto, tipo, ref, fecha: ahora(), leida: false });
    },
    habilitado(t, funcion) { return t.capacitaciones.some(c => c.rol === funcion && c.estado === 'Aprobada'); },
    /* Turnos asignados a un trabajador en cuadrantes publicados */
    turnosDe(tid) {
      const out = [];
      estado.cuadrantes.forEach(c => {
        if (c.estado !== 'Publicado') return;
        const p = DB.presupuesto(c.presupuesto); const s = DB.solicitud(p.solicitud); const h = DB.hermandad(s.hermandad);
        c.puestos.forEach(a => { if (a.trabajador === tid) out.push({ cuadrante: c, asignacion: a, solicitud: s, hermandad: h }); });
      });
      return out.sort((x, y) => x.solicitud.fecha.localeCompare(y.solicitud.fecha));
    },
    /* Candidatos para cubrir una vacante: habilitados, disponibles ese día, sin otro turno */
    candidatos(cuadrante, asignacion) {
      const p = DB.presupuesto(cuadrante.presupuesto); const s = DB.solicitud(p.solicitud);
      const ocupados = new Set();
      estado.cuadrantes.forEach(c => { if (c.estado !== 'Publicado') return; const sp = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud); if (sp.fecha === s.fecha) c.puestos.forEach(a => a.trabajador && ocupados.add(a.trabajador)); });
      const zonaSede = (DB.hermandad(s.hermandad).sede.match(/\(([^)]+)\)/) || [])[1] || '';
      return estado.trabajadores
        .filter(t => !t.baja && DB.habilitado(t, asignacion.funcion) && !ocupados.has(t.id))
        .map(t => {
          const disp = (t.disponibilidad[s.fecha] || []).length > 0;
          const km = t.zona === zonaSede ? 0.8 : ({ 'Triana': 1.5, 'Los Remedios': 2.1, 'Centro': 2.4, 'Macarena': 3.6, 'Nervión': 4.2, 'Cerro del Águila': 6.3 }[t.zona] || 5);
          return { t, disp, km, puntos: (disp ? 50 : 0) + Math.round(30 - km * 3) };
        })
        .sort((a, b) => b.puntos - a.puntos);
    },
    /* Propuesta automática para un cuadrante a partir del presupuesto aceptado */
    proponer(cuadrante) {
      const p = DB.presupuesto(cuadrante.presupuesto); const s = DB.solicitud(p.solicitud);
      const usados = new Set();
      estado.cuadrantes.forEach(c => { if (c.id === cuadrante.id) return; const sp = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud); if (sp.fecha === s.fecha) c.puestos.forEach(a => a.trabajador && usados.add('otro:' + a.trabajador)); });
      const puestos = [];
      s.funciones.forEach(f => {
        for (let i = 1; i <= f.cantidad; i++) {
          const nombre = f.cantidad > 1 ? `${f.funcion} ${i}` : f.funcion;
          const cand = estado.trabajadores.find(t => !t.baja && DB.habilitado(t, f.funcion) && (t.disponibilidad[s.fecha] || []).length && !usados.has(t.id) && !usados.has('otro:' + t.id));
          if (cand) usados.add(cand.id);
          puestos.push({ id: DB.id('a'), puesto: nombre, funcion: f.funcion, horario: s.horario, trabajador: cand ? cand.id : '', acuse: 'Pendiente' });
        }
      });
      cuadrante.puestos = puestos;
    },
    /* Valida solapes con otros cuadrantes del mismo día y habilitación */
    validar(cuadrante) {
      const p = DB.presupuesto(cuadrante.presupuesto); const s = DB.solicitud(p.solicitud);
      const problemas = {};
      const vistos = {};
      cuadrante.puestos.forEach(a => {
        if (!a.trabajador) { problemas[a.id] = 'Sin cubrir'; return; }
        const t = DB.trabajador(a.trabajador);
        if (!DB.habilitado(t, a.funcion)) problemas[a.id] = `No habilitado para ${a.funcion.toLowerCase()}`;
        if (vistos[a.trabajador]) problemas[a.id] = 'Asignado dos veces en este cuadrante';
        vistos[a.trabajador] = true;
        estado.cuadrantes.forEach(c => {
          if (c.id === cuadrante.id) return;
          const sp = DB.solicitud(DB.presupuesto(c.presupuesto).solicitud);
          if (sp.fecha === s.fecha && c.puestos.some(x => x.trabajador === a.trabajador)) problemas[a.id] = `Solapa con ${DB.hermandad(sp.hermandad).nombre}`;
        });
      });
      return problemas;
    }
  };

  window.DB = DB;
})();
