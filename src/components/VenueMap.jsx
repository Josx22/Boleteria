// Mapa del recinto dibujado con SVG. Cada zona se puede tocar para seleccionarla.
// Hay dos formas:
//   - 'estadio':   cancha al centro y graderíos alrededor (necesita 3 zonas).
//   - 'escenario': escenario arriba y zonas en semicírculos (cualquier cantidad).

const W = 440
const H = 290

// Punto en un círculo (ángulo en grados, el eje Y crece hacia abajo).
function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

// Trazo de un "pedazo de anillo" entre dos radios y dos ángulos.
function ringSector(cx, cy, rIn, rOut, a1, a2) {
  const [x1, y1] = polar(cx, cy, rOut, a1)
  const [x2, y2] = polar(cx, cy, rOut, a2)
  const [x3, y3] = polar(cx, cy, rIn, a2)
  const [x4, y4] = polar(cx, cy, rIn, a1)
  return `M${x1},${y1} A${rOut},${rOut} 0 0 1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 0 0 ${x4},${y4} Z`
}

function Zone({ zone, selected, onSelect, children, label }) {
  const soldOut = zone.available === 0
  const className = ['map-zone', selected && 'is-selected', soldOut && 'is-soldout'].filter(Boolean).join(' ')

  function choose() {
    if (!soldOut) onSelect(zone.id)
  }

  return (
    <g
      className={className}
      role="button"
      tabIndex={soldOut ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={soldOut}
      aria-label={`${zone.name}${soldOut ? ', agotado' : ''}`}
      onClick={choose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          choose()
        }
      }}
    >
      {children}
      {label}
    </g>
  )
}

function StageMap({ zones, selectedId, onSelect }) {
  const cx = W / 2
  const cy = 36
  const start = 66
  const end = 246
  const gap = 6
  const band = (end - start) / zones.length

  // La zona más cara queda más cerca del escenario.
  const closestFirst = [...zones].reverse()

  return (
    <>
      <rect className="map-stage" x={cx - 80} y={10} width={160} height={36} />
      <text className="map-stage-label" x={cx} y={33}>Escenario</text>
      {closestFirst.map((zone, i) => {
        const rIn = start + i * band
        const rOut = rIn + band - gap
        const labelY = cy + (rIn + rOut) / 2
        return (
          <Zone
            key={zone.id}
            zone={zone}
            selected={selectedId === zone.id}
            onSelect={onSelect}
            label={
              <text className="map-label" x={cx} y={labelY}>
                {zone.name}
              </text>
            }
          >
            <path d={ringSector(cx, cy, rIn, rOut, 28, 152)} />
          </Zone>
        )
      })}
    </>
  )
}

function StadiumMap({ zones, selectedId, onSelect }) {
  // zones[0] = cabeceras (más barata), zones[1] = lateral de enfrente, zones[2] = lateral principal.
  const [ends, far, main] = zones
  const field = { x: 112, y: 86, w: 216, h: 118 }

  return (
    <>
      <g className="map-field">
        <rect x={field.x} y={field.y} width={field.w} height={field.h} />
        <line x1={W / 2} y1={field.y} x2={W / 2} y2={field.y + field.h} />
        <circle cx={W / 2} cy={field.y + field.h / 2} r={22} />
      </g>

      <Zone
        zone={far}
        selected={selectedId === far.id}
        onSelect={onSelect}
        label={<text className="map-label" x={W / 2} y={54}>{far.name}</text>}
      >
        <rect x={field.x} y={32} width={field.w} height={44} />
      </Zone>

      <Zone
        zone={main}
        selected={selectedId === main.id}
        onSelect={onSelect}
        label={<text className="map-label" x={W / 2} y={236}>{main.name}</text>}
      >
        <rect x={field.x} y={214} width={field.w} height={44} />
      </Zone>

      <Zone
        zone={ends}
        selected={selectedId === ends.id}
        onSelect={onSelect}
        label={
          <>
            <text className="map-label" transform={`translate(${78} ${H / 2}) rotate(-90)`}>{ends.name}</text>
            <text className="map-label" transform={`translate(${362} ${H / 2}) rotate(90)`}>{ends.name}</text>
          </>
        }
      >
        <rect x={56} y={field.y} width={46} height={field.h} />
        <rect x={338} y={field.y} width={46} height={field.h} />
      </Zone>
    </>
  )
}

function VenueMap({ event, selectedId, onSelect }) {
  const useStadium = event.layout === 'estadio' && event.zones.length === 3

  return (
    <figure className="venue-map">
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Mapa de ${event.venue}`}>
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="map-hatch" />
          </pattern>
        </defs>
        {useStadium ? (
          <StadiumMap zones={event.zones} selectedId={selectedId} onSelect={onSelect} />
        ) : (
          <StageMap zones={event.zones} selectedId={selectedId} onSelect={onSelect} />
        )}
      </svg>
      <figcaption className="map-legend">
        <span><i className="key key-free" /> Disponible</span>
        <span><i className="key key-picked" /> Tu zona</span>
        <span><i className="key key-out" /> Agotado</span>
      </figcaption>
    </figure>
  )
}

export default VenueMap
