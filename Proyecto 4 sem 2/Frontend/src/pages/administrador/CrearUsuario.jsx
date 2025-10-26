import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para el botón "Volver"

const API_BASE_URL = 'http://localhost:8080/api';

export default function CrearUsuario() {
  const navigate = useNavigate(); // Hook para redirigir

  // --- 1. Estado para el formulario ---
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    fechaNacimiento: '',
    direccion: '',
    comuna: '',      // Guardará el ID de la comuna
    tipoUsuario: '' // Guardará el ID del tipo de usuario
  });

  // --- 2. Estados para los dropdowns ---
  const [regiones, setRegiones] = useState([]);
  const [todasLasComunas, setTodasLasComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]); // <-- NUEVO para tipos
  
  const [selectedRegion, setSelectedRegion] = useState('');
  const [respuesta, setRespuesta] = useState(null);

  // --- 3. useEffect: Cargar Regiones, Comunas y Tipos de Usuario ---
  useEffect(() => {
    // Cargar Regiones
    fetch(`${API_BASE_URL}/regiones`)
      .then(res => res.json())
      .then(data => setRegiones(data))
      .catch(err => console.error("Error al cargar regiones:", err));
      
    // Cargar TODAS las Comunas
    fetch(`${API_BASE_URL}/comunas`)
      .then(res => res.json())
      .then(data => setTodasLasComunas(data))
      .catch(err => console.error("Error al cargar comunas:", err));

    // Cargar Tipos de Usuario <-- NUEVO
    fetch(`${API_BASE_URL}/tipo-usuarios`) // <-- ¡CORREGIDO CON GUION!
      .then(res => res.json())
      .then(data => setTiposUsuario(data))
      .catch(err => console.error("Error al cargar tipos de usuario:", err));
      
  }, []); // [] = Ejecutar solo una vez

  // --- 4. Manejador de cambios (general) ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- 5. Manejador de Región (Filtra comunas) ---
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    
    if (regionId) {
      const regionIdNum = parseInt(regionId, 10);
      const filtradas = todasLasComunas.filter(comuna => comuna.region.id === regionIdNum);
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]);
    }
    setFormData(prev => ({ ...prev, comuna: '' })); // Resetea comuna
  };

  // --- 6. Manejador para enviar (handleSubmit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta({ message: "Creando usuario...", type: "info" });
    
    // Convertimos IDs a objetos para el backend
    const payload = {
      ...formData,
      comuna: { id: parseInt(formData.comuna, 10) }, 
      tipoUsuario: { id: parseInt(formData.tipoUsuario, 10) }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setRespuesta({ message: '¡Usuario creado con éxito!', type: "success" });
        // Redirigir de vuelta a la lista después de un segundo
        setTimeout(() => navigate('/admin/usuarios'), 1500);
      } else {
        const errorData = await response.json();
        setRespuesta({ message: `Error: ${errorData.message || 'No se pudo crear.'}`, type: "error" });
      }
    } catch (error) {
      console.error('Error de red:', error);
      setRespuesta({ message: 'Error de conexión. Intenta más tarde.', type: "error" });
    }
  };

  // --- 7. El JSX (Formulario) ---
  return (
    <main className="admin-main">
      <h1 className="admin-main-title">Crear Nuevo Usuario</h1>
      
      {respuesta && (
        <div style={{ 
          color: respuesta.type === 'error' ? '#c00' : (respuesta.type === 'success' ? 'green' : '#333'), 
          marginBottom:'18px', 
          padding: '10px', 
          border: `1px solid ${respuesta.type === 'error' ? '#c00' : (respuesta.type === 'success' ? 'green' : '#ccc')}`,
          borderRadius: '8px'
        }}>
          {respuesta.message}
        </div>
      )}

      {/* Usamos las clases de tu CSS para formularios */}
      <form className="editar-form" autoComplete="off" onSubmit={handleSubmit}>
        
        {/* --- Campos del formulario --- */}
        <div>
          <label htmlFor="rut">RUN*</label>
          <input type="text" id="rut" name="rut" value={formData.rut} onChange={handleFormChange} required placeholder="Ej: 19011022K" />
        </div>
        
        <div>
          <label htmlFor="nombre">Nombre*</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleFormChange} required />
        </div>

        <div>
          <label htmlFor="apellido">Apellido*</label>
          <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleFormChange} required />
        </div>

        <div>
          <label htmlFor="email">Email*</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required placeholder="usuario@dominio.com" />
        </div>

        <div>
          <label htmlFor="contrasena">Contraseña*</label>
          <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleFormChange} required minLength="4" maxLength="10" />
        </div>

        <div>
          <label htmlFor="fechaNacimiento">Fecha de nacimiento*</label>
          <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleFormChange} required />
        </div>

        <div>
          <label htmlFor="region">Región*</label>
          <select id="region" name="region" onChange={handleRegionChange} value={selectedRegion} required>
            <option value="">Selecciona una región</option>
            {regiones.map(region => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="comuna">Comuna*</label>
          <select id="comuna" name="comuna" value={formData.comuna} onChange={handleFormChange} required disabled={comunasFiltradas.length === 0}>
            <option value="">Selecciona una comuna</option>
            {comunasFiltradas.map(comuna => (
              <option key={comuna.id} value={comuna.id}>
                {comuna.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="direccion">Dirección*</label>
          <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleFormChange} required />
        </div>
        
        {/* --- NUEVO Dropdown para Tipo de Usuario --- */}
        <div>
          <label htmlFor="tipoUsuario">Tipo de Usuario*</label>
          <select id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleFormChange} required>
            <option value="">Selecciona un tipo</option>
            {tiposUsuario.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* --- Botones --- */}
        <button type="submit" className="editar-btn">Crear Usuario</button>
        <Link to="/admin/usuarios" style={{ textAlign: 'center', marginTop: '10px', display: 'block' }}>Volver a la lista</Link>
      
      </form>
    </main>
  );
}