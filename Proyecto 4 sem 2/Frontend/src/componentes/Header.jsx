import { Link } from 'react-router-dom';

export default function Header() {
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

        <div className="menu">
          <Link to="/inicioSesion" className="inicio-sesion">Iniciar Sesión</Link>
          <Link to="/registro" className="registro-usuario" style={{ marginLeft: "10px" }}>
            Registrarse
          </Link>
          <Link to="/carrito" className="carrito">🛒 Carrito</Link>
        </div>
      </nav>
    </header>
  );
}