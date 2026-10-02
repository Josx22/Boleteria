import { CATEGORIES } from '../data/events'
import { formatMoney, formatTime, minPrice, totalAvailable } from '../utils'

// Una fila de la cartelera: fecha, evento, lugar, precio y botón.
function EventRow({ event, money, onOpen }) {
  const d = new Date(event.date)
  const weekday = d.toLocaleDateString('es-SV', { weekday: 'short' }).replace('.', '')
  const available = totalAvailable(event)
  const soldOut = available === 0
  const category = CATEGORIES.find((c) => c.id === event.category)?.label

  return (
    <li className={`row ${soldOut ? 'is-soldout' : ''}`} style={{ '--ink': event.color }}>
      <p className="row-date">
        <span className="row-day">{d.getDate()}</span>
        <span className="row-weekday">{weekday}</span>
      </p>

      <div className="row-main">
        <h4>
          <button className="row-link" onClick={() => onOpen(event.id)} disabled={soldOut}>
            {event.title}
          </button>
        </h4>
        <p className="row-sub">
          {category}. {event.subtitle}
        </p>
      </div>

      <p className="row-place">
        {event.venue}
        <span>
          {event.city}, {formatTime(event.date)}
        </span>
      </p>

      <div className="row-buy">
        {soldOut ? (
          <span className="stamp">Agotado</span>
        ) : (
          <>
            <p className="row-price">
              <span>desde</span> {formatMoney(minPrice(event), money.currency, money.rates)}
            </p>
            {available < 30 && <p className="row-alert">Quedan {available}</p>}
          </>
        )}
      </div>
    </li>
  )
}

export default EventRow
