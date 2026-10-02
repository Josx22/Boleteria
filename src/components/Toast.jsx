import { useEffect } from 'react'

// Aviso que confirma una acción y desaparece solo a los 3 segundos.
function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}

export default Toast
