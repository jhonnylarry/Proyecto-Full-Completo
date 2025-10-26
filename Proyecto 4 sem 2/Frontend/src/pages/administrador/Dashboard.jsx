import React, { useState, useEffect } from 'react'; // <-- ¡TE FALTABA AÑADIR useState Y useEffect AQUÍ!
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

export default function DashboardAdmin() {
  // --- Estado REAL (Empieza en 0) ---
  const [stats, setStats] = useState({
    usuarios: 0,
    productos: 0,
    mensajes: 0
  });

  // --- useEffect (Se ejecuta 1 vez cuando carga la página) ---
  useEffect(() => {
    // Función para ir a buscar los datos
    const fetchStats = async () => {
      try {
        // Pedimos los 3 datos al mismo tiempo
        const [resUsuarios, resProductos, resMensajes] = await Promise.all([
          fetch(`${API_BASE_URL}/usuarios`),
          fetch(`${API_BASE_URL}/productos`),
          fetch(`${API_BASE_URL}/mensajes`)
        ]);

        const dataUsuarios = await resUsuarios.json();
        const dataProductos = await resProductos.json();
        const dataMensajes = await resMensajes.json();

        // Actualizamos el estado con el .length de cada arreglo
        setStats({
          usuarios: dataUsuarios.length,
          productos: dataProductos.length,
          mensajes: dataMensajes.length
        });

      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    fetchStats();
  }, []); // El [] vacío hace que se ejecute 1 sola vez

  // --- El JSX (return) ---
  // (El resto de tu código está perfecto)
  return (
    <main className="admin-main">
    
      <h1 className="admin-main-title">Panel de Administrador</h1>
      
      <p style={{ marginBottom: '40px', fontSize: '1.1rem' }}>
        Bienvenido, admin. Aquí puedes gestionar productos, usuarios, etc.
      </p>

      <div className="dashboard-stats">
        {/* ... (tus 3 stat-card) ... */}
        <div className="stat-card">
          <span className="stat-number">{stats.usuarios}</span>
          <span className="stat-label">Usuarios Registrados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.productos}</span>
          <span className="stat-label">Productos Publicados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.mensajes}</span>
          <span className="stat-label">Mensajes Nuevos</span>
        </div>
      </div>
      
      <div className="admin-cards">
        {/* ... (tus 3 Link cards) ... */}
        <Link to="/admin/usuarios" className="admin-card admin-card-blue">
          {/* ... */}
          <h2 className="admin-card-title">Gestionar Usuarios</h2>
          <p className="admin-card-desc">Ver y editar usuarios registrados.</p>
        </Link>
        <Link to="/admin/productos" className="admin-card admin-card-green">
          {/* ... */}
          <h2 className="admin-card-title">Gestionar Productos</h2>
          <p className="admin-card-desc">Añadir, editar y eliminar productos.</p>
        </Link>
        <Link to="/admin/mensajes" className="admin-card admin-card-yellow">
          {/* ... */}
          <h2 className="admin-card-title">Ver Mensajes</h2>
          <p className="admin-card-desc">Leer mensajes de la página de contacto.</p>
        </Link>
      </div>
    </main>
  );
}