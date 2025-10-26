import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // <-- useParams para el ID

const API_BASE_URL = 'http://localhost:8080/api';

export default function EditarUsuario() {
  const { usuarioId } = useParams(); // <-- Obtiene el ID de la URL
  const navigate = useNavigate();

  // --- Estados (igual que en Crear) ---
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '', // OJO: La contraseña NO se debe pre-rellenar por seguridad
    fechaNacimiento: '',
    direccion: '',
    comuna: '',      // Guardará el ID
    tipoUsuario: '' // Guardará el ID
  });
  const [regiones, setRegiones] = useState([]);
  const [todasLasComunas, setTodasLasComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para mostrar "Cargando..."

  // --- useEffect: Cargar TODO (Usuario, Regiones, Comunas, Tipos) ---
  useEffect(() => {
    setIsLoading(true);
    setRespuesta({ message: "Cargando datos...", type: "info" });

    // Hacemos todas las llamadas en paralelo
    Promise.all([
      fetch(`${API_BASE_URL}/usuarios/${usuarioId}`),
      fetch(`${API_BASE_URL}/regiones`),
      fetch(`${API_BASE_URL}/comunas`),
      fetch(`${API_BASE_URL}/tipo-usuarios`)
    ])
    .then(async ([resUsuario, resRegiones, resComunas, resTipos]) => {
      // Verificamos si todas las respuestas fueron OK
      if (!resUsuario.ok) throw new Error(`Error al cargar usuario ${usuarioId}`);
      if (!resRegiones.ok) throw new Error('Error al cargar regiones');
      if (!resComunas.ok) throw new Error('Error al cargar comunas');
      if (!resTipos.ok) throw new Error('Error al cargar tipos de usuario');

      // Convertimos todas a JSON
      const dataUsuario = await resUsuario.json();
      const dataRegiones = await resRegiones.json();
      const dataComunas = await resComunas.json();
      const dataTipos = await resTipos.json();

      // Guardamos las listas
      setRegiones(dataRegiones);
      setTodasLasComunas(dataComunas);
      setTiposUsuario(dataTipos);

      // Pre-rellenamos el formulario con los datos del usuario
      setFormData({
        rut: dataUsuario.rut || '',
        nombre: dataUsuario.nombre || '',
        apellido: dataUsuario.apellido || '',
        email: dataUsuario.email || '',
        contrasena: '', // La contraseña NO se carga
        fechaNacimiento: dataUsuario.fechaNacimiento || '',
        direccion: dataUsuario.direccion || '',
        comuna: dataUsuario.comuna?.id || '',
        tipoUsuario: dataUsuario.tipoUsuario?.id || ''
      });

      // Pre-seleccionamos la región y filtramos las comunas
      const regionDelUsuario = dataUsuario.comuna?.region?.id;
      if (regionDelUsuario) {
        setSelectedRegion(regionDelUsuario.toString()); // El value del select es string
        const regionIdNum = parseInt(regionDelUsuario, 10);
        const filtradas = dataComunas.filter(c => c.region.id === regionIdNum);
        setComunasFiltradas(filtradas);
      }

      setRespuesta(null); // Limpiamos el mensaje de carga
    })
    .catch(err => {
      console.error("Error al cargar datos iniciales:", err);
      setRespuesta({ message: `Error al cargar datos: ${err.message}`, type: "error" });
    })
    .finally(() => {
      setIsLoading(false); // Terminamos de cargar
    });

  }, [usuarioId]); // Se re-ejecuta si el ID cambia (aunque no debería)

  // --- Manejadores (handleFormChange, handleRegionChange) ---
  // (Son idénticos a los de CrearUsuario.jsx)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    if (regionId) {
      const regionIdNum = parseInt(regionId, 10);
      const filtradas = todasLasComunas.filter(c => c.region.id === regionIdNum);
      setComunasFiltradas(filtradas);
    } else {
      setComunasFiltradas([]);
    }
    setFormData(prev => ({ ...prev, comuna: '' }));
  };

  // --- handleSubmit (Usa PUT en lugar de POST) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta({ message: "Actualizando usuario...", type: "info" });
    
    // Preparamos el payload (igual que en Crear)
    // OJO: Si la contraseña está vacía, NO la enviamos para no sobreescribirla
    const payload = {
      ...formData,
      comuna: { id: parseInt(formData.comuna, 10) },
      tipoUsuario: { id: parseInt(formData.tipoUsuario, 10) }
    };
    if (!payload.contrasena) {
      delete payload.contrasena; // No mandar contraseña si está vacía
    }

    try {
      // ¡¡Usamos PUT y la URL con el ID!!
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setRespuesta({ message: '¡Usuario actualizado con éxito!', type: "success" });
        setTimeout(() => navigate('/admin/usuarios'), 1500);
      } else {
        const errorData = await response.json();
        setRespuesta({ message: `Error: ${errorData.message || 'No se pudo actualizar.'}`, type: "error" });
      }
    } catch (error) {
      console.error('Error de red:', error);
      setRespuesta({ message: 'Error de conexión. Intenta más tarde.', type: "error" });
    }
  };

  // --- El JSX (Formulario pre-llenado) ---
  // (Es casi idéntico al de Crear, pero los 'value' se llenan con el useEffect)
  return (
    <main className="admin-main">
      <h1 className="admin-main-title">Editar Usuario (ID: {usuarioId})</h1>
      
      {/* Mensaje de carga o error */}
      {isLoading ? (
        <p>Cargando datos del usuario...</p>
      ) : respuesta ? (
        <div style={{ /* Estilos del mensaje */ }}>{respuesta.message}</div>
      ) : null}

      {/* Solo mostramos el form si no está cargando y no hubo error fatal */}
      {!isLoading && (!respuesta || respuesta.type !== 'error fatal') && (
        <form className="editar-form" autoComplete="off" onSubmit={handleSubmit}>
          
          <div>
            <label htmlFor="rut">RUN*</label>
            <input type="text" id="rut" name="rut" value={formData.rut} onChange={handleFormChange} required />
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
            <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required />
          </div>

          <div>
            <label htmlFor="contrasena">Nueva Contraseña (dejar en blanco para no cambiar)</label>
            <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleFormChange} minLength="4" maxLength="10" />
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

          <button type="submit" className="editar-btn">Guardar Cambios</button>
          <Link to="/admin/usuarios" style={{ textAlign: 'center', marginTop: '10px', display: 'block' }}>Volver a la lista</Link>
        
        </form>
      )} 
      {/* Fin del if !isLoading */}
      
    </main>
  );
}