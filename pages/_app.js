import Layout from "../components/Layout"
import EventosProvider from "../context/eventos/eventosContext"
// Estilos Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
// Estilos propios
import '../styles/globals.css'
import GeografiaProvider from "../context/datosGeograficos/datosGeograficosContext"
import PermisosProvider from "../context/permisos/permisosContext"
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <GeografiaProvider>
      <EventosProvider>
        <PermisosProvider>
      <Component {...pageProps} />
      </PermisosProvider>
      </EventosProvider>
      </GeografiaProvider>
    </Layout>
  )
}

export default MyApp
