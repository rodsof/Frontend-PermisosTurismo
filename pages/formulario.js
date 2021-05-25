import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EventosContext } from "../context/eventos/eventosContext";
import { GeografiaContext } from "../context/datosGeograficos/datosGeograficosContext";
import Error from "../components/Error";
import Advertencia from "../components/Advertencia";
import { faCheck, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PermisosContext } from "../context/permisos/permisosContext";


const formulario = () => {
  // Defino el context de eventos
  const eventosContext = useContext(EventosContext);
  const { errorEventos, eventos } = eventosContext;
  // Defino el context de geografía
  const geografiaContext = useContext(GeografiaContext);
  const { provincias, localidades, departamentos, getLocalidades, getDepartamentos, spinner } = geografiaContext;
  // Define el context de permisos
  const permisosContext = useContext(PermisosContext);
  const { errorPermisos, agregarPermiso, exito, spinnerPermisos } = permisosContext;
  // Cambio de provincia
  const cambioProvincia = (e) => {
    getDepartamentos(e.target.value);
  }
  // Para usar en validación de yup
  const hoy = new Date();
  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }

  // Cambio de departamento
  const cambioDepartamento = (e) => {
    getLocalidades(e.target.value);
  }

  // Validación del formulario usando formik y yup
  const formik = useFormik({
    initialValues: {
      dni: "",
      nroTramite: "",
      nombre: "",
      apellido: "",
      fechaIngreso: "",
      calle: "",
      numero: "",
      piso: "",
      depto: "",
      celular: "",
    },
    validationSchema: Yup.object({
      dni: Yup.string().required("Por favor ingrese su DNI"),
      nroTramite: Yup.string().required("Por favor ingrese el número de trámite"),
      nombre: Yup.string().required("Por favor ingrese su nombre"),
      apellido: Yup.string().required("Por favor ingrese su apellido"),
      email: Yup.string().email(),
      fechaIngreso: Yup.date().min(hoy, `Seleccione una fecha a partir del ${formatDate(hoy)}`)
    }),
    onSubmit: (data, resetForm) => {
      agregarPermiso(data);
      if (exito) {
        console.log(exito)
        resetForm();
      }
    },
  });

  return (
    <section>
      <form
        onSubmit={formik.handleSubmit}
        className="formulario"
      >

        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-12" style={{ textAlign: "center" }}>
              <h3>Cuando complete la inscripción le llegará un correo electrónico con la confirmación</h3>
            </div>
          </div>
        </div>
        {/* Datos identificacion */}
        <div className="row">
          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="DNI"
            >
              DNI:
                </label>
            <input
              type="text"
              className="form-control"
              id="dni"
              value={formik.values.dni}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dni && formik.errors.dni ? (
              <Error error={formik.errors.dni} />
            ) : null}
          </div>

          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="nroTramite"
            >
              N° Trámite:
                </label>
            <input
              type="text"
              className="form-control"
              id="nroTramite"
              value={formik.values.nroTramite}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.nroTramite && formik.errors.nroTramite ? (
              <Error error={formik.errors.nroTramite} />
            ) : null}
          </div>

          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="extranjero"
            >
              Extranjero:
                </label>
            <select
              className="form-select"
              id="extranjero"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue="default"
            >
              <option value="default" disabled>Seleccione</option>
              <option value="SI">SI</option>
              <option value="NO">NO</option>
            </select>
          </div>

          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="genero"
            >
              Género:
                </label>
            <select
              className="form-select"
              id="genero"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue="default"
            >
              <option value="default" disabled>Seleccione</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </div>


        </div>
        {/* Fin Datos identificacion */}

        <div className="row">
          <div className="col-sm-12">
            <hr />
          </div>
        </div>

        {/* Datos personales */}
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-1">
              &nbsp;
                                    </div>
            <div className="col-sm-10">
              <div className="col-sm-12" style={{ textAlign: "left" }}>
                <h2 style={{ color: "white" }}> < FontAwesomeIcon icon={faUser} /> Datos personales </h2>
              </div>
            </div>
            <div className="col-sm-1">
              &nbsp;
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row">
            <div className="col-sm-4">
              <label className="control-label">Nombre/s:</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} />
              {formik.touched.nombre && formik.errors.nombre ? (
                <Error error={formik.errors.nombre} />

              ) : null}
            </div>
            <div className="col-sm-4">
              <label className="control-label">Apellido/s:</label>
              <input type="text"
                className="form-control"
                id="apellido"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} />
              {formik.touched.apellido && formik.errors.apellido ? (
                <Error error={formik.errors.apellido} />

              ) : null}
            </div>
            <div className="col-sm-4">

            </div>
          </div>

          <div className="row">
            <div className="col-sm-4">
              <label className="control-label">Celular:</label>
              <input type="text" className="form-control"
                id="celular"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} />

            </div>
            <div className="col-sm-4">
              <label className="control-label">Email:</label>
              <input type="text" className="form-control" id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} />

            </div>
          </div>
        </div>

        {/* Fin Datos personales */}

        <div className="row">
          <div className="col-sm-12">
            <hr />
          </div>
        </div>

        {/*  Datos evento */}
        <div className="row">
          <div className="col-sm-4">
            <label
              className="form-label"
              htmlFor="evento"
            >
              Evento:
                </label>
            <select
              className="form-select"
              id="evento"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue="default"
            >
              <option value="default" disabled>Seleccione</option>
              {eventos.map((evento) =>
                <option value={evento.link} key={evento.id}>{evento.nombre}</option>
              )}
            </select>
            {errorEventos ? (
              <Error error={errorEventos} />

            ) : null}
          </div>

          <div className="col-sm-4">
            <label
              className="form-label"
              htmlFor="fechaIngreso"
            >
              Fecha Ingreso:
                </label>
            <input
              type="date"
              className="form-control"
              id="fechaIngreso"
              value={formik.values.fechaIngreso}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fechaIngreso && formik.errors.fechaIngreso ? (
              <Error error={formik.errors.fechaIngreso} />

            ) : null}
          </div>

        </div>
        {/* Fin Datos evento */}


        {/* Ubicación Actual */}
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-1">
              &nbsp;
                                    </div>
            <div className="col-sm-10">
              <div className="col-sm-12" style={{ textAlign: "left" }}>
                <h2 style={{ color: "white" }}>< FontAwesomeIcon icon={faHome} />  Ubicación Actual</h2>
              </div>
            </div>
            <div className="col-sm-1">
              &nbsp;
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <label
              className="form-label"
              htmlFor="provincia"
            >
              Provincia:
                </label>
            <select
              className="form-select"
              id="provincia"
              onChange={(e) => { cambioProvincia(e); formik.handleChange(e) }}
              onBlur={formik.handleBlur}
              defaultValue="default"
            >
              <option value="default" disabled>Seleccione</option>
              {provincias.map((provincia) =>
                <option value={provincia.id} key={provincia.id}>{provincia.nombre}</option>
              )}
            </select>

          </div>

          <div className="col-sm-4">
            <label
              className="form-label"
              htmlFor="departamento"
            >
              Departamento:
                </label>
            <select
              className="form-select"
              id="departamento"
              onChange={(e) => { cambioDepartamento(e); formik.handleChange(e) }}
              onBlur={formik.handleBlur}
              defaultValue="default"
            >
              <option value="default" disabled>Seleccione</option>
              {departamentos.map((departamento) =>
                <option value={departamento.id} key={departamento.id}>{departamento.nombre}</option>
              )}
            </select>
          </div>


          <div className="col-sm-4">
            <label
              className="form-label"
              htmlFor="localidad"
            >
              Localidad:
                </label>
            <select
              className="form-select"
              id="localidad"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              defaultValue="default"
            >
              <option value="default" disabled>{spinner ? "Cargando..." : "Seleccione"}</option>
              {localidades.map((localidad) =>
                <option value={localidad.id} key={localidad.id}>{localidad.nombre}</option>
              )}
            </select>

          </div>
        </div>

        <div className="row">
          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="calle"
            >
              Calle:
                </label>
            <input
              type="text"
              className="form-control"
              id="calle"
              value={formik.values.calle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.calle && formik.errors.calle ? (
              <Error error={formik.errors.calle} />

            ) : null}
          </div>

          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="numero"
            >
              Número:
                </label>
            <input
              type="text"
              className="form-control"
              id="numero"
              value={formik.values.numero}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.numero && formik.errors.numero ? (
              <Error error={formik.errors.numero} />

            ) : null}
          </div>


          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="piso"
            >
              Piso:
                </label>
            <input
              type="text"
              className="form-control"
              id="piso"
              value={formik.values.piso}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.piso && formik.errors.piso ? (
              <Error error={formik.errors.piso} />

            ) : null}
          </div>

          <div className="col-sm-3">
            <label
              className="form-label"
              htmlFor="depto"
            >
              Dpto.:
                </label>
            <input
              type="text"
              className="form-control"
              id="depto"
              value={formik.values.depto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.depto && formik.errors.depto ? (
              <Error error={formik.errors.depto} />
            ) : null}
          </div>
        </div>
        {/* Fin Ubicación Actual */}

        {/* Advertencias */}
        <Advertencia advertencia="Advertencia: Verifique los datos cargados, este formulario no podrá anularse ni modificarse una vez generado" />
        <Advertencia advertencia="Por el presente manifiesto que los visitantes incluidos en la presente solicitud no poseemos síntomas de COVID-19" />
        {/* Fin Advertencias */}
        <div className="row" style={{ marginTop: "35px", marginBottom: "35px" }}>
          {!exito && !spinnerPermisos ? <>
            <div className="col-sm-12" style={{ textAlign: "center" }}>
              <input
                type="submit"
                className="btn btn-success btn-lg"
                value="Registrar"
              />
            </div>
          </>
            :
            exito && !spinnerPermisos ?
              <div className="row"><div className="col-sm-12" style={{ textAlign: "center" }}> <span className="exito"><FontAwesomeIcon icon={faCheck} /> {exito}</span></div></div>
              :
              spinnerPermisos ? <div className="row"><div className="col-sm-12" style={{ textAlign: "center" }}><div className="spinner-border text-light" role="status">  <span className="sr-only">Loading...</span></div></div></div>
                :
                errorPermisos ? <Error error={errorPermisos} /> : null

          }
        </div>
      </form>
    </section >
  );
};

export default formulario;