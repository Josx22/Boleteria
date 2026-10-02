import { useEffect, useState } from 'react'

// Hook personalizado: funciona igual que useState, pero además guarda
// el valor en localStorage para que no se pierda al recargar la página.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  // Cada vez que cambia el valor, lo guardamos.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Si el navegador bloquea localStorage, la app sigue funcionando sin guardar.
    }
  }, [key, value])

  return [value, setValue]
}
