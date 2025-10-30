import { useEffect, useState } from 'react';
import { addItem } from '../../services/cartService';

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAddedId, setLastAddedId] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      
      try {
        const res = await fetch('http://localhost:8080/api/productos', { signal: ac.signal });
        
        if (!res.ok) {
          throw new Error('Error al cargar productos');
        }
        
        const data = await res.json();
        
        // Normaliza nombres de campos del backend -> frontend
        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.id,
          name: p.name || p.nombre,
          description: p.description || p.descripcion,
          price: p.price ?? p.precio,
          imageUrl: p.id ? `http://localhost:8080/api/productos/${p.id}/imagen` : '',
          category: p.category?.nombre || p.categoria?.nombre || p.category || p.categoria || '',
        }));

        setProducts(mapped);
      } catch (e) {
        // Ignorar errores de abort
        if (e.name === 'AbortError' || ac.signal.aborted) {
          return;
        }
        console.error('Error al cargar productos:', e);
        setError(e?.message || 'No se pudieron cargar los productos.');
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => ac.abort();
  }, []);

  function getQuantity(productId) {
    return quantities[productId] || 1;
  }

  function setQuantity(productId, value) {
    const qty = Math.max(1, Math.min(99, parseInt(value) || 1));
    setQuantities(prev => ({ ...prev, [productId]: qty }));
  }

  function incrementQuantity(productId) {
    setQuantity(productId, getQuantity(productId) + 1);
  }

  function decrementQuantity(productId) {
    setQuantity(productId, getQuantity(productId) - 1);
  }

  function onAddToCart(product) {
    const quantity = getQuantity(product.id);
    addItem(product, quantity);
    setLastAddedId(product.id);
    // Resetear cantidad después de agregar
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    // feedback breve
    setTimeout(() => setLastAddedId(null), 1200);
  }

  return (
    <section className="productos-page container">
      <header className="productos-header">
        <h1>Productos</h1>
      </header>

      {loading && (
        <div className="estado">Cargando productos...</div>
      )}
      {error && !loading && (
        <div className="estado error">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="estado-vacio">
          <span className="icono-vacio">📦</span>
          <h3>No hay productos disponibles</h3>
          <p>Por el momento no hay productos en el catálogo. Vuelve pronto.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid-productos">
          {products.map((p) => (
            <article className="card-producto" key={p.id}>
              <div className="card-img" aria-hidden>
                {/* Usa p.imageUrl si existe cuando el backend lo provea */}
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  <div className="placeholder-img">📦</div>
                )}
              </div>
              <div className="card-body">
                <h3 className="card-title">{p.name}</h3>
                {p.category && <span className="badge-categoria">{p.category}</span>}
                <p className="card-desc">{p.description}</p>
                <div className="card-footer">
                  <span className="price">${p.price}</span>
                  <div className="quantity-controls">
                    <button 
                      className="btn-quantity" 
                      onClick={() => decrementQuantity(p.id)}
                      disabled={getQuantity(p.id) <= 1}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      className="quantity-input"
                      value={getQuantity(p.id)}
                      onChange={(e) => setQuantity(p.id, e.target.value)}
                      min="1"
                      max="99"
                    />
                    <button 
                      className="btn-quantity" 
                      onClick={() => incrementQuantity(p.id)}
                      disabled={getQuantity(p.id) >= 99}
                    >
                      +
                    </button>
                  </div>
                  <button className="btn-add-cart" onClick={() => onAddToCart(p)}>
                    {lastAddedId === p.id ? '✔ Agregado' : 'Agregar'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
