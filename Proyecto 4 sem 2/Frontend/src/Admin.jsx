import React from 'react';
import Dashboard from './pages/administrador/Dashboard.jsx'
import ProductoasA from './pages/administrador/ProductosA.jsx'
import CrearPro from './pages/administrador/CrearPro.jsx'
import Mensajes from './pages/administrador/Mensajes.jsx'
import Usuarios from './pages/administrador/Usuarios.jsx'
import CrearUsuario from './pages/administrador/CrearUsuario.jsx'
import EditarUsuario from './pages/administrador/EditarUsuario.jsx'
import { Routes, Route} from 'react-router-dom'
import './EstiloA.css'
import BarraLat from './componentes/BarraLat.jsx'

function Admin() {
  return (
    <>
    <BarraLat />
      <main>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<ProductoasA />} />
          <Route path="productos/nuevo" element={<CrearPro />} />
          <Route path="mensajes" element={<Mensajes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/nuevo" element={<CrearUsuario />} />
          <Route path="usuarios/editar/:usuarioId" element={<EditarUsuario />} />
        </Routes>
      </main>
    </>
  );
}

export default Admin;