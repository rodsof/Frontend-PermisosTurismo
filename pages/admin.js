import { faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import React, { useContext } from 'react';
import Error from '../components/Error';
import Mapa from "../components/Mapa";
import { EventosContext } from '../context/eventos/eventosContext';
import { PermisosContext } from '../context/permisos/permisosContext';

const admin = () => {
    // Defino context de eventos
    const eventosContext = useContext(EventosContext);
    const { errorEventos, eventos } = eventosContext;

    // Defino contect de permisos
    const permisosContext = useContext(PermisosContext)
    const { permisosFiltrados, filtrarPermisos, spinnerPermisos } = permisosContext;

    // Validación del formulario usando formik y yup
    const formik = useFormik({
        initialValues: {
            evento: "",
            fecha: ""
        },
        onSubmit: (data) => {
            filtrarPermisos(data);
        }
    })

    return (
        <div className="container">

            <form
                onSubmit={formik.handleSubmit}
            >
                <div className="row">
                    <div className="col-sm-6">
                        <label
                            className="form-label"
                            htmlFor="evento"
                        >
                            Evento:
                </label>
                        <select
                            className="form-select"
                            id="evento"
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


                    <div className="col-sm-6">
                        <label
                            className="form-label"
                            htmlFor="fecha"
                        >
                            Fecha Ingreso:
                </label>
                        <input
                            type="date"
                            className="form-control"
                            id="fecha"
                        />

                    </div>
                    <div className="row" style={{ marginTop: "35px", marginBottom: "35px" }}>
                        <div className="col-sm-12" style={{ textAlign: "center" }}>
                            <button className="btn btn-success btn-lg" type="submit" >Filtrar</button>
                        </div>
                    </div>
                </div>
            </form>
            { spinnerPermisos && !permisosFiltrados ?
                <div className="row"><div className="col-sm-12" style={{ textAlign: "center" }}><div className="spinner-border text-light" role="status">  <span className="sr-only">Loading...</span></div></div></div>
                : null
            }
            { permisosFiltrados ?
                permisosFiltrados.length > 0 ?
                    <>
                        <div className="row"><div className="col-sm-12" style={{ textAlign: "center", marginBottom: ".5rem" }}><span> <FontAwesomeIcon icon={faMapMarkerAlt} color="red"/> Haga click sobre los marcadores para conocer la cantidad de permisos tramitados en cada localidad</span></div></div>
                        <Mapa permisos={permisosFiltrados} />
                    </>
                    : <div className="row"><div className="col-sm-12" style={{ textAlign: "center" }}><span>No hay permisos para ese evento en la fecha indicada</span></div></div>
                : null}
            <div id="map" style={{ boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)", width: "100%", height: "700px", display: permisosFiltrados && permisosFiltrados.length > 0 ? 'block' : 'none' }}></div>

        </div>

    )
}

export default admin;