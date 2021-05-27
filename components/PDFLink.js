import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  pagina: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    textAlign: 'center'
  },
  seccion: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  imagen: {
    margin: "1rem",
    maxWidth: "100%",
    height: "auto"
},
  titulo: {
    fontWeight: "ultrabold",
    margin: "20px"
  },
  datos: {
    marginTop: "10px",
    marginBottom: "10px",
    textDecoration: "underline"
  }
});

const MiDoc = ({ ciudadano, cuil, codigo, fecha}) => {

  return (
    <Document>
      <Page size="A4" style={styles.pagina}>
        <View style={styles.seccion}>
          <Image src="/logoLP.png" />
          <Text style={styles.titulo}>
            Certificado de Circulación por Turismo conforme Decreto Provincial Nro. 1445/21
        </Text>
        <Text style={styles.datos}>Datos personales</Text>
          <Text>Nombre y apellido: {ciudadano} </Text>
          <Text>CUIL: {cuil} </Text>
          <Text style={styles.datos}>Datos del permiso </Text>
          <Text tyle={styles.datos}>Código de permiso {codigo} </Text>
          <Text>Generado el {fecha} </Text>
          <Text style={styles.titulo}>
            LOS DATOS VERTIDOS EN EL PRESENTE CERTIFICADO FUERON DISPUESTOS POR EL SOLICITANTE, TENIENDO LOS
            MISMOS CARÁCTER DE DECLARACIÓN JURADA. SU FALSEDAD PODRÁ TENER CONSECUENCIAS LEGALES.
        </Text>
        </View>
      </Page>
    </Document>
  )
}

const PDFLink = ({ ciudadano, cuil, codigo, fecha}) => {
  return (
    <div>
      <PDFDownloadLink document={<MiDoc 
      ciudadano={ciudadano}
      cuil={cuil}
      codigo={codigo}
      fecha={fecha}
      />} fileName="permisoturismo.pdf">
        {({ loading }) => (loading ? 'Cargando pdf...' : <span style={{textDecoration:'underline', cursor: 'pointer'}}>Descargar comprobante</span>)}
      </PDFDownloadLink>
    </div>
  )
}
export default PDFLink;