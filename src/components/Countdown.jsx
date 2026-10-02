import { useEffect, useState } from 'react'

function getRemaining(date) {
  const diff = Math.max(0, new Date(date) - new Date())
  return {
    total: diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

// Cuenta regresiva que se actualiza cada segundo con useEffect + setInterval.
function Countdown({ date }) {
  const [time, setTime] = useState(() => getRemaining(date))

  useEffect(() => {
    const timer = setInterval(() => setTime(getRemaining(date)), 1000)
    // Limpieza: detenemos el intervalo al salir de la página del evento.
    return () => clearInterval(timer)
  }, [date])

  if (time.total === 0) {
    return <p className="countdown">El evento ya comenzó.</p>
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <p className="countdown">
      Faltan <strong>{time.days} días</strong>{' '}
      <span className="countdown-clock">
        {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </span>
    </p>
  )
}

export default Countdown
