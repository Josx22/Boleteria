// Funciones de ayuda reutilizables en varios componentes.

// Convierte un precio en USD a la moneda elegida y le da formato.
export function formatMoney(amountUSD, currency = 'USD', rates = { USD: 1 }) {
  const rate = rates[currency] ?? 1
  const code = rates[currency] ? currency : 'USD'
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 2,
  }).format(amountUSD * rate)
}

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function dateParts(isoDate) {
  const d = new Date(isoDate)
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('es-SV', { month: 'short' }).replace('.', ''),
    weekday: d.toLocaleDateString('es-SV', { weekday: 'short' }).replace('.', ''),
  }
}

// Precio mínimo de un evento (de todas sus zonas).
export function minPrice(event) {
  return Math.min(...event.zones.map((z) => z.price))
}

// Total de boletos disponibles de un evento.
export function totalAvailable(event) {
  return event.zones.reduce((sum, z) => sum + z.available, 0)
}

// Genera un código de boleto aleatorio, ej. "TQ-7F3K-92QA".
export function ticketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const block = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `TQ-${block()}-${block()}`
}

// Cargo por servicio: 8 % del subtotal.
export const SERVICE_FEE = 0.08

// Elige texto oscuro o claro según qué tan claro es el color de fondo.
export function textOn(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#16213E' : '#FFFFFF'
}

// Nombre del mes con año, ej. "noviembre de 2026".
export function monthLabel(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-SV', { month: 'long', year: 'numeric' })
}
