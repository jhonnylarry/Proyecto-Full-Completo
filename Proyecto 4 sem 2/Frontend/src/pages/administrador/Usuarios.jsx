import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

// ¡CORRECCIÓN 1: Cambia el nombre de la función para que coincida con el archivo!
export default function UsuariosAdmin() { 
  
  const [usuarios, setUsuarios] = useState([]);
  // ¡CORRECCIÓN 2: 'respuesta' siempre será null o un objeto!
  const [respuesta, setRespuesta] = useState(null); 

  useEffect(() => {
    // ¡CORRECCIÓN 3: Usamos el objeto para 'respuesta'!
    setRespuesta({ message: "Cargando usuarios...", type: "info" }); 
    fetch(`${API_BASE_URL}/usuarios`)
      .then(res => {
        if (!res.ok) {
          // Lanzamos el error para que lo capture el catch
          throw new Error('Error al cargar usuarios'); 
        }
        return res.json();
      })
      .then(data => {
        setUsuarios(data);
        setRespuesta(null); // Limpiamos si todo OK
      })
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        // ¡Usamos el objeto para el error!
        setRespuesta({ message: "Error al cargar usuarios.", type: "error" }); 
      });
  }, []); 

  const handleEliminar = async (id, nombreUsuario) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${nombreUsuario}" (ID: ${id})? Esta acción no se puede deshacer.`)) {
      return; 
    }

    // Usamos objeto (esto ya estaba bien)
    setRespuesta({ message: `Eliminando usuario ID: ${id}...`, type: "info" });

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) { 
        setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== id));
        setRespuesta({ message: `Usuario "${nombreUsuario}" (ID: ${id}) eliminado con éxito.`, type: "success" });
      } else {
        setRespuesta({ message: `Error al eliminar el usuario ID: ${id}.`, type: "error" });
      }
    } catch (error) {
      console.error("Error de red al eliminar:", error);
      setRespuesta({ message: "Error de conexión al intentar eliminar.", type: "error" });
    }
  };

  return (
    <main className="admin-main">
      <h1 className="admin-main-title">Gestionar Usuarios</h1>
      
      {/* ¡CORRECCIÓN 4: Ahora leemos 'respuesta.message'! */}
      {respuesta && (
        <div style={{ 
          color: respuesta.type === 'error' ? '#c00' : (respuesta.type === 'success' ? 'green' : '#333'), 
          marginBottom:'18px', 
          padding: '10px', 
          border: `1px solid ${respuesta.type === 'error' ? '#c00' : (respuesta.type === 'success' ? 'green' : '#ccc')}`,
          borderRadius: '8px'
        }}>
          {respuesta.message} {/* Leemos la propiedad 'message' */}
        </div>
      )}

      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <Link to="/admin/usuarios/nuevo" className="btn-editar" style={{backgroundColor: '#00a651', color: 'white'}}> 
          + Crear Usuario
        </Link>
      </div>

      <div className="tabla-productos-contenedor"> 
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>F. Nacimiento</th>
              <th>Dirección</th>
              <th>Comuna</th>
              <th>Región</th> 
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* --- Lógica de Renderizado (Esta parte estaba bien) --- */}
            {respuesta && respuesta.type === 'info' && respuesta.message.includes('Cargando') && ( 
              <tr>
                <td colSpan="11" style={{ textAlign: 'center' }}>Cargando usuarios...</td>
              </tr>
            )}
            {respuesta && respuesta.type === 'error' && respuesta.message.includes('cargar') && (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', color: '#c00' }}>{respuesta.message}</td>
              </tr>
            )}
            {(!respuesta || (respuesta.type !== 'info' && !respuesta.message.includes('cargar'))) && (
              <>
                {(!usuarios || usuarios.length === 0) ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center' }}>No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  Array.isArray(usuarios) && usuarios.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.rut}</td>
                      <td>{user.nombre}</td>
                      <td>{user.apellido}</td>
                      <td>{user.email}</td>
                      <td>{user.fechaNacimiento || 'N/A'}</td>
                      <td>{user.direccion || 'N/A'}</td>
                      <td>{user.comuna?.nombre || 'N/A'}</td>
                      <td>{user.comuna?.region?.nombre || 'N/A'}</td>
                      <td>{user.tipoUsuario?.nombre || 'N/A'}</td> 
                      <td>
                        <Link 
                          to={`/admin/usuarios/editar/${user.id}`} 
                          className="btn-editar"
                        >
                          Editar
                        </Link>
                        <button 
                          onClick={() => handleEliminar(user.id, `${user.nombre} ${user.apellido}`)}
                          className="btn-eliminar"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}