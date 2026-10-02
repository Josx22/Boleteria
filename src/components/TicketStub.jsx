import { formatDate, formatMoney, formatTime, textOn } from '../utils'

// Genera barras "tipo código de barras" a partir del código del boleto.
// Es decorativo: el mismo código siempre produce las mismas barras.
function barsFromCode(code) {
  return code
    .replace(/-/g, '')
    .split('')
    .flatMap((ch) => {
      const n = ch.charCodeAt(0)
      return [(n % 3) + 1, ((n >> 2) % 2) + 1, (n % 4) + 1, ((n >> 1) % 2) + 1]
    })
}

// Boleto individual, con talón desprendible.
function TicketStub({ item, code, holder, number, of }) {
  const bars = barsFromCode(code)

  return (
    <article className="ticket" style={{ '--ink': item.color, '--on-ink': textOn(item.color) }}>
      <div className="ticket-band">
        <span>{item.zoneName}</span>
        <span>
          {number} de {of}
        </span>
      </div>
      <div className="ticket-body">
        <h3>{item.title}</h3>
        <p className="capitalize">{formatDate(item.date)}</p>
        <p>
          {formatTime(item.date)}, {item.venue}
        </p>
        <p className="ticket-holder">{holder}</p>
        <p className="ticket-price">{formatMoney(item.price)}</p>
      </div>
      <div className="ticket-stub">
        <svg className="barcode" viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1, 0)} 40`} preserveAspectRatio="none" aria-hidden="true">
          {bars.reduce(
            (acc, w, i) => {
              if (i % 2 === 0) acc.rects.push(<rect key={i} x={acc.x} y="0" width={w} height="40" />)
              acc.x += w + 1
              return acc
            },
            { x: 0, rects: [] }
          ).rects}
        </svg>
        <code>{code}</code>
      </div>
    </article>
  )
}

export default TicketStub
