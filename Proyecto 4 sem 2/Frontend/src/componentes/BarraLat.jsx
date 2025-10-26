import React from 'react';
import { Link } from 'react-router-dom';

export default function BarraLat() {
  return (
    <aside className="sidebar"> 
      <h2>Administrador</h2>
      <ul>
        {/* ¡CORRECCIÓN 2: 'a href' se cambia por 'Link to' con las rutas de React! */}
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/usuarios">Usuarios</Link></li>
        <li><Link to="/admin/productos">Productos</Link></li>
        <li><Link to="/admin/mensajes">Mensajes</Link></li>
      </ul>
      <ul>
        {/* Esto te lleva de vuelta a la tienda (Home). También podrías hacer un logout aquí */}
        <li><Link to="/" className="inicio-sesion">Cerrar Sesión</Link></li>
      </ul>
    </aside>
  );
}