import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import FeaturedEvent from './components/FeaturedEvent'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import EventList from './components/EventList'
import EventDetail from './components/EventDetail'
import Cart from './components/Cart'
import CheckoutForm from './components/CheckoutForm'
import MyTickets from './components/MyTickets'
import Toast from './components/Toast'
import Footer from './components/Footer'
import { EVENTS } from './data/events'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useExchangeRates } from './hooks/useExchangeRates'
import { SERVICE_FEE, ticketCode, totalAvailable } from './utils'

function App() {
  // ---------- Estado que se guarda en localStorage ----------
  const [events, setEvents] = useLocalStorage('tq-events-v2', EVENTS)
  const [cart, setCart] = useLocalStorage('tq-cart-v2', [])
  const [orders, setOrders] = useLocalStorage('tq-orders-v2', [])
  const [currency, setCurrency] = useLocalStorage('tq-currency', 'USD')

  // ---------- Estado de la interfaz ----------
  const [view, setView] = useState('cartelera') // 'cartelera' | 'evento' | 'boletos'
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Tipos de cambio desde la API pública.
  const { rates, loading: ratesLoading, error: ratesError } = useExchangeRates()
  const money = { currency, rates }

  // Cada vez que cambia la vista, subimos al inicio de la página.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, selectedId])

  // Título de la pestaña según lo que se está viendo.
  useEffect(() => {
    const current = events.find((e) => e.id === selectedId)
    const titles = {
      cartelera: 'Cartelera',
      evento: current?.title ?? 'Evento',
      boletos: 'Mis boletos',
    }
    document.title = `${titles[view]} | Taquilla SV`
  }, [view, selectedId, events])

  // ---------- Datos derivados ----------
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  )

  // El evento destacado es el próximo que todavía tiene boletos.
  const featured = sortedEvents.find((e) => totalAvailable(e) > 0)

  const filteredEvents = useMemo(() => {
    const text = search.trim().toLowerCase()
    return sortedEvents.filter((ev) => {
      const matchesCategory = category === 'todos' || ev.category === category
      const matchesText =
        text === '' ||
        ev.title.toLowerCase().includes(text) ||
        ev.venue.toLowerCase().includes(text) ||
        ev.city.toLowerCase().includes(text)
      return matchesCategory && matchesText
    })
  }, [sortedEvents, search, category])

  // Cantidad de eventos por categoría (para mostrarla en los filtros).
  const counts = useMemo(() => {
    const result = { todos: events.length }
    events.forEach((e) => {
      result[e.category] = (result[e.category] || 0) + 1
    })
    return result
  }, [events])

  // El carrito solo guarda ids y cantidades; aquí lo unimos con los datos del evento.
  const cartDetails = cart
    .map((item) => {
      const event = events.find((e) => e.id === item.eventId)
      const zone = event?.zones.find((z) => z.id === item.zoneId)
      return event && zone ? { ...item, event, zone } : null
    })
    .filter(Boolean)

  const cartCount = cartDetails.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cartDetails.reduce((sum, item) => sum + item.qty * item.zone.price, 0)
  const fee = subtotal * SERVICE_FEE
  const total = subtotal + fee
  const ticketCount = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0)

  const selectedEvent = events.find((e) => e.id === selectedId) || null

  // ---------- Acciones ----------
  const hideToast = useCallback(() => setToast(null), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  function showToast(message) {
    setToast({ message, id: Date.now() })
  }

  function openEvent(id) {
    setSelectedId(id)
    setView('evento')
  }

  function goTo(newView) {
    setView(newView)
    if (newView !== 'evento') setSelectedId(null)
  }

  function addToCart(eventId, zoneId, qty) {
    setCart((prev) => {
      const existing = prev.find((i) => i.eventId === eventId && i.zoneId === zoneId)
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { eventId, zoneId, qty }]
    })
    showToast(`${qty} boleto${qty > 1 ? 's' : ''} agregado${qty > 1 ? 's' : ''} al carrito`)
  }

  function updateQty(eventId, zoneId, qty) {
    setCart((prev) =>
      prev
        .map((i) => (i.eventId === eventId && i.zoneId === zoneId ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    )
  }

  function removeFromCart(eventId, zoneId) {
    setCart((prev) => prev.filter((i) => !(i.eventId === eventId && i.zoneId === zoneId)))
  }

  function completePurchase(buyer) {
    // 1. Crear la orden con un código único por boleto.
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      buyer,
      total,
      items: cartDetails.map((item) => ({
        eventId: item.event.id,
        title: item.event.title,
        date: item.event.date,
        venue: item.event.venue,
        color: item.event.color,
        zoneName: item.zone.name,
        price: item.zone.price,
        qty: item.qty,
        codes: Array.from({ length: item.qty }, ticketCode),
      })),
    }

    // 2. Descontar los boletos vendidos de la disponibilidad.
    setEvents((prev) =>
      prev.map((ev) => ({
        ...ev,
        zones: ev.zones.map((z) => {
          const sold = cart.find((i) => i.eventId === ev.id && i.zoneId === z.id)
          return sold ? { ...z, available: Math.max(0, z.available - sold.qty) } : z
        }),
      }))
    )

    // 3. Guardar la orden, vaciar el carrito y mostrar los boletos.
    setOrders((prev) => [order, ...prev])
    setCart([])
    setCheckoutOpen(false)
    setCartOpen(false)
    goTo('boletos')
    showToast('Compra confirmada. Tus boletos ya están aquí.')
  }

  function resetDemo() {
    setEvents(EVENTS)
    setCart([])
    setOrders([])
    goTo('cartelera')
    showToast('Datos de demostración reiniciados')
  }

  // ---------- Interfaz ----------
  return (
    <div className="app">
      <Navbar
        view={view}
        onNavigate={goTo}
        cartCount={cartCount}
        ticketCount={ticketCount}
        onOpenCart={() => setCartOpen(true)}
        currency={currency}
        onChangeCurrency={setCurrency}
        rates={rates}
        ratesLoading={ratesLoading}
      />

      <main>
        {view === 'cartelera' && (
          <>
            {featured && <FeaturedEvent event={featured} money={money} onOpen={openEvent} />}

            <section className="wrap listing" aria-labelledby="cartelera-title">
              <div className="listing-head">
                <h2 id="cartelera-title">Cartelera</h2>
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <CategoryFilter selected={category} onSelect={setCategory} counts={counts} />
              <EventList
                events={filteredEvents}
                money={money}
                onOpen={openEvent}
                onClearFilters={() => {
                  setSearch('')
                  setCategory('todos')
                }}
              />
            </section>
          </>
        )}

        {view === 'evento' && selectedEvent && (
          <EventDetail
            key={selectedEvent.id}
            event={selectedEvent}
            cart={cart}
            money={money}
            onBack={() => goTo('cartelera')}
            onAdd={addToCart}
            onOpenCart={() => setCartOpen(true)}
          />
        )}

        {view === 'boletos' && (
          <MyTickets orders={orders} money={money} onBrowse={() => goTo('cartelera')} />
        )}
      </main>

      <Footer onReset={resetDemo} ratesError={ratesError} />

      <Cart
        open={cartOpen}
        items={cartDetails}
        subtotal={subtotal}
        fee={fee}
        total={total}
        money={money}
        onClose={closeCart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => setCheckoutOpen(true)}
      />

      {checkoutOpen && (
        <CheckoutForm
          total={total}
          count={cartCount}
          money={money}
          onCancel={() => setCheckoutOpen(false)}
          onConfirm={completePurchase}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} onDone={hideToast} />}
    </div>
  )
}

export default App
