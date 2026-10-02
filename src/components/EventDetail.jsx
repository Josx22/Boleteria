import { useState } from 'react'
import VenueMap from './VenueMap'
import Countdown from './Countdown'
import { formatDate, formatMoney, formatTime, textOn } from '../utils'

const MAX_PER_ZONE = 8

// Página de un evento: mapa del recinto, zonas, cantidad y botón para agregar al carrito.
function EventDetail({ event, cart, money, onBack, onAdd, onOpenCart }) {
  // Por defecto, la primera zona que todavía tenga boletos.
  const [zoneId, setZoneId] = useState(event.zones.find((z) => z.available > 0)?.id ?? null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const zone = event.zones.find((z) => z.id === zoneId)
  const inCart = cart.find((i) => i.eventId === event.id && i.zoneId === zoneId)?.qty ?? 0
  const maxQty = zone ? Math.min(MAX_PER_ZONE, zone.available) - inCart : 0
  const fm = (n) => formatMoney(n, money.currency, money.rates)

  function selectZone(id) {
    setZoneId(id)
    setQty(1)
    setAdded(false)
  }

  function handleAdd() {
    onAdd(event.id, zone.id, qty)
    setQty(1)
    setAdded(true)
  }

  return (
    <article className="detail" style={{ '--ink': event.color, '--on-ink': textOn(event.color) }}>
      <header className="detail-head">
        <div className="wrap">
          <button className="back" onClick={onBack}>
            Volver a la cartelera
          </button>
          <div className="detail-head-grid">
            <div>
              <h1>{event.title}</h1>
              <p className="detail-sub">{event.subtitle}</p>
            </div>
            <p className="detail-when">
              <span className="capitalize">{formatDate(event.date)}</span>
              <br />
              {formatTime(event.date)} en {event.venue}, {event.city}
            </p>
          </div>
        </div>
      </header>

      <div className="wrap detail-body">
        <div className="detail-map">
          <VenueMap event={event} selectedId={zoneId} onSelect={selectZone} />
        </div>

        <div className="detail-buy">
          <p className="detail-desc">{event.description}</p>
          <Countdown date={event.date} />

          <h2 className="buy-title">Elige tu zona</h2>
          <ul className="zone-list">
            {event.zones.map((z) => {
              const soldOut = z.available === 0
              return (
                <li key={z.id}>
                  <button
                    className={`zone-option ${zoneId === z.id ? 'is-selected' : ''}`}
                    onClick={() => selectZone(z.id)}
                    disabled={soldOut}
                    aria-pressed={zoneId === z.id}
                  >
                    <span className="zone-name">{z.name}</span>
                    <span className={`zone-left ${z.available > 0 && z.available < 10 ? 'is-low' : ''}`}>
                      {soldOut ? 'Agotado' : `${z.available} disponibles`}
                    </span>
                    <span className="zone-price">{fm(z.price)}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {zone && (
            <div className="qty">
              <span id="qty-label">Boletos</span>
              <div className="stepper" role="group" aria-labelledby="qty-label">
                <button onClick={() => setQty((q) => q - 1)} disabled={qty <= 1} aria-label="Quitar uno">
                  −
                </button>
                <output aria-live="polite">{maxQty > 0 ? qty : 0}</output>
                <button onClick={() => setQty((q) => q + 1)} disabled={qty >= maxQty} aria-label="Agregar uno">
                  +
                </button>
              </div>
              <span className="qty-note">
                {maxQty > 0
                  ? `Hasta ${MAX_PER_ZONE} por zona${inCart ? `. Ya tienes ${inCart} en el carrito.` : '.'}`
                  : 'Ya tienes el máximo de esta zona en el carrito.'}
              </span>
            </div>
          )}

          <div className="buy-total">
            <p>
              <span>Subtotal</span>
              <strong>{fm(zone && maxQty > 0 ? zone.price * qty : 0)}</strong>
            </p>
            <button className="btn btn-solid" onClick={handleAdd} disabled={!zone || maxQty <= 0}>
              Agregar al carrito
            </button>
          </div>
          {added && (
            <button className="link-btn" onClick={onOpenCart}>
              Ir al carrito para pagar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default EventDetail
