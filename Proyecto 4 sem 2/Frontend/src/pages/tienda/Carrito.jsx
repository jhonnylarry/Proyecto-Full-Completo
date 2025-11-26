import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeItem, updateQuantity, clearCart } from '../../services/cartService.js';
import { jsPDF } from 'jspdf'; // <--- IMPORTANTE: Librería para crear el PDF
import autoTable from "jspdf-autotable"; // <--- IMPORTANTE: Librería para la tabla del PDF

const API_BASE_URL = 'http://localhost:8080/api';

// Función para formatear dinero (CLP)
function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `$${(n ?? 0).toLocaleString('es-CL')}`;
  }
}

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const navigate = useNavigate();

  // --- Cargar carrito y usuario ---
  useEffect(() => {
    setItems(getCart());
    
    function onUpdate(e) { setItems(e.detail.items); }
    window.addEventListener('cart:update', onUpdate);
    
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
    return () => window.removeEventListener('cart:update', onUpdate);
  }, []);

  // --- Calcular total ---
  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  }, [items]);

  // --- Funciones del carrito ---
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

  // --- FUNCIÓN GENERAR BOLETA PDF ---
  const generarBoletaPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-CL');
    const hora = new Date().toLocaleTimeString('es-CL');

    // -- Encabezado --
    doc.setFontSize(20);
    doc.text("Verde-Souvenir", 14, 22);
    
    doc.setFontSize(10);
    doc.text("RUT: 77.777.777-7", 14, 28);
    doc.text("Dirección: Av. Pajaritos 1234, Maipú", 14, 34);
    
    // -- Datos del Cliente --
    doc.text(`Fecha: ${fecha} - ${hora}`, 14, 45);
    doc.text(`Cliente: ${usuario ? usuario.nombre : 'Cliente Invitado'}`, 14, 50);
    
    // -- Tabla de Productos --
    const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Total"];
    const tableRows = [];

    items.forEach(item => {
      const itemData = [
        item.name,
        item.quantity,
        formatCurrency(item.price),
        formatCurrency(item.price * item.quantity)
      ];
      tableRows.push(itemData);
    });

    // --- AQUÍ ESTÁ EL ARREGLO MÁGICO ---
    // En vez de doc.autoTable(...), llamamos a la función directamente y le pasamos el doc
    autoTable(doc, {
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
    });
    // ------------------------------------

    // -- Total Final --
    // OJO: Como usamos autoTable directo, a veces 'lastAutoTable' se guarda distinto.
    // Usamos (doc.lastAutoTable || doc.autoTable.previous) para asegurar.
    const finalY = (doc.lastAutoTable || doc.autoTable.previous).finalY + 10;
    
    doc.setFontSize(14);
    doc.text(`TOTAL A PAGAR: ${formatCurrency(subtotal)}`, 14, finalY);

    doc.setFontSize(10);
    doc.text("¡Gracias por tu compra!", 14, finalY + 10);

    doc.save(`Boleta_${Date.now()}.pdf`);
  };

  // --- FUNCIÓN PAGAR ---
  const handlePagar = async () => {
    setRespuesta(null);

    // Validaciones
    if (!usuario) {
      setRespuesta({ message: "Debes iniciar sesión para poder comprar.", type: "error" });
      setTimeout(() => navigate('/IniciarSesion'), 2000);
      return;
    }
    
    if (usuario.role === 'ADMIN') {
        setRespuesta({ message: "Los administradores no pueden realizar compras.", type: "error" });
        return;
    }

    // Preparar datos para backend
    const payload = {
      usuario: { id: usuario.id },
      detalles: items.map(item => ({
        producto: { id: item.id },
        cantidad: item.quantity
      }))
    };

    setRespuesta({ message: "Procesando pedido...", type: "info" });

    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setRespuesta({ message: "¡Pedido realizado con éxito! Descargando boleta...", type: "success" });
        
        // 1. Generamos la boleta AHORA que sabemos que se pagó bien
        generarBoletaPDF();
        
        // 2. Limpiamos el carrito
        onClear(); 

      } else {
        const errorMsg = await response.text();
        setRespuesta({ message: `Error: ${errorMsg || 'No se pudo procesar el pedido.'}`, type: "error" });
      }
    } catch (err) {
      console.error("Error de red al pagar:", err);
      setRespuesta({ message: "Error de conexión. Intenta más tarde.", type: "error" });
    }
  };

  return (
    <section className="container carrito-page">
      <h1>Carrito</h1>

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

      {items.length === 0 && !respuesta ? (
        <div className="estado">Tu carrito está vacío. Explora nuestros <a href="/productos">productos</a>.</div>
      ) : items.length > 0 && (
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

            <button 
              className="btn-primary" 
              onClick={handlePagar}
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