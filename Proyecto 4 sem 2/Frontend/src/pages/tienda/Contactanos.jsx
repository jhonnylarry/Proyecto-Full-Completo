import '../../EstiloT.css'

export default function Contactanos() {
  return (
    <>
          <main>
            <div className="contact-header">
              <h1 style={{ textAlign: 'center' }}>Contacto</h1>
              <p style={{ textAlign: 'center' }}>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>

            <form id="form-contacto">
              <table className="tabla-contacto">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="nombre">Nombre:</label>
                      <input type="text" id="nombre" name="nombre" required />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="email">Email:</label>
                      <input type="email" id="email" name="email" required />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="mensaje">Mensaje:</label>
                      <textarea id="mensaje" name="mensaje" rows="4" required></textarea>
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
          </main>
    </>
  );
}
