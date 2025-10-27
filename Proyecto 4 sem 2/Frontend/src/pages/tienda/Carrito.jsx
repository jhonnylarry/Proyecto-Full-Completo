import { useEffect, useMemo, useState } from 'react';
import { getCart, setCart, removeItem, updateQuantity, clearCart } from '../../services/cartService';

function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `$${(n ?? 0).toLocaleString('es-CL')}`;
  }
}

export default function Carrito() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
    function onUpdate(e) { setItems(e.detail.items); }
    window.addEventListener('cart:update', onUpdate);
    return () => window.removeEventListener('cart:update', onUpdate);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  }, [items]);

  function onRemove(id) {
    const updated = removeItem(id);
    setItems(updated);
  }

  function onChangeQty(id, qty) {
    const updated = updateQuantity(id, qty);
    setItems(updated);
  }

  function onClear() {
    clearCart();
    setItems([]);
  }

  // Mantener estética limpia basada en EstiloT.css
  return (
    <section className="container carrito-page">
      <h1>Carrito</h1>

      {items.length === 0 ? (
        <div className="estado">Tu carrito está vacío. Explora nuestros <a href="/productos">productos</a>.</div>
      ) : (
        <div className="carrito-layout">
          <div className="carrito-table-wrapper">
            <table className="carrito-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Img</th>
                  <th>Producto</th>
                  <th style={{ width: '120px' }}>Precio</th>
                  <th style={{ width: '120px' }}>Cantidad</th>
                  <th style={{ width: '120px' }}>Total</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const total = (Number(it.price) || 0) * (Number(it.quantity) || 0);
                  return (
                    <tr key={it.id}>
                      <td>
                        {it.imageUrl ? (
                          <img src={it.imageUrl} alt={it.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                        ) : (
                          <div className="placeholder-img" style={{ fontSize: 24 }}>📦</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{it.name}</div>
                        {it.category && <small style={{ color: '#666' }}>{it.category}</small>}
                      </td>
                      <td>{formatCurrency(it.price)}</td>
                      <td>
                        <div className="qty-control">
                          <button onClick={() => onChangeQty(it.id, Number(it.quantity) - 1)}>-</button>
                          <input
                            type="number"
                            min={1}
                            value={it.quantity}
                            onChange={(e) => onChangeQty(it.id, e.target.value)}
                          />
                          <button onClick={() => onChangeQty(it.id, Number(it.quantity) + 1)}>+</button>
                        </div>
                      </td>
                      <td>{formatCurrency(total)}</td>
                      <td>
                        <button className="btn-danger" onClick={() => onRemove(it.id)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="carrito-actions">
              <a href="/productos" className="btn-secondary">Seguir comprando</a>
              <button className="btn-light" onClick={onClear}>Vaciar carrito</button>
            </div>
          </div>

          <aside className="carrito-resumen">
            <h3>Resumen</h3>
            <div className="resumen-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="resumen-row">
              <span>Envío</span>
              <span>Calculado al pagar</span>
            </div>
            <div className="resumen-total">
              <span>Total</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <button className="btn-primary" disabled title="Integración de pago pendiente">
              Ir a pagar
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
