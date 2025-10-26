import Tienda from './Tienda.jsx'
import Admin from './Admin.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        {/* Esta ruta coincide: */}
        <Route path="/admin/*" element={<Admin />} /> 
        <Route path="/*" element={<Tienda />} />
      </Routes>
    </>
  );
}

export default App;
