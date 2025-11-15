import React, { useState, useEffect, useMemo } from 'react';
import '../../EstiloA.css';

const API_URL = 'http://localhost:8080/api';

export default function MostrarPro() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchProductosAndCategorias = async () => {
            try {
                setLoading(true);
                const [productosResponse, categoriasResponse] = await Promise.all([
                    fetch(`${API_URL}/productos`),
                    fetch(`${API_URL}/catalogo`)
                ]);

                if (!productosResponse.ok || !categoriasResponse.ok) {
                    throw new Error('Error al obtener los datos del servidor.');
                }

                const productosData = await productosResponse.json();
                const categoriasData = await categoriasResponse.json();

                setProductos(Array.isArray(productosData) ? productosData : []);
                setCategorias(Array.isArray(categoriasData) ? categoriasData : []);

            } catch (error) {
                setError(error.message);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductosAndCategorias();
    }, []);

    const filteredProductos = useMemo(() => {
        return productos
            .filter(p => {
                const searchTermLower = searchTerm.toLowerCase();
                const matchesSearch = (p.nombre && p.nombre.toLowerCase().includes(searchTermLower)) ||
                                      (p.codigo_producto && p.codigo_producto.toLowerCase().includes(searchTermLower));
                return matchesSearch;
            })
            .filter(p => {
                if (!selectedCategory) return true;
                // Se comprueba directamente el ID dentro del objeto anidado 'categoria'
                return p.categoria && p.categoria.id === parseInt(selectedCategory);
            });
    }, [productos, searchTerm, selectedCategory]);

    const getStockStatus = (stock, stockCritico) => {
        if (stock === 0) return { text: 'Agotado', className: 'stock-agotado' };
        if (stock <= stockCritico) return { text: 'Stock Bajo', className: 'stock-bajo' };
        return { text: 'En Stock', className: 'stock-disponible' };
    };

    if (loading) {
        return <div className="admin-main"><h1>Cargando productos...</h1></div>;
    }

    if (error) {
        return <div className="admin-main"><h1>Error: {error}</h1></div>;
    }

    return (
        <div className="admin-main">
            <h1 className="admin-main-title">Stock de Productos</h1>

            <div className="stock-filters">
                <input
                    type="text"
                    placeholder="Buscar por código o nombre..."
                    className="stock-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    id="search-term"
                    name="search-term"
                />
                <select
                    className="stock-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    id="category-select"
                    name="category-select"
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="table-container">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Stock Crítico</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.length > 0 ? (
                            filteredProductos.map(p => {
                                const status = getStockStatus(p.stock, p.stock_critico);
                                return (
                                    <tr key={p.id}>
                                        <td>{p.codigo_producto || '-'}</td>
                                        <td>{p.nombre}</td>
                                        {/* Se accede directamente al nombre de la categoría desde el objeto anidado */}
                                        <td>{p.categoria ? p.categoria.nombre : 'N/A'}</td>
                                        <td>{p.stock}</td>
                                        <td>{p.stock_critico}</td>
                                        <td>
                                            <span className={`stock-status-badge ${status.className}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6">No se encontraron productos que coincidan con los filtros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}