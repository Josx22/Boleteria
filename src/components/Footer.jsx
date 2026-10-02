// Pie de página: aviso del proyecto, atribución de la API y reinicio de datos.
function Footer({ onReset, ratesError }) {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
       
        <p>
          {ratesError ? (
            'Sin conexión con la API de tipos de cambio: los precios se muestran en dólares.'
          ) : (
            // La API gratuita pide incluir este enlace de atribución.
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">
              Rates By Exchange Rate API
            </a>
          )}
        </p>
        <button className="text-btn" onClick={onReset}>
          Reiniciar datos de demostración
        </button>
      </div>
    </footer>
  )
}

export default Footer
