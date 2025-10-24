import '../../EstiloT.css'
import { Link } from 'react-router-dom'

export default function Blogs() {
  return (
    <>

    <main>
        <table>
        <tbody>
        <tr>
            <td style={{ width: '60%' }}>
            <div className="texto-encabezado">
                <h1>Souvenirs con historia</h1>
                <p>
                Cada copa, vaso y placa conmemorativa de nuestra tienda refleja la tradición 
                y el orgullo de Carabineros de Chile. Son artículos pensados para quienes desean 
                conservar un recuerdo especial y darle un valor simbólico a su colección.
                </p>
                <Link to="/blogs/d1">Leer más</Link>
            </div>
            </td>
              <td style={{ width: '40%' }}>
                <img src="/img/logo 2.png" alt="logo empresa tabla" className="logo-tabla" />
              </td>
        </tr>
        </tbody>
        </table>
        <table>
        <tbody>
        <tr>
            <td style={{ width: '60%' }}>
            <div className="texto-encabezado">
                <h1>Ofertas del dia del padre</h1>
                <p>
                Este Día del Padre sorprende con un regalo especial. 
                Verdes-Souvenir trae descuentos en llaveros, tazones y gorras de Carabineros, 
                ideales para quienes quieren rendir homenaje a la institución con estilo.
                </p>
                <Link to="/blogs/d2">Leer más</Link>
            </div>
            </td>
              <td style={{ width: '40%' }}>
                <img src="/img/feliz dia papa.png" alt="img blogs 2" className="logo-tabla" />
              </td>
        </tr>
        </tbody>
        </table>
    </main>

    </>
  );
}
