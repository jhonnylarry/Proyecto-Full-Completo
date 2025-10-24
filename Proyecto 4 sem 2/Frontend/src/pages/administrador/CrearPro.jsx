import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../EstiloA.css';

const API_BASE_URL = 'http://localhost:8080/api';

export default function CrearPro() {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  // Imagen
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categorias`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar categorías');
        }
        return response.json();
      })
      .then(data => {
        setCategorias(data);
        setLoadingCategorias(false);
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
        setError('No se pudieron cargar las categorías');
        setLoadingCategorias(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validación cliente: solo imágenes y <= 2MB
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen debe ser menor a 2MB');
      return;
    }

    setImagenFile(file);
    setError(null);

    // preview
    const reader = new FileReader();
    reader.onload = () => setImagenPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación simple de precio
    const precioParsed = producto.precio !== '' ? parseFloat(producto.precio) : NaN;
    if (isNaN(precioParsed) || precioParsed <= 0) {
      setError('Ingresa un precio válido mayor que 0');
      setLoading(false);
      return;
    }

    const productoParaEnviar = {
      nombre: producto.nombre.trim(),
      descripcion: producto.descripcion.trim(),
      precio: precioParsed,
      categoria: { id: parseInt(producto.categoria, 10) },
      stock: 0,
      activo: true
    };

    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoParaEnviar)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el producto');
      }

      // parseo seguro de JSON
      const ct = response.headers.get('content-type') || '';
      let creado = null;
      if (ct.includes('application/json')) {
        creado = await response.json();
      } else {
        // si no viene JSON, intentar texto para diagnóstico
        const txt = await response.text().catch(() => null);
        throw new Error(txt || 'Respuesta inesperada del servidor al crear producto');
      }

      // Si hay imagen seleccionada, subirla (PUT para actualizar/reemplazar)
      if (imagenFile) {
        try {
          const form = new FormData();
          form.append('file', imagenFile);
          const uploadRes = await fetch(`${API_BASE_URL}/productos/${creado.id}/imagen`, {
            method: 'PUT',
            body: form
          });
          if (!uploadRes.ok) {
            // intentar parsear JSON de error si existe
            const uct = uploadRes.headers.get('content-type') || '';
            let uploadErr = null;
            if (uct.includes('application/json')) {
              const errJson = await uploadRes.json().catch(() => null);
              uploadErr = errJson && (errJson.message || JSON.stringify(errJson));
            } else {
              uploadErr = await uploadRes.text().catch(() => null);
            }
            throw new Error(uploadErr || 'Error al subir imagen');
          }
        } catch (upErr) {
          // no hacemos rollback del producto, pero informamos
          setError(`Producto creado pero la imagen no se pudo subir: ${upErr.message || upErr}`);
          // redirigimos igualmente a la lista admin para que el usuario pueda continuar
          navigate('/admin/productos', { state: { message: 'Producto creado (imagen no subida)' } });
          return;
        }
      }

      // todo OK
      navigate('/admin/productos', { state: { message: 'Producto creado exitosamente' } });

    } catch (err) {
      setError(err.message || 'No se pudo crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const tieneContenido = Object.values(producto).some(val => val !== '');
    if (!tieneContenido || window.confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
      navigate('/inventario');
    }
  };

  const removeImage = () => {
    setImagenFile(null);
    setImagenPreview(null);
  };

  return (
    <>
      <main>
      <div className="crear-producto-container">
        <div className="form-card">
          <h2>Crear Producto</h2>
            {error && (
              <div className="error-message">
                {error}
                <button onClick={() => setError(null)} className="error-close">×</button>
              </div>
            )}
          {loadingCategorias ? (
            <div className="loading">Cargando categorías...</div>
          ) : (

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">
                    Nombre del producto <span className="required">*</span>
                  </label>
                  <input
                    type="text" id="nombre" name="nombre" value={producto.nombre}
                    onChange={handleChange} disabled={loading} maxLength={100}
                    placeholder="Ej: Sopaipillas con pebre" required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="precio">
                    Precio <span className="required">*</span>
                  </label>
                  <div className="price-input">
                    <span className="currency">$</span>
                    <input
                      type="number" id="precio" name="precio" step="1" min="1"
                      value={producto.precio} onChange={handleChange} disabled={loading}
                      placeholder="1000" required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">
                  Descripción <span className="required">*</span>
                </label>
                <textarea
                  id="descripcion" name="descripcion" rows="4"
                  value={producto.descripcion} onChange={handleChange} disabled={loading}
                  maxLength={500} placeholder="Características principales del producto..."
                  required
                />
                  <small className="char-count">
                    {producto.descripcion.length}/500 caracteres
                  </small>
              </div>

              <div className="form-group">
                <label htmlFor="categoria">
                  Categoría <span className="required">*</span>
                </label>
                <select
                  id="categoria" name="categoria" value={producto.categoria}
                  onChange={handleChange} disabled={loading || categorias.length === 0}
                  required>
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {categorias.length === 0 && !loadingCategorias && (
                  <small className="error-text">No hay categorías disponibles</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="imagen">Imagen (opcional, &lt;= 2MB)</label>
                <input type="file" id="imagen" name="imagen" accept="image/*" onChange={handleFileChange} disabled={loading} />
                {imagenPreview && (
                  <div className="image-preview">
                    <img src={imagenPreview} alt="Previsualización" />
                    <button type="button" className="remove-image" onClick={removeImage}>Quitar</button>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Guardando...' : 'Crear Producto'}
                </button>
                <button type="button" onClick={handleCancel} disabled={loading} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      </main>
    </>
  );
}
