// pages/404.js
export default function Custom404() {
    return (
    <div className="row">
    <div className="col-sm-12" style={{textAlign:'center'}}>
    <h1>¿A qué parte del sistema desea acceder?</h1>
    <a href="/formulario" className="btn btn-success"  style={{ marginTop: "35px", marginBottom: "35px", marginRight: "30px" }}>Formulario</a>
    <a href="/admin" className="btn btn-success"  style={{ marginTop: "35px", marginBottom: "35px" }}>Administrador</a>
    </div>
    </div>
    )
  }