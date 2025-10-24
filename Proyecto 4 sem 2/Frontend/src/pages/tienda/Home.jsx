import '../../EstiloT.css'

export default function Home() {
  return (
    <>
      <main>
        <table className="tabla-bienvenida">
          <tbody>
            <tr>
              <td style={{ width: "60%" }}>
                <h1>Bienvenido a Verdes-Souvenir</h1>
                <p>
                  Encuentra copas, vasos y placas conmemorativas de Carabineros. 
                  Productos únicos para coleccionistas y simpatizantes de la institución, 
                  ideales para regalar o complementar tu colección.
                </p>
              </td>
              <td style={{ width: "40%" }}>
                <img src="/img/logo 2.png" alt="logo empresa tabla" className="logo-tabla" />
              </td>
            </tr>
          </tbody>
        </table>

        <section className="productos-destacados">
          <h2>Productos Destacados</h2>
          <div className="lista-productos">
            {/* Aquí luego cargaremos productos desde el JSON */}
          </div>
        </section>
      </main>
    </>
  );
}
