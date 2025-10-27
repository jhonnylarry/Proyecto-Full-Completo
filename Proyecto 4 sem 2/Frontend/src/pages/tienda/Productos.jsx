import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../../services/productServices';
import { addItem } from '../../services/cartService';

const PAGE_SIZE = 12;

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name,asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAddedId, setLastAddedId] = useState(null);

  // Deriva categorías desde lo cargado (fallback o backend) si no existen endpoints de categorías
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => p.category && set.add(p.category));
    return [''].concat([...set]);
  }, [products]);

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getProducts({ search, category, page, size, sort }, ac.signal);
        // Normaliza nombres de campos del backend -> frontend
        const mapped = (data.content || []).map((p) => ({
          id: p.id,
          name: p.name || p.nombre,
          description: p.description || p.descripcion,
          price: p.price ?? p.precio,
          imageUrl: p.imageUrl || p.imagenUrl || p.imagen || '',
          category: p.category || p.categoria || '',
        }));

        setProducts(mapped);
        setPage(data.page ?? page);
        setSize(data.size ?? size);
        setTotalElements(data.totalElements ?? mapped.length);
        setTotalPages(data.totalPages ?? 1);
      } catch (e) {
        // Fallback a JSON local para visualización mientras no exista backend
        try {
          const res = await fetch('/data/productos.json', { signal: ac.signal });
          const json = await res.json();
          const items = (json.productos || []).map((p) => ({
            id: p.id,
            name: p.nombre,
            description: p.descripcion,
            price: p.precio,
            imageUrl: '',
            category: p.categoria || '',
          }));

          // Paginar en cliente para el fallback
          const start = page * size;
          const slice = items.slice(start, start + size);
          setProducts(slice);
          setTotalElements(items.length);
          setTotalPages(Math.max(1, Math.ceil(items.length / size)));
        } catch (e2) {
          setError(e?.message || 'No se pudieron cargar los productos.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, page, size, sort]);

  function onSubmit(e) {
    e.preventDefault();
    setPage(0);
    // el efecto se disparará por cambios en search/category/sort
  }

  function onAddToCart(product) {
    addItem(product, 1);
    setLastAddedId(product.id);
    // feedback breve
    setTimeout(() => setLastAddedId(null), 1200);
  }

  return (
    <section className="productos-page container">
      <header className="productos-header">
        <h1>Productos</h1>
        <form className="productos-filtros" onSubmit={onSubmit}>
          <input
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0); }}>
            {categories.map((c, i) => (
              <option value={c} key={i}>{c || 'Todas las categorías'}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }}>
            <option value="name,asc">Nombre (A-Z)</option>
            <option value="name,desc">Nombre (Z-A)</option>
            <option value="price,asc">Precio (menor a mayor)</option>
            <option value="price,desc">Precio (mayor a menor)</option>
          </select>
          <button type="submit">Aplicar</button>
        </form>
      </header>

      {loading && (
        <div className="estado">Cargando productos...</div>
      )}
      {error && !loading && (
        <div className="estado error">{error}</div>
      )}

      {!loading && !error && (
        <>
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
                    <span className="price">${'{'}p.price{'}'}</span>
                    <button className="btn-primary" onClick={() => onAddToCart(p)}>
                      {lastAddedId === p.id ? 'Agregado ✔' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="paginacion">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0}>
              Anterior
            </button>
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              Siguiente
            </button>
            <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
              {[6, 12, 24, 48].map((n) => (
                <option key={n} value={n}>{n} por página</option>
              ))}
            </select>
            <span className="total">Total: {totalElements}</span>
          </div>
        </>
      )}
    </section>
  );
}
