import '../../EstiloA.css'
import { Link } from 'react-router-dom'

export default function ProductosA() {
  return (
    <>

			<div className="admin-main">
				<h1 className="admin-main-title">Administración de Productos</h1>
				<div className="admin-cards">
					<Link to="/admin/productos/stock" className="admin-card">
						<div className="admin-card-inner admin-card-blue">
							<img src="/img/Productos/Imagen 1.jpg" alt="Mostrar" className="admin-card-img"/>
							<h2 className="admin-card-title">Stock Productos</h2>
							<p className="admin-card-desc">Ver y gestionar el listado de productos existentes.</p>
						</div>
					</Link>
					<Link to="/admin/productos/nuevo" className="admin-card">
						<div className="admin-card-inner admin-card-green">
							<img src="/img/Productos/Copa vino.png" alt="Nuevo" className="admin-card-img"/>
							<h2 className="admin-card-title">Nuevo Producto</h2>
							<p className="admin-card-desc">Agregar un nuevo producto al catálogo.</p>
						</div>
					</Link>
					<Link to="/admin/productos/editar" className="admin-card">
						<div className="admin-card-inner admin-card-yellow">
							<img src="/img/Productos/Vaso whisky.png" alt="Editar" className="admin-card-img"/>
							<h2 className="admin-card-title">Editar Producto</h2>
							<p className="admin-card-desc">Seleccionar un producto de la lista para editar.</p>
						</div>
					</Link>
				</div>
			</div>

    </>
  );
}
