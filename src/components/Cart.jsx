import { useEffect } from 'react'
import { formatDate, formatMoney } from '../utils'

// Panel lateral con los boletos agregados. Tiene forma de recibo de taquilla.
function Cart({ open, items, subtotal, fee, total, money, onClose, onUpdateQty, onRemove, onCheckout }) {
  const fm = (n) => formatMoney(n, money.currency, money.rates)

  // Cerrar con la tecla Escape mientras está abierto.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div className={`shade ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`cart ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Carrito">
        <div className="cart-head">
          <h2>Carrito</h2>
          <button className="text-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">
            Todavía no agregaste boletos. Elige un evento en la cartelera y selecciona tu zona.
          </p>
        ) : (
          <div className="receipt">
            <ul className="receipt-items">
              {items.map(({ event, zone, qty }) => {
                const max = Math.min(8, zone.available)
                return (
                  <li key={`${event.id}-${zone.id}`} style={{ '--ink': event.color }}>
                    <div className="receipt-line">
                      <strong>{event.title}</strong>
                      <span>{fm(zone.price * qty)}</span>
                    </div>
                    <p className="receipt-meta">
                      {zone.name}, {fm(zone.price)} cada uno
                      <br />
                      <span className="capitalize">{formatDate(event.date)}</span>
                    </p>
                    <div className="receipt-actions">
                      <div className="stepper is-small" role="group" aria-label={`Cantidad para ${zone.name}`}>
                        <button onClick={() => onUpdateQty(event.id, zone.id, qty - 1)} aria-label="Quitar uno">
                          −
                        </button>
                        <output>{qty}</output>
                        <button
                          onClick={() => onUpdateQty(event.id, zone.id, qty + 1)}
                          disabled={qty >= max}
                          aria-label="Agregar uno"
                        >
                          +
                        </button>
                      </div>
                      <button className="text-btn is-danger" onClick={() => onRemove(event.id, zone.id)}>
                        Quitar
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <dl className="receipt-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{fm(subtotal)}</dd>
              </div>
              <div>
                <dt>Cargo por servicio (8 %)</dt>
                <dd>{fm(fee)}</dd>
              </div>
              <div className="is-total">
                <dt>Total</dt>
                <dd>{fm(total)}</dd>
              </div>
            </dl>
            {money.currency !== 'USD' && (
              <p className="receipt-note">Se cobrará en dólares: {formatMoney(total)}</p>
            )}

            <button className="btn btn-solid is-wide" onClick={onCheckout}>
              Continuar al pago
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default Cart
