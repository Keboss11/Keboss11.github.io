// ─────────────────────────────────────────────────────────────
//  DATOS DEL CUADERNO
//  Aquí se apunta qué expediciones (proyectos) y entradas (posts)
//  existen. Con esto se montan el índice, el registro de cada
//  expedición, el orden al pasar página y los números de página.
//  El contenido de cada página está en su propio index.html.
// ─────────────────────────────────────────────────────────────

export const CUADERNO = {
  titulo: 'Cuaderno de campo',
  numero: '01',
  etiqueta: 'PROYECTOS', // texto grande de la tapa
  autor: 'Tu nombre',
  desde: '2026',
  presentacion: 'aquí apunto cómo construyo cosas: decisiones, código y errores.',
  contacto: { texto: 'github.com/Keboss11', url: 'https://github.com/Keboss11' },
};

// El orden de esta lista es el orden del cuaderno.
// Cada expedición vive en /expediciones/<id>/index.html
// y cada entrada en /expediciones/<id>/<id-entrada>/index.html
// borrador: true → solo se ve en local (localhost), no en la web.
export const EXPEDICIONES = [
  {
    id: 'pogo-pve-assistant',
    titulo: 'PoGo PvE Assistant',
    habitat: 'Android',
    estado: 'en curso',
    inicio: '2026-09-14',
    pendientes: [
      'Los rankings',
      'El motor de cálculo',
      '¿Merece la pena invertir?',
      'Datos del juego: la saga de las APIs',
    ],
    entradas: [
      {
        id: '01-el-primer-dia',
        titulo: 'El primer día: buscar un Pokémon y elegir sus ataques',
        fecha: '2026-09-14',
        resumen: 'Primero las funcionalidades, después el diseño: lo que hice el primer día y cómo separé la app en capas.',
      },
    ],
  },
  // Referencia de todos los componentes: solo se ve en local.
  {
    id: 'ejemplo',
    titulo: 'Expedición de ejemplo',
    habitat: 'Plantilla',
    borrador: true,
    estado: 'en curso', // en curso | terminado | en pausa | por explorar
    inicio: '2026-10-25',
    pendientes: ['Esto es un «pendiente»', 'Las entradas que aún no has escrito'],
    entradas: [
      {
        id: '01-anatomia-de-una-entrada',
        titulo: 'Anatomía de una entrada',
        fecha: '2026-10-25',
        resumen: 'Esto es el «resumen». Sale en el registro de la expedición.',
      },
    ],
  },
];
