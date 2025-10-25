import Home from './pages/tienda/Home'
import Blogs from './pages/tienda/Blogs'
import Nosotros from './pages/tienda/Nosotros'
import Contactanos from './pages/tienda/Contactanos'
import BlogD1 from './pages/tienda/BlogD1'
import BlogD2 from './pages/tienda/BlogD2'
import Registro from './pages/tienda/Registrarse'
import IniciarSesion from './pages/tienda/IniciarSesion'
import Header from './componentes/Header'
import Footer from './componentes/Footer'
import { Routes, Route } from 'react-router-dom'
import './EstiloT.css'

function Tienda() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contactanos />} />
          <Route path="/blogs/d1" element={<BlogD1 />} />
          <Route path="/blogs/d2" element={<BlogD2 />} />
          <Route path="/registrarse" element={<Registro />} />
          <Route path="/iniciarSesion" element={<IniciarSesion />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default Tienda;
