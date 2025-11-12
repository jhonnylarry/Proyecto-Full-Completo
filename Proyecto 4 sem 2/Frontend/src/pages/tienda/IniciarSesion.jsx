import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTAR EL HOOK

const API_BASE_URL = 'http://localhost:8080/api';
export default function IniciarSesion() {
 const navigate = useNavigate(); 

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

  // --- ¡Este es el handleSubmit REAL, con fetch! ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setRespuesta(null); // Limpiamos respuesta anterior

    try {
      // ¡Este fetch AHORA SÍ va al backend!
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Manda { email, contrasena }
      });

      if (response.ok) {
        // 2. Si el backend dice OK, lee el JSON
        // Espera { "role": "ADMIN", "usuarioId": 1, "nombreUsuario": "Admin" }
        const data = await response.json(); 
        
        // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
        // 3. Guarda TODO en localStorage como un JSON string
        const usuarioData = {
          id: data.usuarioId,
          nombre: data.nombreUsuario,
          role: data.role
        };
        // Guardamos el objeto 'usuario' como texto
        localStorage.setItem('usuario', JSON.stringify(usuarioData)); 
        // --- FIN DEL CAMBIO ---
        
        // 4. Redirige según el rol
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          // Para 'CLIENTE' o cualquier otro rol
        navigate('/');
        }

      } else {
        // Si el backend dijo 401 (no autorizado) o 404
        setRespuesta('Error: Correo o contraseña incorrectos.');
      }
    } catch (error) {
      // Si hay un error de red (backend apagado, CORS, etc.)
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