import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

// Función para formatear dinero
function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `$${(n ?? 0).toLocaleString('es-CL')}`;
  }
}

// Función para formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'Fecha desconocida';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function HistorialCompras() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Obtenemos el usuario logueado
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      navigate('/IniciarSesion');
      return;
    }
    const usuario = JSON.parse(usuarioGuardado);

    // 2. Hacemos fetch de TODOS los pedidos
    fetch(`${API_BASE_URL}/pedidos`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el historial');
        return res.json();
      })
      .then(data => {
        // 3. FILTRAMOS: Solo guardamos los pedidos de ESTE usuario
        // (Asegúrate que tu backend devuelva el objeto 'usuario' dentro del pedido con su id)
        const misPedidos = data.filter(p => p.usuario.id === usuario.id);
        
        // Los ordenamos por fecha (más reciente primero)
        misPedidos.sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta));
        
        setPedidos(misPedidos);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar el historial.');
        setLoading(false);
      });
  }, [navigate]);

  return (
    <main className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '30px', color: '#0077cc' }}>Mis Compras</h1>

      {loading && <p>Cargando historial...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && pedidos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Aún no has realizado ninguna compra.</h3>
          <Link to="/productos" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
            Ir a la Tienda
          </Link>
        </div>
      )}

      {!loading && pedidos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pedidos.map(pedido => (
            <div key={pedido.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '12px', 
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              
              {/* Cabecera del Pedido */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderBottom: '1px solid #eee', 
                paddingBottom: '10px', 
                marginBottom: '15px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#333' }}>Pedido #{pedido.id}</strong>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>
                    {formatDate(pedido.fechaVenta)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Total</div>
                  <strong style={{ fontSize: '1.2rem', color: '#00a651' }}>
                    {formatCurrency(pedido.valorTotal)}
                  </strong>
                </div>
              </div>

              {/* Detalles (Lista de productos) */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '15px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1rem' }}>Productos:</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pedido.detalles.map((detalle, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px',
                      borderBottom: index < pedido.detalles.length - 1 ? '1px dashed #ddd' : 'none',
                      paddingBottom: '8px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>{detalle.cantidad}x</span>
                        <span>{detalle.producto.nombre}</span>
                      </span>
                      <span>{formatCurrency(detalle.precioUnitario * detalle.cantidad)}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}