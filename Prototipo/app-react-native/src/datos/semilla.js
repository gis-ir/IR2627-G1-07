/* Datos de ejemplo de la app (mismos que el portal web del prototipo).
   Las funciones son la enumeración TipoFuncion del modelo conceptual del ERS.
   En producción vendrían de la API del sistema. */
export const SEMILLA = {
  "hoy": "2027-03-15",
  "funciones": [
    "Acólito",
    "Acólito de cirial",
    "Acólito de incensario",
    "Acólito de naveta",
    "Pertiguero",
    "Portainsignia",
    "Encendedor",
    "Aguador",
    "Auxiliar de carro",
    "Escalera",
    "Auxiliar vallas",
    "Camarero"
  ],
  "descripcionFunciones": {
    "Acólito": "Realiza las tareas de acompañamiento y asistencia litúrgica asignadas",
    "Acólito de cirial": "Porta el cirial (candelero con vela) durante el servicio",
    "Acólito de incensario": "Se encarga del incensario durante el servicio",
    "Acólito de naveta": "Se encarga de la naveta con el incienso durante el servicio",
    "Pertiguero": "Coordina al grupo de acólitos durante el servicio",
    "Portainsignia": "Porta la insignia que le asigna la hermandad",
    "Encendedor": "Se encarga de encender y mantener las velas durante el servicio",
    "Aguador": "Reparte agua a quienes participan en el servicio",
    "Auxiliar de carro": "Ayuda en el traslado y manejo del carro de apoyo",
    "Escalera": "Se encarga del transporte y colocación de la escalera de apoyo",
    "Auxiliar vallas": "Ayuda a colocar y retirar las vallas",
    "Camarero": "Atiende el servicio de bebidas y comidas"
  },
  "usuarios": [
    {
      "id": "u5",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@correo.es",
      "rol": "Trabajador",
      "trabajador": "t1",
      "activo": true,
      "clave": "demo"
    },
    {
      "id": "u6",
      "nombre": "Carlos Benítez",
      "correo": "carlos.b@correo.es",
      "rol": "Trabajador",
      "trabajador": "t3",
      "activo": true,
      "clave": "demo"
    },
    {
      "id": "u7",
      "nombre": "Pedro Lara",
      "correo": "pedro.lara@correo.es",
      "rol": "Trabajador",
      "trabajador": "t9",
      "activo": false,
      "clave": "demo"
    }
  ],
  "trabajadores": [
    {
      "id": "t1",
      "nombre": "Juan Pérez",
      "telefono": "611 203 455",
      "correo": "juan.perez@correo.es",
      "zona": "Triana",
      "talla": "M",
      "calzado": 43,
      "alta": "2023-02-10",
      "capacitaciones": [
        {
          "rol": "Acólito",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de cirial",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de incensario",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Pertiguero",
          "estado": "Pendiente",
          "experiencia": "Tres años de pertiguero en la Hdad. de la O."
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "tarde",
          "noche"
        ],
        "2027-03-22": [
          "tarde",
          "noche"
        ],
        "2027-03-23": [
          "mañana"
        ],
        "2027-03-24": [
          "tarde"
        ],
        "2027-03-25": [
          "tarde",
          "noche"
        ],
        "2027-03-26": [
          "mañana",
          "tarde",
          "noche"
        ]
      }
    },
    {
      "id": "t2",
      "nombre": "Manuel Ruiz",
      "telefono": "622 118 902",
      "correo": "manuel.ruiz@correo.es",
      "zona": "Los Remedios",
      "talla": "L",
      "calzado": 44,
      "alta": "2022-01-15",
      "capacitaciones": [
        {
          "rol": "Acólito",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de cirial",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Encendedor",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "tarde"
        ],
        "2027-03-22": [
          "tarde",
          "noche"
        ],
        "2027-03-25": [
          "noche"
        ],
        "2027-03-26": [
          "noche"
        ]
      }
    },
    {
      "id": "t3",
      "nombre": "Carlos Benítez",
      "telefono": "633 450 771",
      "correo": "carlos.b@correo.es",
      "zona": "Centro",
      "talla": "M",
      "calzado": 42,
      "alta": "2024-03-01",
      "capacitaciones": [
        {
          "rol": "Acólito de incensario",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Aguador",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "tarde",
          "noche"
        ],
        "2027-03-22": [
          "tarde",
          "noche"
        ],
        "2027-03-24": [
          "tarde",
          "noche"
        ]
      }
    },
    {
      "id": "t4",
      "nombre": "Antonio Gómez",
      "telefono": "644 909 120",
      "correo": "agomez@correo.es",
      "zona": "Triana",
      "talla": "XL",
      "calzado": 45,
      "alta": "2019-02-20",
      "capacitaciones": [
        {
          "rol": "Pertiguero",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de cirial",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Portainsignia",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "tarde",
          "noche"
        ],
        "2027-03-23": [
          "tarde",
          "noche"
        ],
        "2027-03-25": [
          "tarde",
          "noche"
        ]
      }
    },
    {
      "id": "t5",
      "nombre": "Pablo Sanz",
      "telefono": "655 321 004",
      "correo": "psanz@correo.es",
      "zona": "Triana",
      "talla": "S",
      "calzado": 41,
      "alta": "2025-01-12",
      "capacitaciones": [
        {
          "rol": "Acólito de cirial",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Portainsignia",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de naveta",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "tarde",
          "noche"
        ],
        "2027-03-22": [
          "tarde",
          "noche"
        ],
        "2027-03-26": [
          "tarde"
        ]
      }
    },
    {
      "id": "t6",
      "nombre": "Álvaro Moreno",
      "telefono": "666 774 230",
      "correo": "amoreno@correo.es",
      "zona": "Nervión",
      "talla": "M",
      "calzado": 42,
      "alta": "2024-11-03",
      "capacitaciones": [
        {
          "rol": "Acólito de cirial",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de incensario",
          "estado": "Pendiente",
          "experiencia": "Monaguillo en la parroquia de San Bernardo desde niño."
        }
      ],
      "disponibilidad": {
        "2027-03-22": [
          "tarde",
          "noche"
        ],
        "2027-03-23": [
          "tarde",
          "noche"
        ],
        "2027-03-24": [
          "tarde",
          "noche"
        ]
      }
    },
    {
      "id": "t7",
      "nombre": "Javier Torres",
      "telefono": "677 002 918",
      "correo": "jtorres@correo.es",
      "zona": "Macarena",
      "talla": "L",
      "calzado": 43,
      "alta": "2021-03-08",
      "capacitaciones": [
        {
          "rol": "Aguador",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Encendedor",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Escalera",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Pertiguero",
          "estado": "Rechazada",
          "por": "Luis Chamorro",
          "motivo": "Sin experiencia acreditada"
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "noche"
        ],
        "2027-03-22": [
          "noche"
        ],
        "2027-03-26": [
          "mañana",
          "noche"
        ]
      }
    },
    {
      "id": "t8",
      "nombre": "Sergio Navarro",
      "telefono": "688 515 377",
      "correo": "snavarro@correo.es",
      "zona": "Cerro del Águila",
      "talla": "M",
      "calzado": 42,
      "alta": "2023-12-01",
      "capacitaciones": [
        {
          "rol": "Auxiliar de carro",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Auxiliar vallas",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Aguador",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Acólito de cirial",
          "estado": "Pendiente",
          "experiencia": "Acólito en su hermandad durante cuatro años."
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "noche"
        ],
        "2027-03-22": [
          "tarde"
        ],
        "2027-03-23": [
          "tarde",
          "noche"
        ]
      }
    },
    {
      "id": "t9",
      "nombre": "Pedro Lara",
      "telefono": "699 230 115",
      "correo": "pedro.lara@correo.es",
      "zona": "Triana",
      "talla": "L",
      "calzado": 44,
      "alta": "2020-02-02",
      "baja": true,
      "capacitaciones": [
        {
          "rol": "Acólito de incensario",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Camarero",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        }
      ],
      "disponibilidad": {}
    },
    {
      "id": "t10",
      "nombre": "Diego Castaño",
      "telefono": "610 884 562",
      "correo": "dcastano@correo.es",
      "zona": "Los Remedios",
      "talla": "M",
      "calzado": 43,
      "alta": "2022-02-19",
      "capacitaciones": [
        {
          "rol": "Acólito de incensario",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Aguador",
          "estado": "Aprobada",
          "por": "Luis Chamorro"
        },
        {
          "rol": "Pertiguero",
          "estado": "Pendiente",
          "experiencia": "Pertiguero suplente en la Hdad. del Baratillo."
        }
      ],
      "disponibilidad": {
        "2027-03-21": [
          "tarde",
          "noche"
        ],
        "2027-03-22": [
          "tarde",
          "noche"
        ]
      }
    }
  ],
  "hermandades": [
    {
      "id": "h1",
      "nombre": "Hdad. de la Estrella",
      "sede": "Capilla de la Estrella (Triana)",
      "contacto": "Rafael Ortega",
      "telefono": "954 33 12 40"
    },
    {
      "id": "h2",
      "nombre": "Hdad. de San Gonzalo",
      "sede": "Parroquia de San Gonzalo (Triana)",
      "contacto": "Inmaculada Ríos",
      "telefono": "954 34 21 08"
    },
    {
      "id": "h3",
      "nombre": "Hdad. de la Macarena",
      "sede": "Basílica de la Macarena",
      "contacto": "José M. Vela",
      "telefono": "954 90 18 00"
    },
    {
      "id": "h4",
      "nombre": "Hdad. de los Gitanos",
      "sede": "Santuario de los Gitanos",
      "contacto": "Antonio Heredia",
      "telefono": "954 41 70 22"
    },
    {
      "id": "h5",
      "nombre": "Hdad. del Cerro",
      "sede": "Parroquia de los Dolores (Cerro del Águila)",
      "contacto": "Lucía Márquez",
      "telefono": "954 63 55 19"
    },
    {
      "id": "h6",
      "nombre": "Hdad. de Santa Genoveva",
      "sede": "Parroquia de Santa Genoveva (Tiro de Línea)",
      "contacto": "Fernando Gil",
      "telefono": "954 69 02 11"
    }
  ],
  "eventos": [
    {
      "id": "e1",
      "nombre": "Domingo de Ramos",
      "clase": "Salida procesional",
      "hermandad": "h1",
      "inicio": "2027-03-21",
      "fin": "2027-03-21",
      "franja": "14:00 – 01:30",
      "situacion": "Con servicio",
      "notas": "Citación en la capilla. Dalmática roja."
    },
    {
      "id": "e2",
      "nombre": "Lunes Santo",
      "clase": "Salida procesional",
      "hermandad": "h2",
      "inicio": "2027-03-22",
      "fin": "2027-03-22",
      "franja": "14:00 – 23:30",
      "situacion": "Con servicio",
      "notas": "Dalmática blanca y cíngulo."
    },
    {
      "id": "e3",
      "nombre": "Madrugá",
      "clase": "Salida procesional",
      "hermandad": "h3",
      "inicio": "2027-03-26",
      "fin": "2027-03-26",
      "franja": "00:00 – 14:00",
      "situacion": "Presupuesto enviado",
      "notas": ""
    },
    {
      "id": "e4",
      "nombre": "Besamanos de la Virgen",
      "clase": "Acto de culto",
      "hermandad": "h4",
      "inicio": "2027-03-12",
      "fin": "2027-03-13",
      "franja": "10:00 – 21:00",
      "situacion": "Con servicio",
      "notas": "Turnos de mañana y tarde."
    },
    {
      "id": "e5",
      "nombre": "Martes Santo",
      "clase": "Salida procesional",
      "hermandad": "h5",
      "inicio": "2027-03-23",
      "fin": "2027-03-23",
      "franja": "15:00 – 00:30",
      "situacion": "Pendiente de solicitud",
      "notas": ""
    },
    {
      "id": "e6",
      "nombre": "Vía Crucis del Consejo",
      "clase": "Otro acto",
      "hermandad": "",
      "inicio": "2027-03-01",
      "fin": "2027-03-01",
      "franja": "19:00 – 22:00",
      "situacion": "Cancelado",
      "notas": "Suspendido por lluvia."
    }
  ],
  "solicitudes": [
    {
      "id": "s1",
      "hermandad": "h1",
      "evento": "e1",
      "acto": "Estación de penitencia, Domingo de Ramos",
      "fecha": "2027-03-21",
      "horario": "14:15 – 01:30",
      "funciones": [
        {
          "funcion": "Acólito de cirial",
          "cantidad": 4
        },
        {
          "funcion": "Pertiguero",
          "cantidad": 1
        },
        {
          "funcion": "Aguador",
          "cantidad": 2
        }
      ],
      "estado": "Cuadrante publicado",
      "creada": "2027-01-20"
    },
    {
      "id": "s2",
      "hermandad": "h2",
      "evento": "e2",
      "acto": "Estación de penitencia, Lunes Santo",
      "fecha": "2027-03-22",
      "horario": "14:00 – 23:30",
      "funciones": [
        {
          "funcion": "Acólito de cirial",
          "cantidad": 4
        },
        {
          "funcion": "Acólito de incensario",
          "cantidad": 2
        },
        {
          "funcion": "Pertiguero",
          "cantidad": 1
        }
      ],
      "estado": "Presupuesto aceptado",
      "creada": "2027-01-28"
    },
    {
      "id": "s3",
      "hermandad": "h3",
      "evento": "e3",
      "acto": "Estación de penitencia, Madrugá",
      "fecha": "2027-03-26",
      "horario": "00:00 – 14:00",
      "funciones": [
        {
          "funcion": "Acólito de cirial",
          "cantidad": 6
        },
        {
          "funcion": "Acólito de incensario",
          "cantidad": 2
        },
        {
          "funcion": "Acólito de naveta",
          "cantidad": 1
        },
        {
          "funcion": "Aguador",
          "cantidad": 3
        },
        {
          "funcion": "Escalera",
          "cantidad": 1
        }
      ],
      "estado": "Presupuesto enviado",
      "creada": "2027-02-05"
    },
    {
      "id": "s4",
      "hermandad": "h1",
      "evento": "",
      "acto": "Función principal de instituto",
      "fecha": "2027-04-18",
      "horario": "11:00 – 14:00",
      "funciones": [
        {
          "funcion": "Acólito de cirial",
          "cantidad": 2
        },
        {
          "funcion": "Acólito de incensario",
          "cantidad": 1
        }
      ],
      "estado": "Presupuesto enviado",
      "creada": "2027-03-02"
    },
    {
      "id": "s5",
      "hermandad": "h5",
      "evento": "e5",
      "acto": "Estación de penitencia, Martes Santo",
      "fecha": "2027-03-23",
      "horario": "15:00 – 00:30",
      "funciones": [
        {
          "funcion": "Acólito de cirial",
          "cantidad": 4
        },
        {
          "funcion": "Portainsignia",
          "cantidad": 2
        },
        {
          "funcion": "Auxiliar vallas",
          "cantidad": 2
        }
      ],
      "estado": "Pendiente de presupuesto",
      "creada": "2027-03-10"
    },
    {
      "id": "s6",
      "hermandad": "h1",
      "evento": "",
      "acto": "Besamanos de la Virgen de la Estrella",
      "fecha": "2027-04-10",
      "horario": "10:00 – 21:00",
      "funciones": [
        {
          "funcion": "Acólito",
          "cantidad": 2
        },
        {
          "funcion": "Camarero",
          "cantidad": 1
        }
      ],
      "estado": "Presupuesto rechazado",
      "creada": "2027-02-20"
    },
    {
      "id": "s9",
      "hermandad": "h1",
      "evento": "",
      "acto": "Besamanos de la Virgen de la Estrella",
      "fecha": "2026-12-08",
      "horario": "10:00 – 21:00",
      "funciones": [
        {
          "funcion": "Acólito",
          "cantidad": 2
        }
      ],
      "estado": "Finalizado",
      "creada": "2026-11-10"
    },
    {
      "id": "s8",
      "hermandad": "h6",
      "evento": "",
      "acto": "Estación de penitencia, Lunes Santo",
      "fecha": "2027-03-22",
      "horario": "13:30 – 22:00",
      "funciones": [
        {
          "funcion": "Acólito de incensario",
          "cantidad": 1
        },
        {
          "funcion": "Auxiliar de carro",
          "cantidad": 1
        }
      ],
      "estado": "Cuadrante publicado",
      "creada": "2027-01-30"
    },
    {
      "id": "s7",
      "hermandad": "h1",
      "evento": "",
      "acto": "Estación de penitencia, Domingo de Ramos",
      "fecha": "2026-03-29",
      "horario": "14:15 – 01:30",
      "funciones": [
        {
          "funcion": "Acólito de cirial",
          "cantidad": 4
        },
        {
          "funcion": "Pertiguero",
          "cantidad": 1
        }
      ],
      "estado": "Finalizado",
      "creada": "2026-01-18"
    }
  ],
  "presupuestos": [
    {
      "id": "p1",
      "solicitud": "s1"
    },
    {
      "id": "p2",
      "solicitud": "s2"
    },
    {
      "id": "p3",
      "solicitud": "s3"
    },
    {
      "id": "p4",
      "solicitud": "s4"
    },
    {
      "id": "p6",
      "solicitud": "s8"
    },
    {
      "id": "p7",
      "solicitud": "s9"
    },
    {
      "id": "p8",
      "solicitud": "s7"
    },
    {
      "id": "p5",
      "solicitud": "s6"
    }
  ],
  "cuadrantes": [
    {
      "id": "c1",
      "presupuesto": "p1",
      "estado": "Publicado",
      "publicado": "2027-03-08",
      "plazoAcuse": "2027-03-17",
      "puestos": [
        {
          "id": "a1",
          "puesto": "Acólito de cirial 1",
          "funcion": "Acólito de cirial",
          "horario": "14:15 – 01:30",
          "trabajador": "t1",
          "acuse": "Pendiente"
        },
        {
          "id": "a2",
          "puesto": "Acólito de cirial 2",
          "funcion": "Acólito de cirial",
          "horario": "14:15 – 01:30",
          "trabajador": "t5",
          "acuse": "Confirmado"
        },
        {
          "id": "a3",
          "puesto": "Acólito de cirial 3",
          "funcion": "Acólito de cirial",
          "horario": "14:15 – 01:30",
          "trabajador": "t2",
          "acuse": "Confirmado"
        },
        {
          "id": "a4",
          "puesto": "Acólito de cirial 4",
          "funcion": "Acólito de cirial",
          "horario": "14:15 – 01:30",
          "trabajador": "t6",
          "acuse": "Pendiente"
        },
        {
          "id": "a5",
          "puesto": "Pertiguero",
          "funcion": "Pertiguero",
          "horario": "14:15 – 01:30",
          "trabajador": "t4",
          "acuse": "Confirmado"
        },
        {
          "id": "a6",
          "puesto": "Aguador 1",
          "funcion": "Aguador",
          "horario": "14:15 – 01:30",
          "trabajador": "t7",
          "acuse": "Confirmado"
        },
        {
          "id": "a7",
          "puesto": "Aguador 2",
          "funcion": "Aguador",
          "horario": "14:15 – 01:30",
          "trabajador": "t3",
          "acuse": "Baja"
        }
      ]
    },
    {
      "id": "c2",
      "presupuesto": "p2",
      "estado": "Borrador",
      "publicado": "",
      "plazoAcuse": "2027-03-19",
      "puestos": [
        {
          "id": "a11",
          "puesto": "Acólito de cirial 1",
          "funcion": "Acólito de cirial",
          "horario": "14:00 – 23:30",
          "trabajador": "t1",
          "acuse": "Pendiente"
        },
        {
          "id": "a12",
          "puesto": "Acólito de cirial 2",
          "funcion": "Acólito de cirial",
          "horario": "14:00 – 23:30",
          "trabajador": "t2",
          "acuse": "Pendiente"
        },
        {
          "id": "a13",
          "puesto": "Acólito de cirial 3",
          "funcion": "Acólito de cirial",
          "horario": "14:00 – 23:30",
          "trabajador": "t5",
          "acuse": "Pendiente"
        },
        {
          "id": "a14",
          "puesto": "Acólito de cirial 4",
          "funcion": "Acólito de cirial",
          "horario": "14:00 – 23:30",
          "trabajador": "t6",
          "acuse": "Pendiente"
        },
        {
          "id": "a15",
          "puesto": "Acólito de incensario 1",
          "funcion": "Acólito de incensario",
          "horario": "14:00 – 23:30",
          "trabajador": "t3",
          "acuse": "Pendiente"
        },
        {
          "id": "a16",
          "puesto": "Acólito de incensario 2",
          "funcion": "Acólito de incensario",
          "horario": "14:00 – 23:30",
          "trabajador": "t10",
          "acuse": "Pendiente"
        },
        {
          "id": "a17",
          "puesto": "Pertiguero",
          "funcion": "Pertiguero",
          "horario": "14:00 – 23:30",
          "trabajador": "",
          "acuse": "Pendiente"
        }
      ]
    },
    {
      "id": "c3",
      "presupuesto": "p6",
      "estado": "Publicado",
      "publicado": "2027-03-09",
      "plazoAcuse": "2027-03-18",
      "puestos": [
        {
          "id": "a21",
          "puesto": "Acólito de incensario",
          "funcion": "Acólito de incensario",
          "horario": "13:30 – 22:00",
          "trabajador": "t3",
          "acuse": "Baja"
        },
        {
          "id": "a22",
          "puesto": "Auxiliar de carro",
          "funcion": "Auxiliar de carro",
          "horario": "13:30 – 22:00",
          "trabajador": "t8",
          "acuse": "Pendiente"
        }
      ]
    }
  ],
  "bajas": [
    {
      "id": "b1",
      "cuadrante": "c1",
      "puesto": "a7",
      "trabajador": "t3",
      "motivo": "Enfermedad",
      "explicacion": "Fiebre alta desde anoche.",
      "fecha": "2027-03-15 09:12",
      "estado": "Abierta",
      "ofertas": [],
      "sustituto": ""
    },
    {
      "id": "b2",
      "cuadrante": "c3",
      "puesto": "a21",
      "trabajador": "t3",
      "motivo": "Enfermedad",
      "explicacion": "Fiebre alta desde anoche. Tampoco podré el Lunes Santo.",
      "fecha": "2027-03-15 09:15",
      "estado": "Abierta",
      "sustituto": "",
      "ofertas": [
        {
          "trabajador": "t1",
          "estado": "Enviada",
          "enviada": "2027-03-15 09:40",
          "caduca": "2027-03-15 21:40"
        },
        {
          "trabajador": "t10",
          "estado": "Rechazada",
          "enviada": "2027-03-15 09:40",
          "caduca": "2027-03-15 21:40"
        }
      ]
    }
  ],
  "avisos": [
    {
      "id": "v1",
      "titulo": "Recogida de uniformes",
      "texto": "La recogida de dalmáticas y cíngulos será en el almacén de la calle Pureza el lunes 8 de marzo, de 18:00 a 20:00. Traed el DNI.",
      "destinatarios": [
        "Todos"
      ],
      "fecha": "2027-03-05 12:30",
      "autor": "Luis Chamorro",
      "push": true,
      "leidos": [
        "t2",
        "t4"
      ]
    },
    {
      "id": "v2",
      "titulo": "Reunión de pertigueros",
      "texto": "El jueves a las 20:30 nos reunimos en la Capilla de la Estrella para repasar los recorridos de esta Semana Santa.",
      "destinatarios": [
        "Pertiguero"
      ],
      "fecha": "2027-03-03 10:05",
      "autor": "Luis Chamorro",
      "push": false,
      "leidos": [
        "t1",
        "t4"
      ]
    },
    {
      "id": "v3",
      "titulo": "Plazo para confirmar turnos",
      "texto": "Recordad confirmar la recepción de vuestros turnos de Domingo de Ramos antes del miércoles 17. Los turnos sin confirmar se reasignarán.",
      "destinatarios": [
        "Todos"
      ],
      "fecha": "2027-03-12 18:00",
      "autor": "Luis Chamorro",
      "push": true,
      "leidos": []
    }
  ],
  "notificaciones": [
    {
      "id": "n1",
      "trabajador": "t1",
      "titulo": "Cobertura urgente",
      "texto": "Se busca acólito incensario para la Hdad. de Santa Genoveva el Lunes Santo.",
      "tipo": "urgente",
      "ref": "b2",
      "fecha": "2027-03-15 09:40",
      "leida": false
    },
    {
      "id": "n2",
      "trabajador": "t1",
      "titulo": "Cuadrante publicado",
      "texto": "Tienes turno el Domingo de Ramos con la Hdad. de la Estrella. Confirma la recepción.",
      "tipo": "turno",
      "ref": "a1",
      "fecha": "2027-03-08 16:45",
      "leida": true
    }
  ]
};
