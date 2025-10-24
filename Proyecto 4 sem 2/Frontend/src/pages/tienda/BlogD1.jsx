import '../../EstiloT.css'
import { Link } from 'react-router-dom'

export default function BlogD1() {
  return (
    <>
      <main>
        <table>
          <tbody>
            <tr>
              <td style={{ width: '60%' }}>
                <h1>Souvenirs con historia</h1>
                <p>
                  En Verdes-Souvenir creemos que cada detalle cuenta. Por eso, nuestros productos no 
                  son simples accesorios, sino piezas con valor histórico y simbólico que rinden homenaje 
                  a la institución de Carabineros de Chile.
                </p>
                <p>
                  Desde copas y vasos grabados con emblemas representativos, hasta placas conmemorativas 
                  que recuerdan a los escuadrones montados, ciclistas y motorizados, nuestra colección 
                  está diseñada para quienes sienten orgullo y respeto por la labor de Carabineros. 
                </p>
                <p>
                  Ya sea para regalar, decorar o coleccionar, cada pieza busca mantener viva la memoria 
                  y la tradición de la institución, convirtiéndose en un recuerdo único y duradero.
                </p>
                <Link to="/blogs">Volver a Blogs</Link>
              </td>
              <td style={{ width: '40%' }}>
                <img src="/img/logo 2.png" alt="Imagen de Blog 1" className="imagen-blog" />
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}
