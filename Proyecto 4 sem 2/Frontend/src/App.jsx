import Tienda from './Tienda.jsx'
import Admin from './Admin.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
        <Routes>
          <Route path="/*" element={<Tienda />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
    </>
  );
}

export default App;
