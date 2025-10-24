import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <aside class="sidebar">
        <h2>Administrador</h2>
        <ul>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="../Administracion/usuario.html">Usuarios</a></li>
            <li><a href="../Administracion/adm-prodcutos.html">Productos</a></li>
            <li><a href="../Administracion/mensaje.html">Mensajes</a></li>
        </ul>
        <ul>
            <li><a href="../home.html" class="inicio-sesion">Cerrar Sesión</a></li>
        </ul>
    </aside>
  );
}