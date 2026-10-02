import { useEffect, useState } from 'react'

// API pública y gratuita (no necesita API key) para tipos de cambio.
// Documentación: https://www.exchangerate-api.com/docs/free
const API_URL = 'https://open.er-api.com/v6/latest/USD'

// Monedas que mostramos en el selector.
export const CURRENCIES = ['USD', 'GTQ', 'HNL', 'MXN', 'EUR']

// Hook personalizado: consulta la API una sola vez al cargar la app (useEffect)
// y devuelve las tasas de cambio, si está cargando y si hubo error.
export function useExchangeRates() {
  const [rates, setRates] = useState({ USD: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadRates() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (data.result !== 'success') throw new Error('Respuesta inválida de la API')

        if (!cancelled) {
          const selected = {}
          CURRENCIES.forEach((code) => {
            if (data.rates[code]) selected[code] = data.rates[code]
          })
          setRates(selected)
          setUpdatedAt(data.time_last_update_utc)
        }
      } catch (err) {
        // Si no hay internet o la API falla, la app sigue funcionando en USD.
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRates()

    // Limpieza: evita actualizar el estado si el componente se desmonta.
    return () => {
      cancelled = true
    }
  }, [])

  return { rates, loading, error, updatedAt }
}
