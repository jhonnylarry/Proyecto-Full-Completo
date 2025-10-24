import ProductoasA from './pages/administrador/ProductosA.jsx'
import CrearPro from './pages/administrador/CrearPro.jsx'
import { Routes, Route} from 'react-router-dom'
import './EstiloA.css'

function Admin() {
  return (
    <>
        <main>
          <Routes>
            <Route path="productos" element={<ProductoasA />} />
            <Route path="productos/nuevo" element={<CrearPro />} />
          </Routes>
        </main>
    </>
  );
}

export default Admin;