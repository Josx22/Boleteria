import TicketStub from './TicketStub'
import { formatMoney } from '../utils'

// Vista "Mis boletos": cada compra con sus boletos impresos.
function MyTickets({ orders, money, onBrowse }) {
  return (
    <section className="wrap tickets-page">
      <h1 className="page-title">Mis boletos</h1>

      {orders.length === 0 ? (
        <div className="empty">
          <p>Aquí aparecerán tus boletos cuando completes una compra.</p>
          <button className="btn btn-solid" onClick={onBrowse}>
            Ver la cartelera
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <section key={order.id} className="order" aria-label={`Orden ${order.id}`}>
            <header className="order-head">
              <p>
                <strong>Orden {order.id}</strong>
                <br />
                Comprada el {new Date(order.createdAt).toLocaleString('es-SV')} por {order.buyer.name}, tarjeta
                terminada en {order.buyer.cardLast4}
              </p>
              <p className="order-total">{formatMoney(order.total, money.currency, money.rates)}</p>
            </header>
            <div className="ticket-stack">
              {order.items.flatMap((item) =>
                item.codes.map((code, i) => (
                  <TicketStub
                    key={code}
                    item={item}
                    code={code}
                    holder={order.buyer.name}
                    number={i + 1}
                    of={item.codes.length}
                  />
                ))
              )}
            </div>
          </section>
        ))
      )}
    </section>
  )
}

export default MyTickets
