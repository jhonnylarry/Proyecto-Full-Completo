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
    e.preventDefault(); // Esto frena la recarga de la página
    setRespuesta(null);

    // --- ¡¡AQUÍ ESTÁ EL TRUCO!! ---
    // En vez de un 'try/catch' con 'fetch', hacemos una lógica falsa

    const { email, contrasena } = formData;

    // 1. Simulación de un ADMIN
    if (email === 'admin@correo.com' && contrasena === 'admin123') {
      
      setRespuesta('Inicio de sesión (ADMIN) exitoso');
      
      // (Opcional) Podemos guardar un "rol falso" para que el resto de la app sepa
      localStorage.setItem('userRole', 'ADMIN'); 
      
      navigate('/admin'); // ¡Te redirige al Dashboard!

    } 
    // 2. Simulación de un CLIENTE
    else if (email === 'cliente@correo.com' && contrasena === 'cliente123') {
      
      setRespuesta('Inicio de sesión (CLIENTE) exitoso');
      
      localStorage.setItem('userRole', 'CLIENTE');

      navigate('/'); // ¡Te redirige al Home (la tienda)!

    } 
    // 3. Si no es ninguno de los dos
    else {
      setRespuesta('Error: Correo o contraseña incorrectos.');
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