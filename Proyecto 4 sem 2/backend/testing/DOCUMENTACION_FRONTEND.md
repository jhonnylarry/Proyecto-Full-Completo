# 📝 DOCUMENTACIÓN BACKEND - CREAR PRODUCTOS CON IMAGEN

## 🎯 Resumen de Cambios Implementados

Se agregó un **nuevo endpoint** en `ProductoRestControllers.java` que permite crear productos con imagen en una sola petición HTTP usando `multipart/form-data`.

---

## 🚀 ENDPOINT PRINCIPAL

### **POST /api/productos** (NUEVO - con FormData)

**URL completa:** `http://localhost:8080/api/productos`

**Content-Type:** `multipart/form-data`

**Método:** POST

### **Parámetros del FormData:**

| Campo         | Tipo          | Requerido | Descripción                              |
|---------------|---------------|-----------|------------------------------------------|
| `nombre`      | String        | ✅ Sí     | Nombre del producto                      |
| `descripcion` | String        | ✅ Sí     | Descripción del producto                 |
| `precio`      | Long/Number   | ✅ Sí     | Precio del producto                      |
| `stock`       | Integer       | ✅ Sí     | Cantidad en stock                        |
| `categoriaId` | Long/Number   | ✅ Sí     | ID de la categoría (de /api/catalogo)    |
| `imagen`      | File          | ❌ No     | Archivo de imagen (máx 2MB)              |

### **Validaciones Backend:**

✅ Imagen máximo 2 MB
✅ Solo acepta tipos: `image/*` (jpg, png, gif, webp, etc.)
✅ Categoría debe existir en la base de datos
✅ Nombre y precio son obligatorios

### **Respuestas:**

**201 Created** - Producto creado exitosamente
```json
{
  "id": 1,
  "nombre": "Producto ejemplo",
  "descripcion": "Descripción del producto",
  "precio": 15000,
  "stock": 10,
  "activo": true,
  "categoria": {
    "id": 1,
    "nombre": "Categoría ejemplo"
  },
  "imagenContentType": "image/jpeg"
}
```

**400 Bad Request** - Error en validación (imagen muy grande, tipo incorrecto, categoría no existe)
**500 Internal Server Error** - Error del servidor

---

## 💻 IMPLEMENTACIÓN EN REACT (Frontend)

### **1. Service: `productServices.js`**

```javascript
// src/services/productServices.js

const API_URL = 'http://localhost:8080/api/productos';

/**
 * Crear un nuevo producto con imagen
 * @param {Object} productoData - Datos del producto
 * @param {File|null} imagenFile - Archivo de imagen
 * @returns {Promise} - Promesa con el producto creado
 */
export const crearProductoConImagen = async (productoData, imagenFile) => {
  try {
    // Crear FormData
    const formData = new FormData();
    formData.append('nombre', productoData.nombre);
    formData.append('descripcion', productoData.descripcion);
    formData.append('precio', productoData.precio);
    formData.append('stock', productoData.stock);
    formData.append('categoriaId', productoData.categoriaId);
    
    // Si hay imagen, agregarla
    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      // NO enviar Content-Type, el navegador lo hace automáticamente con boundary
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Obtener todas las categorías
 * @returns {Promise} - Promesa con lista de categorías
 */
export const obtenerCategorias = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/catalogo');
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Obtener URL de imagen de un producto
 * @param {number} productoId - ID del producto
 * @returns {string} - URL de la imagen
 */
export const obtenerUrlImagen = (productoId) => {
  return `http://localhost:8080/api/productos/${productoId}/imagen`;
};

/**
 * Listar todos los productos
 * @returns {Promise} - Promesa con lista de productos
 */
export const listarProductos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al listar productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

### **2. Componente: `CrearPro.jsx`**

```javascript
// src/pages/administrador/CrearPro.jsx
import React, { useState, useEffect } from 'react';
import { crearProductoConImagen, obtenerCategorias } from '../../services/productServices';

const CrearPro = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: ''
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar categorías');
    }
  };

  // Manejar cambios en inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tamaño (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe superar 2MB');
        e.target.value = '';
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        e.target.value = '';
        return;
      }

      setImagenFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaId: ''
    });
    setImagenFile(null);
    setImagenPreview(null);
    setError('');
    setSuccess('');
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoriaId) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Preparar datos
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseInt(formData.precio),
        stock: parseInt(formData.stock),
        categoriaId: parseInt(formData.categoriaId)
      };

      // Crear producto
      const nuevoProducto = await crearProductoConImagen(productoData, imagenFile);
      
      setSuccess(`Producto "${nuevoProducto.nombre}" creado exitosamente!`);
      limpiarFormulario();
      
    } catch (err) {
      setError(err.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-producto-container">
      <h2>Crear Nuevo Producto</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto *</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* Precio */}
        <div className="form-group">
          <label htmlFor="precio">Precio *</label>
          <input
            type="number"
            className="form-control"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {/* Stock */}
        <div className="form-group">
          <label htmlFor="stock">Stock *</label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="categoriaId">Categoría *</label>
          <select
            className="form-control"
            id="categoriaId"
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <div className="form-group">
          <label htmlFor="imagen">Imagen del Producto (opcional, máx 2MB)</label>
          <input
            type="file"
            className="form-control-file"
            id="imagen"
            accept="image/*"
            onChange={handleImagenChange}
          />
          
          {imagenPreview && (
            <div className="mt-3">
              <p>Vista previa:</p>
              <img 
                src={imagenPreview} 
                alt="Preview" 
                style={{ maxWidth: '300px', maxHeight: '300px' }}
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-group mt-4">
          <button 
            type="submit" 
            className="btn btn-primary mr-2"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={limpiarFormulario}
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPro;
```

---

## 🔗 OTROS ENDPOINTS DISPONIBLES

### **Obtener todas las categorías**
```
GET http://localhost:8080/api/catalogo
```

### **Listar todos los productos**
```
GET http://localhost:8080/api/productos
```

### **Obtener imagen de un producto**
```
GET http://localhost:8080/api/productos/{id}/imagen
```
Ejemplo: `http://localhost:8080/api/productos/1/imagen`

### **Actualizar producto (sin imagen)**
```
PUT http://localhost:8080/api/productos/{id}
Content-Type: application/json

{
  "descripcion": "Nueva descripción",
  "precio": 20000
}
```

### **Desactivar producto**
```
PATCH http://localhost:8080/api/productos/{id}/desactivar
```

### **Eliminar producto**
```
DELETE http://localhost:8080/api/productos/{id}
```

---

## 🧪 PRUEBAS CON POSTMAN

### **Crear Producto con Imagen**

1. Abrir Postman
2. Crear nueva petición POST
3. URL: `http://localhost:8080/api/productos`
4. En la pestaña "Body":
   - Seleccionar **form-data**
   - Agregar campos:
     - `nombre` (text): "Producto de prueba"
     - `descripcion` (text): "Descripción de prueba"
     - `precio` (text): "15000"
     - `stock` (text): "10"
     - `categoriaId` (text): "1"
     - `imagen` (file): Seleccionar un archivo de imagen
5. Enviar la petición

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### **Tabla: productos**
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR, NOT NULL)
- descripcion (TEXT)
- precio (BIGINT, NOT NULL)
- stock (INT)
- imagen (LONGBLOB) -- hasta 2MB
- imagen_content_type (VARCHAR)
- categoria_id (BIGINT, FOREIGN KEY)
- activo (BOOLEAN, DEFAULT TRUE)
```

### **Tabla: categorias**
```sql
- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR)
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN FRONTEND

- [ ] Actualizar/crear `productServices.js` con las funciones proporcionadas
- [ ] Actualizar/crear `CrearPro.jsx` con el formulario
- [ ] Verificar que la URL del backend sea correcta (`http://localhost:8080`)
- [ ] Instalar dependencias necesarias (React ya debe tener fetch)
- [ ] Probar crear producto sin imagen
- [ ] Probar crear producto con imagen
- [ ] Validar que las imágenes no superen 2MB
- [ ] Agregar estilos CSS al formulario

---

## 🎨 ESTILOS CSS SUGERIDOS (opcional)

```css
.crear-producto-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 🐛 TROUBLESHOOTING

### **Error: CORS**
✅ Ya está configurado en el backend: `@CrossOrigin(origins = "http://localhost:5173")`

### **Error: 400 Bad Request**
- Verificar que `categoriaId` exista en la base de datos
- Verificar que la imagen sea menor a 2MB
- Verificar que todos los campos requeridos estén presentes

### **Error: 500 Internal Server Error**
- Verificar que el backend esté corriendo
- Verificar la conexión a la base de datos
- Revisar logs del backend

### **La imagen no se carga**
- Verificar que el tipo de archivo sea una imagen válida
- Verificar el tamaño del archivo (máx 2MB)

---

## 📝 NOTAS IMPORTANTES

1. **No enviar Content-Type manualmente** cuando uses FormData - el navegador lo hace automáticamente con el boundary correcto
2. **La imagen es opcional** - puedes crear productos sin imagen
3. **Las imágenes se almacenan en la base de datos** como BLOB
4. **Validación de tamaño**: El backend valida que la imagen no supere 2MB
5. **La categoría debe existir** antes de crear el producto

---

## 🚀 PRÓXIMOS PASOS

1. Implementar la edición de productos con imagen
2. Agregar validación de campos en el frontend
3. Mejorar el manejo de errores
4. Agregar loading states
5. Implementar paginación en la lista de productos
6. Agregar búsqueda y filtros

---

**¡Listo para implementar en el frontend!** 🎉
