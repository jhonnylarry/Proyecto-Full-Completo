import '../../EstiloA.css'
import CrearPro from './CrearPro.jsx'
import { Link } from 'react-router-dom'

export default function ProductosA() {
  return (
    <>

			<main className="admin-main">
				<h1 className="admin-main-title">Administración de Productos</h1>
				<div className="admin-cards">
					<Link to="/admin/productos" className="admin-card">
						<div className="admin-card-inner admin-card-blue">
							<img src="../../img/Productos/Imagen 1.jpg" alt="Mostrar" className="admin-card-img"/>
							<h2 className="admin-card-title">Mostrar Productos</h2>
							<p className="admin-card-desc">Ver y gestionar el listado de productos existentes.</p>
						</div>
					</Link>
					<Link to="./CrearPro" className="admin-card">
						<div className="admin-card-inner admin-card-green">
							<img src="../../img/Productos/Copa vino.png" alt="Nuevo" className="admin-card-img"/>
							<h2 className="admin-card-title">Nuevo Producto</h2>
							<p className="admin-card-desc">Agregar un nuevo producto al catálogo.</p>
						</div>
					</Link>
					<Link to="/admin/productos/editar" className="admin-card">
						<div className="admin-card-inner admin-card-yellow">
							<img src="../../img/Productos/Vaso whisky.png" alt="Editar" className="admin-card-img"/>
							<h2 className="admin-card-title">Editar Producto</h2>
							<p className="admin-card-desc">Modificar información de productos existentes.</p>
						</div>
					</Link>
				</div>
			</main>

    </>
  );
}
