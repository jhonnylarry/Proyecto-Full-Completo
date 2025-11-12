import React, { useState, useEffect } from 'react';
// ¡¡1. Importamos useLocation!!
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  
  // ¡¡2. Inicializamos useLocation!!
  const location = useLocation();

  // 3. useEffect para revisar el localStorage
  useEffect(() => {
    // Busca el item 'usuario' que guardamos en el login
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      // Si no hay nada, nos aseguramos que el estado esté limpio
      setUsuario(null);
    }
  }, [location]); // <-- ¡¡3. AÑADIMOS 'location' COMO DEPENDENCIA!!

  // 4. Función para cerrar la sesión
  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar">
        <img src="/img/logo 2.png" alt="Logo empresa" className="logo" />

        <ul className="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/blogs">Blog</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>

        {/* 5. La lógica (esto ya estaba bien) */}
        <div className="menu">
          {usuario ? (
            // --- A. Si SÍ hay un usuario logueado ---
            <>
              <span style={{ color: 'white', alignSelf: 'center' }}>
                ¡Hola, {usuario.nombre}!
                {usuario.role === 'ADMIN' && (
                  <Link to="/admin" style={{ color: '#f1c40f', marginLeft: '10px' }}>(Ir al Panel)</Link>
                )}
              </span>

              {usuario.role !== 'ADMIN' && (
                <Link to="/carrito" className="carrito" style={{ marginLeft: "10px" }}>🛒 Carrito</Link>
              )}

              <a 
                href="#!" 
                onClick={handleCerrarSesion} 
                className="inicio-sesion" 
                style={{ marginLeft: "10px", cursor: 'pointer' }}
              >
                Cerrar Sesión
              </a>
            </>
          ) : (
            // --- B. Si NO hay nadie logueado (como estaba antes) ---
            <>
              <Link to="/IniciarSesion" className="inicio-sesion">Iniciar Sesión</Link>
              <Link to="/registrarse" className="registro-usuario" style={{ marginLeft: "10px" }}>
                Registrarse
              </Link>
              {/* <Link to="/carrito" className="carrito">🛒 Carrito</Link> */}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}