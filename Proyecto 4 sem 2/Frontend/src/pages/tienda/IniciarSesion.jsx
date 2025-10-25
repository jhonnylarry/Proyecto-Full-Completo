import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTAR EL HOOK

const API_BASE_URL = 'http://localhost:8080/api';
export default function IniciarSesion() {

 const navigate = useNavigate(); // <-- 2. INICIALIZAR EL HOOK

  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });
  const [respuesta, setRespuesta] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- 3. MODIFICAR EL HANDLESUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuesta(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Si el login es 200 OK, leemos el JSON que mandó el backend
        const data = await response.json(); // data = { "role": "ADMIN", "token": "..." }
        
        // (Opcional pero recomendado) Guardar el token en el navegador
        // localStorage.setItem('token', data.token); 
        
        // --- 4. ¡AQUÍ ESTÁ LA LÓGICA DE REDIRECCIÓN! ---
        if (data.role === 'ADMIN') {
          // Si el rol es ADMIN, lo mandamos al dashboard
          navigate('/admin'); // <-- ¡Usa la ruta de admin de tu App.jsx!
        } else {
          // Si es CLIENTE o cualquier otra cosa, lo mandamos al home
          navigate('/'); // <-- Esta es la ruta de la tienda
        }

      } else {
        // Si es 401 (no autorizado) o 404 (no encontrado)
        setRespuesta('Error: Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setRespuesta('Error de conexión. Intenta más tarde.');
    }
  };

  // --- 5. El JSX (Tu HTML convertido) ---
  return (
    <>
<main>
      <section className="inicio-sesion" style={{maxWidth:'430px', margin:'40px auto', background:'#fff', borderRadius:'12px', boxShadow:'0 2px 12px #0001', padding:'32px 24px'}}>
        <h1 style={{textAlign:'center'}}>Iniciar Sesión</h1>
        
        {respuesta && <div style={{color: respuesta.startsWith('Error') ? '#c00' : 'green', marginBottom:'18px'}}>{respuesta}</div>}

        <form id="form-login" autoComplete="off" onSubmit={handleSubmit}>
          
          <label htmlFor="email-login">Correo*</label>
          <input 
            type="email" 
            id="email-login" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
            style={{width:'100%', marginBottom:'10px'}}
          />
          <div style={{fontSize:'0.95em', color:'#555', marginBottom:'10px'}}>Solo se permiten correos válidos.</div>

          <label htmlFor="contrasena-login">Contraseña*</label>
          <input 
            type="password" 
            id="contrasena-login" 
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required 
            style={{width:'100%', marginBottom:'18px'}}
          />

          <button type="submit" style={{width:'100%', background:'#0077cc', color:'#fff', border:'none', borderRadius:'8px', padding:'12px 0', fontSize:'1.1rem', cursor:'pointer'}}>Iniciar Sesión</button>
        </form>
      </section>
    </main>
    </>
  );
}