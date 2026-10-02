import { formatMoney, formatTime, minPrice, textOn } from '../utils'

// Portada: el próximo evento con boletos, presentado como un cartel impreso.
function FeaturedEvent({ event, money, onOpen }) {
  const d = new Date(event.date)
  const weekday = d.toLocaleDateString('es-SV', { weekday: 'long' })
  const day = d.getDate()
  const month = d.toLocaleDateString('es-SV', { month: 'long' })

  return (
    <section className="poster" style={{ '--ink': event.color, '--on-ink': textOn(event.color) }}>
      <div className="wrap poster-inner">
        <div className="poster-title">
          <p className="poster-kicker">Próximamente</p>
          <h1>{event.title}</h1>
          <p className="poster-sub">{event.subtitle}</p>
        </div>

        <div className="poster-side">
          <p className="poster-date">
            <span className="poster-weekday">{weekday}</span>
            <span className="poster-day">{day}</span>
            <span className="poster-month">{month}</span>
          </p>
          <p className="poster-venue">
            {event.venue}
            <br />
            {event.city}, {formatTime(event.date)}
          </p>
          <button className="poster-buy" onClick={() => onOpen(event.id)}>
            Comprar desde {formatMoney(minPrice(event), money.currency, money.rates)}
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvent
