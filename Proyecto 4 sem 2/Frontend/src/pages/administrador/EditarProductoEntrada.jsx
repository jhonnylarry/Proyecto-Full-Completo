import '../../EstiloA.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function EditarProductoEntrada() {
  const [productoId, setProductoId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = (productoId || '').trim()
    if (!id) return
    navigate(`/admin/productos/editar/${id}`)
  }

  return (
    <div className="admin-main">
      <h1 className="admin-main-title">Editar Producto</h1>
      <p className="admin-help-text">Ingresa el ID del producto para continuar con la edición.</p>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label htmlFor="productoId">ID del producto</label>
          <input
            id="productoId"
            type="text"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            placeholder="Ej: 123"
          />
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="btn-primary">Continuar</button>
        </div>
      </form>
    </div>
  )
}
