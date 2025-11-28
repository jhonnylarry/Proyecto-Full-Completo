import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts } from '../../services/productServices.js';
import '../../EstiloA.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function ModificarPro() {
	const navigate = useNavigate();
	const { productoId } = useParams();
	const isSelectionMode = !productoId;

	const [producto, setProducto] = useState({
		codigo_producto: '',
		nombre: '',
		descripcion: '',
		precio: '',
		stock: '',
		stock_critico: '',
		categoria: '', // id de categoria (string)
		activo: true,
	});
	const [categorias, setCategorias] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingInit, setLoadingInit] = useState(true);
	const [error, setError] = useState(null);

	// Estado para modo selección (listar productos)
	const [lista, setLista] = useState([]);
	const [listLoading, setListLoading] = useState(false);
	const [search, setSearch] = useState('');

	// Imagen existente y nueva
	const [imagenActualUrl, setImagenActualUrl] = useState(null);
	const [imagenFile, setImagenFile] = useState(null);
	const [imagenPreview, setImagenPreview] = useState(null);

	// Cargar categorías y datos del producto (solo en modo edición)
	useEffect(() => {
		const ac = new AbortController();

		async function loadData() {
			setLoadingInit(true);
			try {
				if (isSelectionMode) return; // No cargar datos de edición cuando estamos en selección

				// 1) Categorías (siguiendo la lógica de CrearPro: /catalogo)
				const resCat = await fetch(`${API_BASE_URL}/catalogo`, { signal: ac.signal });
				if (!resCat.ok) throw new Error('Error al cargar categorías');
				const dataCat = await resCat.json();
				const normalizadas = Array.isArray(dataCat)
					? dataCat
							.map((cat) => {
								const id = cat?.id ?? cat?.idCategoria ?? cat?.catalogoId ?? cat?.codigo ?? cat?.Id;
								const nombre = cat?.nombre ?? cat?.name ?? cat?.titulo ?? cat?.descripcion ?? (id != null ? `Categoría ${id}` : 'Categoría');
								return id != null ? { id, nombre: String(nombre) } : null;
							})
							.filter(Boolean)
					: [];
				setCategorias(normalizadas);

				// 2) Producto
				const resProd = await fetch(`${API_BASE_URL}/productos/${productoId}`, { signal: ac.signal });
				if (!resProd.ok) throw new Error('Error al cargar producto');
				const p = await resProd.json();

				setProducto({
					codigo_producto: p.codigo_producto ?? '',
					nombre: p.nombre ?? '',
					descripcion: p.descripcion ?? '',
					precio: p.precio != null ? String(p.precio) : '',
					stock: p.stock != null ? String(p.stock) : '',
					stock_critico: p.stock_critico != null ? String(p.stock_critico) : '',
					categoria: String(p?.categoria?.id ?? ''),
					activo: p.activo ?? true,
				});

				// 3) Imagen actual (si existe)
				try {
					const imgRes = await fetch(`${API_BASE_URL}/productos/${productoId}/imagen`, { signal: ac.signal });
					if (imgRes.ok) {
						const blob = await imgRes.blob();
						if (blob.size > 0) setImagenActualUrl(URL.createObjectURL(blob));
					}
				} catch { /* ignorar */ }

			} catch (err) {
				console.error(err);
				setError(err.message || 'No se pudo cargar la información');
			} finally {
				setLoadingInit(false);
			}
		}

		loadData();
		return () => ac.abort();
	}, [API_BASE_URL, productoId, isSelectionMode]);

	// Cargar lista de productos (solo en modo selección)
	useEffect(() => {
		if (!isSelectionMode) return;
		const ac = new AbortController();
		(async () => {
			try {
				setListLoading(true);
				const data = await getProducts({ page: 0, size: 100 }, ac.signal);
				setLista(Array.isArray(data?.content) ? data.content : []);
			} catch (err) {
				if (err?.name === 'AbortError') return; // ignorar aborts para no ensuciar UI
				console.error(err);
				setError(err.message || 'No se pudo cargar el listado de productos');
			} finally {
				setListLoading(false);
			}
		})();
		return () => ac.abort();
	}, [isSelectionMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProducto((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			setError('Solo se permiten archivos de imagen');
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			setError('La imagen debe ser menor o igual a 2MB');
			return;
		}
		setImagenFile(file);
		setError(null);
		const reader = new FileReader();
		reader.onload = () => setImagenPreview(reader.result);
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		// Validaciones
		const precioParsed = producto.precio !== '' ? parseInt(producto.precio, 10) : NaN;
		if (isNaN(precioParsed) || precioParsed <= 0) {
			setError('Ingresa un precio válido mayor que 0');
			setLoading(false);
			return;
		}

		const stockParsed = producto.stock !== '' ? parseInt(producto.stock, 10) : 0;
		if (isNaN(stockParsed) || stockParsed < 0) {
			setError('El stock debe ser un número válido mayor o igual a 0');
			setLoading(false);
			return;
		}

		const stockCriticoParsed = producto.stock_critico !== '' ? parseInt(producto.stock_critico, 10) : 0;
		if (isNaN(stockCriticoParsed) || stockCriticoParsed < 0) {
			setError('El stock crítico debe ser un número válido mayor o igual a 0');
			setLoading(false);
			return;
		}

		if (!producto.codigo_producto.trim()) {
			setError('El código de producto es obligatorio');
			setLoading(false);
			return;
		}

		const body = {
			codigo_producto: producto.codigo_producto.trim(),
			nombre: producto.nombre.trim(),
			descripcion: producto.descripcion.trim(),
			precio: precioParsed,
			stock: stockParsed,
			stock_critico: stockCriticoParsed,
			categoria: { id: parseInt(producto.categoria, 10) },
			activo: Boolean(producto.activo),
		};

		try {
			// 1) Actualizar datos del producto
			const res = await fetch(`${API_BASE_URL}/productos/${productoId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const txt = await res.text().catch(() => '');
				throw new Error(txt || 'Error al actualizar producto');
			}

			// 2) Si seleccionó nueva imagen, subirla
			if (imagenFile) {
				const form = new FormData();
				form.append('file', imagenFile);
				const up = await fetch(`${API_BASE_URL}/productos/${productoId}/imagen`, {
					method: 'PUT',
					body: form,
				});
				if (!up.ok) {
					const txt = await up.text().catch(() => '');
					throw new Error(txt || 'Producto actualizado, pero la imagen no se pudo subir');
				}
			}

			navigate('/admin/productos', { state: { message: 'Producto actualizado correctamente' } });
		} catch (err) {
			setError(err.message || 'No se pudo actualizar el producto');
		} finally {
			setLoading(false);
		}
	};

	const removeImage = () => {
		setImagenFile(null);
		setImagenPreview(null);
	};

	const handleCancel = () => {
		navigate('/admin/productos');
	};

	const categoriaNombre = useMemo(() => {
		const c = categorias.find((c) => String(c.id) === String(producto.categoria));
		return c?.nombre || '';
	}, [categorias, producto.categoria]);

	const listaFiltrada = useMemo(() => {
		if (!search) return lista;
		const q = search.toLowerCase();
		return lista.filter((p) =>
			String(p?.nombre || '').toLowerCase().includes(q) ||
			String(p?.id || '').toLowerCase().includes(q)
		);
	}, [lista, search]);

	const handleDelete = async (idToDelete) => {
		if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
			return;
		}

		setError(null);
		setListLoading(true); // Usar el loading de la lista para feedback visual

		try {
			const response = await fetch(`${API_BASE_URL}/productos/${idToDelete}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				// Si se borra con éxito, actualizamos la lista de productos
				setLista(prevLista => prevLista.filter(p => p.id !== idToDelete));
				alert('Producto eliminado con éxito.');
			} else {
				const errorMsg = await response.text();
				throw new Error(errorMsg || 'No se pudo eliminar el producto.');
			}
		} catch (err) {
			console.error("Error al eliminar:", err);
			setError(err.message);
		} finally {
			setListLoading(false);
		}
	};

	// --- RENDER ---
	// 1) Modo Selección: Listar productos para elegir cuál editar
	return (
		<div className="admin-main">
			<h1 className="admin-main-title">Modificar Producto</h1>

			{error && (
				<div className="error-message">
					{error}
					<button onClick={() => setError(null)} className="error-close" aria-label="Cerrar">×</button>
				</div>
			)}

			{isSelectionMode ? (
				<div>
					<div className="admin-toolbar" style={{ marginBottom: 12 }}>
						<input
							type="text"
							placeholder="Buscar por código o nombre..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					{listLoading ? (
						<div className="loading">Cargando productos...</div>
					) : (
						<table className="admin-table">
							<thead>
								<tr>
									<th>Código</th>
									<th>Nombre</th>
									<th>Precio</th>
									<th>Categoría</th>
									<th>Activo</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{listaFiltrada.map((p) => (
									<tr key={p.id}>
										<td>{p.codigo_producto || '-'}</td>
										<td>{p.nombre}</td>
										<td>{'$'}{p.precio}</td>
										<td>{p?.categoria?.nombre ?? p?.categoria?.id ?? '-'}</td>
										<td>{p.activo ? 'Sí' : 'No'}</td>
										<td>
											<button className="btn-admin btn-edit" onClick={() => navigate(`/admin/productos/editar/${p.id}`)}>
												Editar
											</button>
											<button className="btn-admin btn-delete" onClick={() => handleDelete(p.id)} style={{ marginLeft: '8px' }}>
												Eliminar
											</button>
										</td>
									</tr>
								))}
								{listaFiltrada.length === 0 && (
									<tr>
										<td colSpan="6" style={{ textAlign: 'center' }}>Sin resultados</td>
									</tr>
								)}
							</tbody>
						</table>
					)}
				</div>
			) : loadingInit ? (
				<div className="loading">Cargando información...</div>
			) : (
				<form className="admin-form" onSubmit={handleSubmit}>
					<h2 className="admin-form-title">Editar Producto: {producto.nombre || '...'}</h2>

					{loading && <div className="form-feedback form-feedback-info">Guardando...</div>}
					{error && <div className="form-feedback form-feedback-error">{error}</div>}

					<div className="form-grid">
						{/* Columna Izquierda: Campos de texto */}
						<div className="form-col">
							<div className="form-group">
								<label htmlFor="codigo_producto">Código de Producto <span className="required">*</span></label>
								<input
									id="codigo_producto"
									name="codigo_producto"
									type="text"
									value={producto.codigo_producto}
									onChange={handleChange}
									disabled={loading}
									maxLength={50}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="nombre">Nombre <span className="required">*</span></label>
								<input
									id="nombre"
									name="nombre"
									type="text"
									value={producto.nombre}
									onChange={handleChange}
									disabled={loading}
									maxLength={100}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="price">Precio <span className="required">*</span></label>
								<div className="price-input">
									<span className="currency">$</span>
									<input
										id="price"
										name="precio"
										type="number"
										min="1"
										step="1"
										value={producto.precio}
										onChange={handleChange}
										disabled={loading}
										required
									/>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="stock">Stock <span className="required">*</span></label>
								<input
									id="stock"
									name="stock"
									type="number"
									min="0"
									step="1"
									value={producto.stock}
									onChange={handleChange}
									disabled={loading}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="stock_critico">Stock Crítico <span className="required">*</span></label>
								<input
									id="stock_critico"
									name="stock_critico"
									type="number"
									min="0"
									step="1"
									value={producto.stock_critico}
									onChange={handleChange}
									disabled={loading}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="descripcion">Descripción <span className="required">*</span></label>
								<textarea
									id="descripcion"
									name="descripcion"
									rows="4"
									value={producto.descripcion}
									onChange={handleChange}
									disabled={loading}
									maxLength={500}
									required
								/>
								<small className="char-count">{producto.descripcion.length}/500 caracteres</small>
							</div>

							<div className="form-group">
								<label htmlFor="categoria">Categoría <span className="required">*</span></label>
								<select
									id="categoria"
									name="categoria"
									value={producto.categoria}
									onChange={handleChange}
									disabled={loading || categorias.length === 0}
									required
								>
									<option value="">Seleccione una categoría</option>
									{categorias.map((cat) => (
										<option key={cat.id} value={cat.id}>{cat.nombre}</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label htmlFor="activo">Estado</label>
								<select name="activo" id="activo" value={producto.activo} onChange={handleChange}>
									<option value="true">Activo</option>
									<option value="false">Inactivo</option>
								</select>
							</div>
						</div>

						{/* Columna Derecha: Imagen */}
						<div className="form-col">
							<div className="form-group">
								<label htmlFor="imagen">Imagen (opcional, ≤ 2MB)</label>
								<input id="imagen" name="imagen" type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />

								{/* Imagen actual (si no se seleccionó nueva) */}
								{!imagenPreview && imagenActualUrl && (
									<div className="image-preview" style={{ marginTop: 8 }}>
										<img src={imagenActualUrl} alt="Imagen actual" />
									</div>
								)}

								{/* Preview de nueva imagen */}
								{imagenPreview && (
									<div className="image-preview" style={{ marginTop: 8 }}>
										<img src={imagenPreview} alt="Previsualización" />
										<button type="button" className="remove-image" onClick={removeImage}>Quitar</button>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="form-actions">
						<button type="button" className="btn-admin btn-secondary" onClick={() => navigate('/admin/productos/editar')}>
							Cancelar / Volver a la lista
						</button>
						<button type="submit" className="btn-admin btn-primary" disabled={loading}>
							Guardar Cambios
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

