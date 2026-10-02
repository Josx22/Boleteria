// Datos de ejemplo de los eventos.
// Los artistas y equipos son ficticios; los precios están en dólares (USD).
//
// color:   color "de cartel" con el que se pinta el evento.
// layout:  forma del mapa del recinto: 'estadio' (cancha al centro) o 'escenario'.
// zones:   ordenadas de la más barata a la más cara.
//          available = boletos disponibles en esa zona.

export const CATEGORIES = [
  { id: 'todos', label: 'Todo' },
  { id: 'conciertos', label: 'Conciertos' },
  { id: 'deportes', label: 'Deportes' },
  { id: 'teatro', label: 'Teatro' },
  { id: 'festivales', label: 'Festivales' },
]

export const EVENTS = [
  {
    id: 'ev-01',
    title: 'Los Volcanes Eléctricos',
    subtitle: 'Gira Ceniza y Neón',
    category: 'conciertos',
    date: '2026-11-14T20:00:00',
    venue: 'Estadio Cuscatlán',
    city: 'San Salvador',
    color: '#D7263D',
    layout: 'escenario',
    description:
      'La banda de rock alternativo más escuchada de la región regresa con un show de luces, pirotecnia y sus mayores éxitos.',
    zones: [
      { id: 'gen', name: 'General', price: 35, available: 120 },
      { id: 'pref', name: 'Preferencia', price: 65, available: 40 },
      { id: 'vip', name: 'VIP Front Stage', price: 140, available: 8 },
    ],
  },
  {
    id: 'ev-02',
    title: 'Águilas vs. Toros',
    subtitle: 'Liga Mayor, jornada 18',
    category: 'deportes',
    date: '2026-10-25T16:00:00',
    venue: 'Estadio Cuscatlán',
    city: 'San Salvador',
    color: '#1B998B',
    layout: 'estadio',
    description:
      'El partido más esperado del torneo. Dos rivales históricos se juegan el primer lugar de la tabla.',
    zones: [
      { id: 'sol', name: 'Sol General', price: 8, available: 300 },
      { id: 'sombra', name: 'Sombra', price: 15, available: 150 },
      { id: 'tribuna', name: 'Tribuna', price: 30, available: 60 },
    ],
  },
  {
    id: 'ev-03',
    title: 'La Casa de Bernarda Alba',
    subtitle: 'Compañía Nacional de Teatro',
    category: 'teatro',
    date: '2026-11-07T19:30:00',
    venue: 'Teatro Nacional',
    city: 'San Salvador',
    color: '#2E294E',
    layout: 'escenario',
    description:
      'Montaje contemporáneo del clásico de Federico García Lorca, con escenografía y música original en vivo.',
    zones: [
      { id: 'balcon', name: 'Balcón', price: 12, available: 50 },
      { id: 'platea', name: 'Platea', price: 25, available: 35 },
      { id: 'palco', name: 'Palco', price: 45, available: 6 },
    ],
  },
  {
    id: 'ev-04',
    title: 'Brisa del Pacífico',
    subtitle: 'Festival de dos días con 18 artistas',
    category: 'festivales',
    date: '2026-12-05T14:00:00',
    venue: 'Playa El Tunco',
    city: 'La Libertad',
    color: '#FFC727',
    layout: 'escenario',
    description:
      'Música electrónica, indie y reggae frente al mar. Incluye zona de comida, arte urbano y atardeceres.',
    zones: [
      { id: 'dia', name: 'Pase 1 día', price: 45, available: 200 },
      { id: 'full', name: 'Pase 2 días', price: 80, available: 90 },
      { id: 'vip', name: 'VIP Lounge', price: 160, available: 15 },
    ],
  },
  {
    id: 'ev-05',
    title: 'Selección vs. Costa Azul',
    subtitle: 'Amistoso internacional',
    category: 'deportes',
    date: '2026-11-21T19:00:00',
    venue: 'Estadio Cuscatlán',
    city: 'San Salvador',
    color: '#0F47AF',
    layout: 'estadio',
    description:
      'La Selecta se prepara para las eliminatorias en un amistoso de alto nivel. Ven a apoyar con tu camiseta azul.',
    zones: [
      { id: 'sol', name: 'Sol General', price: 10, available: 0 },
      { id: 'sombra', name: 'Sombra', price: 20, available: 70 },
      { id: 'tribuna', name: 'Tribuna Preferente', price: 40, available: 25 },
    ],
  },
  {
    id: 'ev-06',
    title: 'Mara Solís',
    subtitle: 'Noche acústica',
    category: 'conciertos',
    date: '2026-10-30T20:30:00',
    venue: 'Teatro Presidente',
    city: 'San Salvador',
    color: '#E84F8C',
    layout: 'escenario',
    description:
      'Una noche especial con la cantautora del momento: guitarra, piano y las historias detrás de cada canción.',
    zones: [
      { id: 'gen', name: 'General', price: 28, available: 80 },
      { id: 'pref', name: 'Preferencia', price: 48, available: 20 },
      { id: 'meet', name: 'Meet & Greet', price: 95, available: 3 },
    ],
  },
  {
    id: 'ev-07',
    title: 'Titanes vs. Halcones',
    subtitle: 'Final nacional de baloncesto, juego 7',
    category: 'deportes',
    date: '2026-12-12T18:00:00',
    venue: 'Gimnasio Nacional',
    city: 'San Salvador',
    color: '#F46036',
    layout: 'estadio',
    description:
      'Todo se decide en un solo partido. Ambiente de playoffs, show de medio tiempo y premiación al final.',
    zones: [
      { id: 'gen', name: 'Graderío', price: 12, available: 180 },
      { id: 'cancha', name: 'Lateral Cancha', price: 35, available: 30 },
      { id: 'courtside', name: 'Courtside', price: 90, available: 4 },
    ],
  },
  {
    id: 'ev-08',
    title: 'Sinfonía de las Estrellas',
    subtitle: 'Orquesta Sinfónica Juvenil',
    category: 'conciertos',
    date: '2027-01-16T19:00:00',
    venue: 'Teatro Nacional',
    city: 'San Salvador',
    color: '#0F47AF',
    layout: 'escenario',
    description:
      'Bandas sonoras de películas y videojuegos interpretadas por más de 60 músicos jóvenes en vivo.',
    zones: [
      { id: 'balcon', name: 'Balcón', price: 10, available: 70 },
      { id: 'platea', name: 'Platea', price: 20, available: 45 },
      { id: 'palco', name: 'Palco', price: 35, available: 10 },
    ],
  },
  {
    id: 'ev-09',
    title: 'Risas sin Frontera',
    subtitle: 'Stand-up comedy, mayores de 15 años',
    category: 'teatro',
    date: '2026-11-28T21:00:00',
    venue: 'Teatro Luis Poma',
    city: 'San Salvador',
    color: '#1B998B',
    layout: 'escenario',
    description:
      'Cinco comediantes de Centroamérica comparten escenario en una noche de humor.',
    zones: [
      { id: 'gen', name: 'General', price: 15, available: 60 },
      { id: 'front', name: 'Primera fila', price: 30, available: 12 },
    ],
  },
  {
    id: 'ev-10',
    title: 'Volcán Fest',
    subtitle: 'Rock, metal y punk en tres escenarios',
    category: 'festivales',
    date: '2027-02-20T12:00:00',
    venue: 'CIFCO',
    city: 'San Salvador',
    color: '#16213E',
    layout: 'escenario',
    description:
      'Doce horas de música pesada con bandas locales e invitadas internacionales.',
    zones: [
      { id: 'gen', name: 'General', price: 40, available: 250 },
      { id: 'vip', name: 'VIP', price: 85, available: 30 },
    ],
  },
]
