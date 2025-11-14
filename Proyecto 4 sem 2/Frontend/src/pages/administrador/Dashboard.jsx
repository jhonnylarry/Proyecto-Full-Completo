import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// --- 1. IMPORTAMOS LOS COMPONENTES DE RECHARTS ---
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const API_BASE_URL = 'http://localhost:8080/api';

// Función helper para formatear CLP
function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `$${(n ?? 0).toLocaleString('es-CL')}`;
  }
}

export default function DashboardAdmin() {
  
  // Estados para los contadores y los datos
  const [stats, setStats] = useState({
    usuarios: 0,
    productos: 0,
    mensajes: 0,
    ventas: 0
  });
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  // useEffect para traer TODOS los datos (se mantiene igual)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resUsuarios, resProductos, resMensajes, resPedidos] = await Promise.all([
          fetch(`${API_BASE_URL}/usuarios`),
          fetch(`${API_BASE_URL}/productos`),
          fetch(`${API_BASE_URL}/mensajes`),
          fetch(`${API_BASE_URL}/pedidos`)
        ]);
        
        if (!resUsuarios.ok) throw new Error('Error al cargar usuarios');
        if (!resProductos.ok) throw new Error('Error al cargar productos');
        if (!resMensajes.ok) throw new Error('Error al cargar mensajes');
        if (!resPedidos.ok) throw new Error('Error al cargar pedidos');

        const dataUsuarios = await resUsuarios.json();
        const dataProductos = await resProductos.json();
        const dataMensajes = await resMensajes.json();
        const dataPedidos = await resPedidos.json();

        setStats({
          usuarios: dataUsuarios.length,
          productos: dataProductos.length,
          mensajes: dataMensajes.length,
          ventas: dataPedidos.length
        });
        
        setPedidos(dataPedidos); 

      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setError(error.message);
      }
    };

    fetchStats();
  }, []);

  // --- 2. LÓGICA PARA PROCESAR LOS GRÁFICOS ---

  // Lógica para "Dinero gastado cada mes" (Gráfico de Línea)
  const ventasPorMes = useMemo(() => {
    // Nombres de los meses (en español corto)
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    // Preparamos un array de 12 meses, todos con total 0
    const dataPorMes = meses.map(mes => ({ mes, "Total Ventas": 0 }));

    // Recorremos los pedidos que trajimos
    pedidos.forEach(pedido => {
      try {
        const fecha = new Date(pedido.fechaVenta);
        const mesIndex = fecha.getMonth(); // 0 = Enero, 1 = Febrero...
        // Sumamos el valor total al mes correspondiente
        if (dataPorMes[mesIndex]) {
          dataPorMes[mesIndex]["Total Ventas"] += pedido.valorTotal;
        }
      } catch (e) {
        console.error("Error procesando fecha de pedido: ", pedido.fechaVenta, e);
      }
    });

    return dataPorMes; // Devuelve [{mes: "Ene", "Total Ventas": 0}, {mes: "Feb", "Total Ventas": 15000}, ...]
  }, [pedidos]);

  // Lógica para "Productos más vendidos" (Gráfico de Barras)
  const productosVendidos = useMemo(() => {
    const productosMap = new Map();
    
    for (const pedido of pedidos) {
      if (pedido.detalles) {
        for (const detalle of pedido.detalles) {
          const id = detalle.producto.id;
          const nombre = detalle.producto.nombre;
          const cantidad = detalle.cantidad;
          
          if (productosMap.has(id)) {
            productosMap.get(id).Cantidad += cantidad;
          } else {
            productosMap.set(id, {
              nombre: nombre,
              Cantidad: cantidad
            });
          }
        }
      }
    }
    
    // Devuelve [{nombre: "Producto A", Cantidad: 10}, {nombre: "Producto B", Cantidad: 8}, ...]
    return Array.from(productosMap.values())
      .sort((a, b) => b.Cantidad - a.Cantidad)
  }, [pedidos]);


  // --- 3. El JSX (return) ---
  return (
    <main className="admin-main">
    
      <h1 className="admin-main-title">Panel de Administrador</h1>
      
      <p style={{ marginBottom: '40px', fontSize: '1.1rem' }}>
        Bienvenido, admin. Aquí puedes gestionar productos, usuarios, etc.
      </p>

      {/* Contadores (se mantienen igual) */}
      <div className="dashboard-stats">
        {/* ... (tus 4 stat-card: usuarios, productos, mensajes, ventas) ... */}
        <div className="stat-card">
          <span className="stat-number">{stats.usuarios}</span>
          <span className="stat-label">Usuarios Registrados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.productos}</span>
          <span className="stat-label">Productos Publicados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.mensajes}</span>
          <span className="stat-label">Mensajes Nuevos</span>
        </div>
        <div className="stat-card" style={{borderColor: '#e74c3c'}}>
          <span className="stat-number" style={{color: '#e74c3c'}}>{stats.ventas}</span>
          <span className="stat-label">Ventas Totales</span>
        </div>
      </div>
      
      {/* Tarjetas de Navegación (se mantienen igual) */}
      <div className="admin-cards">
        {/* ... (tus 3 Link cards: Gestionar Usuarios, Productos, Mensajes) ... */}
        <Link to="/admin/usuarios" className="admin-card admin-card-blue">
          <h2 className="admin-card-title">Gestionar Usuarios</h2>
          <p className="admin-card-desc">Ver y editar usuarios registrados.</p>
        </Link>
        <Link to="/admin/productos" className="admin-card admin-card-green">
          <h2 className="admin-card-title">Gestionar Productos</h2>
          <p className="admin-card-desc">Añadir, editar y eliminar productos.</p>
        </Link>
        <Link to="/admin/mensajes" className="admin-card admin-card-yellow">
          <h2 className="admin-card-title">Ver Mensajes</h2>
          <p className="admin-card-desc">Leer mensajes de la página de contacto.</p>
        </Link>
      </div>

      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
      
      {/* --- 4. REEMPLAZAMOS LAS TABLAS POR LOS GRÁFICOS --- */}
      
      {/* --- GRÁFICO 1: VENTAS POR MES (LÍNEA) --- */}
      <div className="chart-container" style={{marginTop: '50px'}}>
        <h2 className="admin-main-title" style={{fontSize: '1.5rem', borderLeftWidth: '5px'}}>
          Ventas por Mes
        </h2>
        {/* ResponsiveContainer hace que el gráfico ocupe el 100% del div */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ventasPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Total Ventas" // Debe coincidir con la data
              stroke="#e74c3c" // Color rojo como tu foto
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- GRÁFICO 2: PRODUCTOS MÁS VENDIDOS (BARRAS) --- */}
      <div className="chart-container" style={{marginTop: '50px'}}>
        <h2 className="admin-main-title" style={{fontSize: '1.5rem', borderLeftWidth: '5px'}}>
          Productos Vendidos
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosVendidos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} unidades`} />
            <Legend />
            <Bar 
              dataKey="Cantidad" // Debe coincidir con la data
              fill="#f39c12" // Color naranjo como tu foto
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </main>
  );
}