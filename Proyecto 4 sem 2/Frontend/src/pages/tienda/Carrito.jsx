import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTAR useNavigate
import { getCart, setCart, removeItem, updateQuantity, clearCart } from '../../services/cartService.js'; // <-- CORRECCIÓN: Añadida extensión .js

// (Tu constante de API)
const API_BASE_URL = 'http://localhost:8080/api';

// (Tu función de formato de moneda)
function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `$${(n ?? 0).toLocaleString('es-CL')}`;
  }
}

export default function Carrito() {
  const [items, setItems] = useState([]);
  
  // --- 2. NUEVOS ESTADOS ---
  const [usuario, setUsuario] = useState(null); // Para guardar al usuario logueado
  const [respuesta, setRespuesta] = useState(null); // Para mensajes de error/éxito
  const navigate = useNavigate(); // Para redirigir

  // --- 3. useEffect ACTUALIZADO ---
  useEffect(() => {
    // Carga los items del carrito (esto ya lo tenías)
    setItems(getCart());
    function onUpdate(e) { setItems(e.detail.items); }
    window.addEventListener('cart:update', onUpdate);
    
    // ¡NUEVO! Carga al usuario desde localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
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

  // --- 4. ¡NUEVA FUNCIÓN PARA PAGAR! ---
  const handlePagar = async () => {
    setRespuesta(null); // Limpiar mensajes

    // 4a. Verificar si el usuario está logueado
    if (!usuario) {
      setRespuesta({ message: "Debes iniciar sesión para poder comprar.", type: "error" });
      // Opcional: redirigir al login después de 2 segundos
      setTimeout(() => navigate('/IniciarSesion'), 2000);
      return;
    }
    
    // 4b. Verificar si es ADMIN (los admins no deberían comprar)
    if (usuario.role === 'ADMIN') {
        setRespuesta({ message: "Los administradores no pueden realizar compras.", type: "error" });
        return;
    }

    // 4c. Preparar el payload (el JSON para el backend)
    const payload = {
      // El backend espera un objeto "usuario" con "id"
      usuario: { id: usuario.id },
      
      // El backend espera una lista "detalles"
      detalles: items.map(item => ({
        // Cada detalle espera un "producto" con "id"
        producto: { id: item.id },
        // Y la cantidad
        cantidad: item.quantity
        // (El backend se encargará de buscar el precio y descontar el stock)
      }))
    };

    setRespuesta({ message: "Procesando pedido...", type: "info" });

    // 4d. Llamar al backend
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setRespuesta({ message: "¡Pedido realizado con éxito!", type: "success" });
        onClear(); // Vaciamos el carrito (localStorage y estado)
        // Opcional: redirigir a una página de "gracias"
        // setTimeout(() => navigate('/gracias-por-tu-compra'), 2000);
      } else {
        // Si el backend falla (ej. "Sin stock")
        const errorMsg = await response.text(); // Leemos el mensaje de error
        setRespuesta({ message: `Error: ${errorMsg || 'No se pudo procesar el pedido.'}`, type: "error" });
      }
    } catch (err) {
      console.error("Error de red al pagar:", err);
      setRespuesta({ message: "Error de conexión. Intenta más tarde.", type: "error" });
    }
  };


  // --- 5. JSX (HTML) ACTUALIZADO ---
  return (
    <section className="container carrito-page">
      <h1>Carrito</h1>

      {/* --- 6. Mostrar mensajes de respuesta (éxito/error) --- */}
      {respuesta && (
        <div 
          className="estado" 
          style={{ 
            color: respuesta.type === 'error' ? '#c00' : (respuesta.type === 'success' ? 'green' : '#333'),
            borderColor: respuesta.type === 'error' ? '#c00' : (respuesta.type === 'success' ? 'green' : '#ccc'),
            background: respuesta.type === 'error' ? '#ffeeee' : (respuesta.type === 'success' ? '#eeffee' : '#f4f4f4')
          }}
        >
          {respuesta.message}
        </div>
      )}

      {items.length === 0 && !respuesta ? ( // Oculta si hay un mensaje de "pedido exitoso"
        <div className="estado">Tu carrito está vacío. Explora nuestros <a href="/productos">productos</a>.</div>
      ) : items.length > 0 && ( // Solo muestra la tabla si hay items
        <div className="carrito-layout">
          <div className="carrito-table-wrapper">
            <table className="carrito-table">
              {/* ... (tu <thead> sigue igual) ... */}
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
              {/* ... (tu <tbody> sigue igual) ... */}
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

            {/* --- 7. BOTÓN "IR A PAGAR" ACTUALIZADO --- */}
            <button 
              className="btn-primary" 
              onClick={handlePagar}
              // Se deshabilita si no hay items, si no estás logueado, o si eres admin
              disabled={items.length === 0 || !usuario || usuario.role === 'ADMIN'}
              title={!usuario ? "Debes iniciar sesión para pagar" : (usuario.role === 'ADMIN' ? "Los admins no pueden comprar" : "Finalizar Pedido")}
            >
              Ir a pagar
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}