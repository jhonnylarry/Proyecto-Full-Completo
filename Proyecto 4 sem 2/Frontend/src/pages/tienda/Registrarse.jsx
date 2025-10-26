import { useState, useEffect } from 'react';

// Asegúrate de tener tu constante de URL
const API_BASE_URL = 'http://localhost:8080/api';

export default function Registrarse() {
  
 const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    fechaNacimiento: '',
    direccion: '',
    comuna: '', 
  });

  // --- 1. ESTADOS MODIFICADOS ---
  const [regiones, setRegiones] = useState([]);
  const [todasLasComunas, setTodasLasComunas] = useState([]); // <-- NUEVO
  const [comunasFiltradas, setComunasFiltradas] = useState([]); // <-- NUEVO (las que se muestran)
  
  const [selectedRegion, setSelectedRegion] = useState('');
  const [respuesta, setRespuesta] = useState(null);

  // --- 2. useEffect MODIFICADO (Carga TODO al inicio) ---
  useEffect(() => {
    // Cargar Regiones
    fetch(`${API_BASE_URL}/regiones`)
      .then(res => res.json())
      .then(data => setRegiones(data))
      .catch(err => console.error("Error al cargar regiones:", err));
      
    // Cargar TODAS las Comunas
    fetch(`${API_BASE_URL}/comunas`) // <-- ¡NUEVO FETCH!
      .then(res => res.json())
      .then(data => setTodasLasComunas(data))
      .catch(err => console.error("Error al cargar comunas:", err));
      
  }, []); // El array vacío [] significa que solo se ejecuta 1 vez

  // --- 3. useEffect ELIMINADO ---
  // (Ya no necesitamos el useEffect que escuchaba [selectedRegion])

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- 4. Manejador de Región (AHORA HACE EL FILTRO) ---
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    
    if (regionId) {
      // Filtramos la lista grande de comunas
      const regionIdNum = parseInt(regionId, 10);
      const filtradas = todasLasComunas.filter(comuna => comuna.region.id === regionIdNum);
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]); // Si no hay región, la lista está vacía
    }
    
    // Reseteamos la comuna seleccionada en el formulario
    setFormData(prev => ({ ...prev, comuna: '' })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta(null);
    
    const payload = {
      ...formData,
      comuna: { id: parseInt(formData.comuna, 10) }, 
      tipoUsuario: { id: 2 } // Asumiendo ID 2 = CLIENTE
    };

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setRespuesta('¡Usuario registrado con éxito!');
      } else {
        const errorData = await response.json();
        setRespuesta(`Error: ${errorData.message || 'No se pudo registrar.'}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setRespuesta('Error de conexión. Intenta más tarde.');
    }
  };

  // --- 7. El JSX (Tu HTML convertido) ---
  return (
    <>
    <main>
      <section className="registro-usuario" style={{maxWidth:'430px', margin:'40px auto', background:'#fff', borderRadius:'12px', boxShadow:'0 2px 12px #0001', padding:'32px 24px'}}>
        <h1 style={{textAlign:'center'}}>Registro de Usuario</h1>
        
        {respuesta && <div style={{color: respuesta.startsWith('Error') ? '#c00' : 'green', marginBottom:'18px'}}>{respuesta}</div>}

        <form id="form-registro" autoComplete="off" onSubmit={handleSubmit}>
          
          {/* ... (inputs de rut, nombre, apellido, email, etc. Siguen igual) ... */}
          <label htmlFor="rut">RUN*</label>
          <input type="text" id="rut" name="rut" value={formData.rut} onChange={handleFormChange} required style={{width:'100%', marginBottom:'10px'}}/>
          {/* ... (etc) ... */}
          <label htmlFor="nombre">Nombre*</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleFormChange} required style={{width:'100%', marginBottom:'10px'}}/>

          <label htmlFor="apellido">Apellidos*</label>
          <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleFormChange} required style={{width:'100%', marginBottom:'10px'}}/>
          
          <label htmlFor="email">Correo*</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required style={{width:'100%', marginBottom:'10px'}}/>
          
          <label htmlFor="contrasena">Contraseña*</label>
          <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleFormChange} required style={{width:'100%', marginBottom:'10px'}}/>
          
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleFormChange} style={{width:'100%', marginBottom:'10px'}}/>

          <label htmlFor="region">Región*</label>
          <select 
            id="region" 
            name="region" 
            onChange={handleRegionChange} // <-- Usa el handler de filtro
            value={selectedRegion}
            required 
            style={{width:'100%', marginBottom:'10px'}}
          >
            <option value="">Selecciona una región</option>
            {regiones.map(region => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="comuna">Comuna*</label>
          <select 
            id="comuna" 
            name="comuna" 
            value={formData.comuna}
            onChange={handleFormChange}
            required 
            style={{width:'100%', marginBottom:'10px'}}
            disabled={comunasFiltradas.length === 0} // <-- Se deshabilita si la lista filtrada está vacía
          >
            <option value="">Selecciona una comuna</option>
            {/* ¡¡CAMBIO!! Mapeamos 'comunasFiltradas' en lugar de 'comunas' */}
            {comunasFiltradas.map(comuna => (
              <option key={comuna.id} value={comuna.id}>
                {comuna.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="direccion">Dirección*</label>
          <input 
            type="text" 
            id="direccion" 
            name="direccion" 
            value={formData.direccion}
            onChange={handleFormChange}
            maxLength="300" 
            required 
            style={{width:'100%', marginBottom:'18px'}}
          />

          <button type="submit" style={{width:'100%', background:'#0077cc', color:'#fff', border:'none', borderRadius:'8px', padding:'12px 0', fontSize:'1.1rem', cursor:'pointer'}}>Registrarse</button>
        </form>
      </section>
    </main>
    </>
  );
}