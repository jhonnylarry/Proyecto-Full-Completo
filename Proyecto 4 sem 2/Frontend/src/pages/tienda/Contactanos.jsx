import { useState } from 'react';
import '../../EstiloT.css'

const API_BASE_URL = 'http://localhost:8080/api';

export default function Contactanos() {

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [respuesta, setRespuesta] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value 
    }));
  };

  // --- 4. Función handleSubmit (¡AQUÍ USAMOS API_BASE_URL!) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // <-- ¡Perfecto! Esto frena el GET
    setRespuesta(null); 

    try {
      // --- 5. ¡Usamos la constante para la URL! ---
      const response = await fetch(`${API_BASE_URL}/mensajes`, { // <-- ¡CORREGIDO!
        method: 'POST', // <-- ¡POST es correcto!
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (response.ok) {
        setRespuesta('¡Mensaje enviado con éxito!');
        setFormData({
          nombre: '',
          email: '',
          mensaje: ''
        });
      } else {
        // (Aquí puedes añadir lógica para leer el error del backend)
        setRespuesta('Error al enviar el mensaje. Intenta más tarde.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setRespuesta('Error de conexión. Revisa tu internet.');
    }
  };

  return (
    <>
<main>
        <div className="contact-header">
          <h1 style={{ textAlign: 'center' }}>Contacto</h1>
          <p style={{ textAlign: 'center' }}>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>

        {/* ¡¡CORRECCIÓN 1: Conectar el formulario al handleSubmit!! */}
        <form id="form-contacto" onSubmit={handleSubmit}>
          <table className="tabla-contacto">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="nombre">Nombre:</label>
                  {/* ¡¡CORRECCIÓN 2: Conectar los inputs al estado!! */}
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    value={formData.nombre}   // <-- Conecta el valor
                    onChange={handleChange} // <-- Conecta el cambio
                    required 
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="email">Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}    // <-- Conecta el valor
                    onChange={handleChange}  // <-- Conecta el cambio
                    required 
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="mensaje">Mensaje:</label>
                  <textarea 
                    id="mensaje" 
                    name="mensaje" 
                    rows="4" 
                    value={formData.mensaje}  // <-- Conecta el valor
                    onChange={handleChange} // <-- Conecta el cambio
                    required
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td>
                  <button type="submit">Enviar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        {/* (Opcional) Mostrar mensaje de respuesta */}
        {respuesta && <p style={{ textAlign: 'center' }}>{respuesta}</p>}

      </main>
    </>
  );
}
