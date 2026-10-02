import EventRow from './EventRow'
import { monthLabel } from '../utils'

// Lista de eventos agrupada por mes, como la cartelera de una boletería.
function EventList({ events, money, onOpen, onClearFilters }) {
  if (events.length === 0) {
    return (
      <div className="empty">
        <p>Ningún evento coincide con tu búsqueda.</p>
        <button className="btn btn-line" onClick={onClearFilters}>
          Ver toda la cartelera
        </button>
      </div>
    )
  }

  // Agrupar: { "octubre de 2026": [evento, evento], ... }
  const groups = events.reduce((acc, ev) => {
    const key = monthLabel(ev.date)
    ;(acc[key] ||= []).push(ev)
    return acc
  }, {})

  return (
    <div className="months">
      {Object.entries(groups).map(([month, list]) => (
        <section key={month} className="month">
          <h3 className="month-name">{month}</h3>
          <ol className="rows">
            {list.map((event) => (
              <EventRow key={event.id} event={event} money={money} onOpen={onOpen} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

export default EventList
