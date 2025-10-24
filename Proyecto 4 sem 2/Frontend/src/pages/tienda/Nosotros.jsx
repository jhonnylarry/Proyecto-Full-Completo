import '../../EstiloT.css'


export default function Nosotros() {
  return (
    <>
      <main>
        <table>
          <tbody>
            <tr>
              <td>
                <h2>Verdes-Souvenir</h2>
                <p>En Verdes-Souvenir, nos apasiona la naturaleza y el arte de regalar. Fundada en 2020, nuestra misión es ofrecer souvenirs únicos y ecológicos que capturan la esencia de la belleza natural. Cada producto está cuidadosamente diseñado para ser sostenible y respetuoso con el medio ambiente, utilizando materiales reciclados y técnicas artesanales.</p>
                <p>Nuestro equipo está compuesto por amantes de la naturaleza y expertos en diseño, comprometidos a crear recuerdos duraderos que no solo deleiten a nuestros clientes, sino que también contribuyan a la conservación del planeta. Creemos que cada souvenir debe contar una historia y reflejar el amor por nuestro entorno.</p>
                <p>Gracias por elegir Verdes-Souvenir. Juntos, podemos hacer del mundo un lugar más verde y hermoso, un recuerdo a la vez.</p>
              </td>
              <td>
                <img src="/img/logo 2.png" alt="Imagen de Nosotros" />
              </td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ textAlign: 'center' }}>Nuestro equipo</h2>

        <table className="tabla-nosotros">
          <tbody>
            <tr>
              <td style={{ width: '60%' }}>
                <p><strong>Eugenio Parada</strong> - Desarrollador Frontend</p>
              </td>
              <td style={{ width: '40%' }}>
                <img src="/img/mision.jpg" alt="Imagen de Eugenio" />
              </td>
            </tr>
            <tr>
              <td style={{ width: '60%' }}>
                <p><strong>Jonathan Larraguibel</strong> - Desarrollador Frontend</p>
              </td>
              <td style={{ width: '40%' }}>
                <img src="/img/mision.jpg" alt="Imagen de Jonathan" />
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
}