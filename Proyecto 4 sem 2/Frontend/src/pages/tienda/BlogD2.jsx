import '../../EstiloT.css'
import { Link } from 'react-router-dom'

export default function BlogD2() {
  return (
    <>
      <main>
        <table>
          <tbody>
            <tr>
              <td style={{ width: '60%' }}>
                <h1>Ofertas del Día del Padre</h1>
                <p><em>Publicado el 25 de septiembre de 2025</em></p>
                <p>
                  En Verdes-Souvenir queremos ayudarte a encontrar el regalo perfecto para el 
                  Día del Padre. Por eso, durante esta semana tendremos <strong>ofertas 
                  exclusivas</strong> en nuestra colección de accesorios de Carabineros.
                </p>
                <p>
                  Entre los productos en promoción podrás encontrar:
                </p>
                <ul>
                  <li>Copas con grabados especiales: <strong>20% de descuento</strong>.</li>
                  <li>Vasos con escudo: <strong>2x1 en modelos seleccionados</strong>.</li>
                  <li>Placas conmemorativas: <strong>15% de descuento</strong>.</li>
                </ul>
                <p>
                  Además, todas las compras realizadas hasta el 19 de junio incluirán 
                  <strong>envío gratis</strong> a cualquier región del país, para que ningún 
                  papá se quede sin su regalo.
                </p>
                <p>
                  Sabemos que los detalles cuentan, y qué mejor manera de demostrar cariño que 
                  con un souvenir que combine tradición, orgullo y un estilo único.
                </p>
                <p>
                  No pierdas esta oportunidad: las ofertas estarán disponibles solo por tiempo 
                  limitado en nuestra tienda online. ¡Haz tu compra hoy y sorprende a papá en su día!
                </p>
                <Link to="/blogs">Volver a Blogs</Link>
              </td>
              <td style={{ width: '40%' }}>
                <img src="/img/feliz dia papa.png" alt="Imagen de Blog 2" className="imagen-blog" />
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}