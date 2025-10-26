import React, { useState, useEffect } from 'react';

// ¡¡1. TE FALTABA LA CONSTANTE DE LA URL!!
const API_BASE_URL = 'http://localhost:8080/api';

// (Tu función se llama 'Mensajes', asegúrate que el archivo se llame Mensajes.jsx)
export default function Mensajes() { 
 
  // --- ¡¡ESTO ES LO QUE BORRASTE Y CAUSÓ EL ERROR!! ---
  // 2. El estado para guardar la lista (debe empezar como array vacío [])
  const [mensajes, setMensajes] = useState([]); 
  // 3. El estado para los mensajes de carga
  const [respuesta, setRespuesta] = useState(null); 
  // ---

  useEffect(() => {
    setRespuesta("Cargando mensajes...");
    fetch(`${API_BASE_URL}/mensajes`)
      .then(res => res.json())
      .then(data => {
        setMensajes(data);
        setRespuesta(null);
      })
      .catch(err => {
        console.error("Error al cargar mensajes:", err);
        setRespuesta("Error al cargar mensajes.");
      });
  }, []);

  // --- 4. Función para Eliminar (Esta parte está perfecta) ---
  const handleEliminar = (id) => {
    if (!window.confirm(`¿Seguro que quieres eliminar el mensaje ID: ${id}?`)) {
      return;
    }
    
    fetch(`${API_BASE_URL}/mensajes/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setMensajes(prevMensajes => prevMensajes.filter(msg => msg.id !== id));
        setRespuesta(`Mensaje ID: ${id} eliminado con éxito.`);
      } else {
        setRespuesta(`Error al eliminar el mensaje ID: ${id}.`);
      }
    })
    .catch(err => {
      console.error("Error al eliminar:", err);
      setRespuesta("Error de conexión al eliminar.");
    });
  };

  // --- 5. El JSX (HTML) ---
  // (Esta parte está perfecta, ahora funcionará porque 'mensajes' y 'respuesta' existen)
  return (
    <main className="admin-main">
      {/* ... (tu código JSX) ... */}
      <h1 className="admin-main-title">Bandeja de Mensajes</h1>
      {respuesta && <p>{respuesta}</p>}
      <div className="tabla-productos-contenedor">
        <table id="tabla-mensajes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Mensaje</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No hay mensajes.</td>
              </tr>
            ) : (
              mensajes.map(msg => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>{msg.nombre}</td>
                  <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                  <td>{msg.mensaje}</td>
                  <td>
                    <button 
                      onClick={() => handleEliminar(msg.id)} 
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}