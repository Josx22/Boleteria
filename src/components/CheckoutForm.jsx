import { useEffect, useState } from 'react'
import { formatMoney } from '../utils'

const EMPTY = { name: '', email: '', card: '', expiry: '', cvv: '' }

// Valida cada campo y devuelve un objeto con los mensajes de error.
function validate(form) {
  const errors = {}
  if (form.name.trim().length < 3) errors.name = 'Escribe tu nombre y apellido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Revisa el correo: falta la @ o el dominio'
  if (form.card.replace(/\s/g, '').length !== 16) errors.card = 'La tarjeta debe tener 16 dígitos'

  const match = form.expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) {
    errors.expiry = 'Escribe mes y año, por ejemplo 08/28'
  } else {
    // La tarjeta vence al final del mes indicado.
    const expiryDate = new Date(2000 + Number(match[2]), Number(match[1]), 1)
    if (expiryDate <= new Date()) errors.expiry = 'La tarjeta está vencida'
  }

  if (!/^\d{3}$/.test(form.cvv)) errors.cvv = 'Son los 3 dígitos del reverso'
  return errors
}

// Formulario de pago SIMULADO (no se conecta a ningún banco).
function CheckoutForm({ total, count, money, onCancel, onConfirm }) {
  const [form, setForm] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [processing, setProcessing] = useState(false)

  const errors = validate(form)
  const isValid = Object.keys(errors).length === 0

  // Simula el tiempo de respuesta de una pasarela de pago.
  useEffect(() => {
    if (!processing) return
    const timer = setTimeout(() => {
      onConfirm({
        name: form.name.trim(),
        email: form.email.trim(),
        cardLast4: form.card.replace(/\s/g, '').slice(-4), // solo guardamos los últimos 4
      })
    }, 1500)
    return () => clearTimeout(timer)
  }, [processing]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    let { name, value } = e.target
    // Formato automático mientras se escribe.
    if (name === 'card') {
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4)
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, card: true, expiry: true, cvv: true })
    if (isValid) setProcessing(true)
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <div className="dialog-shade" onClick={processing ? undefined : onCancel}>
      <form
        className="dialog"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        noValidate
        aria-labelledby="checkout-title"
      >
        <div className="dialog-head">
          <h2 id="checkout-title">Pago</h2>
          <p>
            {count} boleto{count !== 1 ? 's' : ''} por {formatMoney(total, money.currency, money.rates)}
          </p>
        </div>

        <p className="demo-note">
          Este pago es de prueba y no cobra nada. Usa la tarjeta <code>4242 4242 4242 4242</code>, cualquier fecha
          futura y cualquier CVV. No escribas datos reales.
        </p>

        <fieldset disabled={processing}>
          <label className={`field ${showError('name') ? 'is-invalid' : ''}`}>
            <span>Nombre completo</span>
            <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
            {showError('name') && <small>{errors.name}</small>}
          </label>

          <label className={`field ${showError('email') ? 'is-invalid' : ''}`}>
            <span>Correo para recibir los boletos</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
            {showError('email') && <small>{errors.email}</small>}
          </label>

          <label className={`field ${showError('card') ? 'is-invalid' : ''}`}>
            <span>Número de tarjeta</span>
            <input name="card" inputMode="numeric" placeholder="0000 0000 0000 0000" value={form.card} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
            {showError('card') && <small>{errors.card}</small>}
          </label>

          <div className="field-pair">
            <label className={`field ${showError('expiry') ? 'is-invalid' : ''}`}>
              <span>Vencimiento</span>
              <input name="expiry" inputMode="numeric" placeholder="MM/AA" value={form.expiry} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
              {showError('expiry') && <small>{errors.expiry}</small>}
            </label>
            <label className={`field ${showError('cvv') ? 'is-invalid' : ''}`}>
              <span>CVV</span>
              <input name="cvv" inputMode="numeric" placeholder="123" value={form.cvv} onChange={handleChange} onBlur={handleBlur} autoComplete="off" />
              {showError('cvv') && <small>{errors.cvv}</small>}
            </label>
          </div>
        </fieldset>

        <div className="dialog-actions">
          <button type="button" className="btn btn-line" onClick={onCancel} disabled={processing}>
            Volver al carrito
          </button>
          <button type="submit" className="btn btn-solid" disabled={processing}>
            {processing ? 'Procesando pago…' : `Pagar ${formatMoney(total)}`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutForm
