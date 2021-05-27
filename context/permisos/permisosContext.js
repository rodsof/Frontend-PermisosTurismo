import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import axiosClient from '../../config/axios';

export const PermisosContext = createContext();

const PermisosProvider = (props) => {


    const [spinnerPermisos, setSpinner] = useState(null);
    const [permisos, savePermisos] = useState([]);
    const [errorPermisos, setError] = useState(null);
    const [permisosFiltrados, savePermisosFiltrados] = useState(null);
    const [exito, setExito] = useState(null);


    const getCiudadano = async permiso => {
        var ciudadanoExiste;
        var urlCiudadanos = "/ciudadanos/"
        try {
            const nroDoc = permiso.dni;
            ciudadanoExiste = await axiosClient.get(urlCiudadanos, { params: { nroDoc } });


            if (ciudadanoExiste.data.data.length == 0) {
                const ciudadanoData = {
                    "data": {
                        "type": "Ciudadano",
                        "id": null,
                        "attributes": {
                            "cuil": permiso.cuil,
                            "nombre": permiso.nombre,
                            "apellido": permiso.apellido,
                            "nroDoc": permiso.dni,
                            "nroTramite": permiso.nroTramite,
                            "telefono": permiso.celular,
                            "email": permiso.email,
                            "extranjero": permiso.extranjero,
                            "sexo": permiso.genero
                        }
                    }
                }
                ciudadanoExiste = await axiosClient.post(urlCiudadanos, ciudadanoData)

            }
        } catch (error) {
            setSpinner(null)
            setError("Hubo un error, intente de nuevo por favor")
        }
        return ciudadanoExiste;
    }

    const getLocalidad = async (idLocalidad) => {
        var url = "https://apis.datos.gob.ar/georef/api/localidades?id=" + idLocalidad;
        var localidad;
        try {
            const results = await axios.get(url);

            if (results.data.errores) {
                setError("Hubo un error")
            }
            else {
                localidad = results.data.localidades[0];
            }
        } catch (error) {
            setSpinner(null)
            setError("Hubo un error, intente de nuevo por favor")
            setTimeout(() => {
                setError(null)
            }, 11000);
        }
        return localidad;
    }

    const getDomicilio = async permiso => {
        var domicilioExiste;
        var urlDomicilios = "/domicilios/"
        // chequeamos que la combinacion de calle nro piso depto sea unica?
        try {
            const localidad = permiso.localidad;
            const calle = permiso.calle;
            const nro = permiso.numero;
            const piso = permiso.piso;
            const depto = permiso.depto;
            domicilioExiste = await axiosClient.get(urlDomicilios + "?idLocalidad=" + localidad + "&calle=" + calle + "&nro=" + nro + "&piso=" + piso + "&depto=" + depto);
            if (domicilioExiste.data.data.length == 0) {
                const localidadResults = await getLocalidad(permiso.localidad);
                const latLocalidad = localidadResults.centroide.lat;
                const lonLocalidad = localidadResults.centroide.lon;

                const domicilioData = {
                    "data": {
                        "type": "Domicilio",
                        "id": null,
                        "attributes": {
                            idProvincia: permiso.provincia,
                            idDepartamento: permiso.departamento,
                            idLocalidad: permiso.localidad,
                            latLocalidad: latLocalidad,
                            longLocalidad: lonLocalidad,
                            calle: permiso.calle,
                            nro: permiso.numero,
                            piso: permiso.piso,
                            depto: permiso.depto
                        }
                    }
                }
                domicilioExiste = await axiosClient.post(urlDomicilios, domicilioData)
            }
        }
        catch (error) {
            setSpinner(null)
            setError("Hubo un error, intente de nuevo por favor")
            setTimeout(() => {
                setError(null)
            }, 11000);
        }

        return domicilioExiste;
    }


    const agregarPermiso = async permiso => {
        setSpinner(true)
        setExito(null)
        setError(null);
        var urlPermisos = "/permisos/";
        try {
            var ciudadanoExiste = await getCiudadano(permiso);
            var domicilioExiste = await getDomicilio(permiso);

            var linkCiudadano, linkDomicilio;
            if (ciudadanoExiste.data.data[0])
                linkCiudadano = ciudadanoExiste.data.data[0].links.self;
            else
                linkCiudadano = ciudadanoExiste.data.data.links.self;
            if (domicilioExiste.data.data[0])
                linkDomicilio = domicilioExiste.data.data[0].links.self;
            else
                linkDomicilio = domicilioExiste.data.data.links.self;
        } catch (error) {
            setSpinner(null)
            setError("Hubo un error, intente de nuevo por favor")
            setTimeout(() => {
                setError(null)
            }, 11000);
        }

        try {
            const permisoData = {
                "data": {
                    "type": "Permiso",
                    "id": null,
                    "attributes": {
                        "codigoPermiso": null,
                        "fecha": permiso.fechaIngreso,
                        "evento": permiso.evento,
                        "ciudadano": linkCiudadano,
                        "domicilio": linkDomicilio
                    }
                }
            }
            const results = await axiosClient.post(urlPermisos, permisoData);
            const exito = {
                "codigo": results.data.data.id,
                "fechaGeneracion": results.data.data.attributes.fechaGeneracion,
                "ciudadano": permiso.nombre + " " + permiso.apellido,
                "cuil": permiso.cuil
            }
            setExito(JSON.stringify(exito));
            setTimeout(() => {
                setExito(null)
            }, 11000);
            setError(null);
            setSpinner(null)

        }
        catch (error) {
            setSpinner(null)
            setError("Hubo un error! Revise los datos de su inscripción")
            setTimeout(() => {
                setError(null)
            }, 11000);
        }

    }

    useEffect(() => {
        const getPermisos = async () => {
            setError(null);

            var urlPermisos = "/permisos/";
            try {
                const results = await axiosClient.get(urlPermisos);
                var status = results.request.status;
                if (status != 200) {
                    savePermisos(null);
                    setError("Hubo un error")
                }
                else {
                    var arrayAuxiliar = [];
                    const res = results.data.data;

                    for (var i = 0; i < res.length; i++) {
                        res[i].attributes.id = res[i].id;
                        res[i].attributes.evento = res[i].relationships.evento.links.related;
                        res[i].attributes.domicilio = res[i].relationships.domicilio.links.related;
                        arrayAuxiliar.push(res[i].attributes);
                    }
                    savePermisos(arrayAuxiliar);
                }

            } catch (error) {
                console.log(error);
            }
        }
        getPermisos();
    }, []);

    const filtrarPermisos = (data) => {
        savePermisosFiltrados(null);
        setSpinner(true);
        const permisosSegunEvento = permisos.filter((permiso) => permiso.evento.includes(data.evento) && permiso.fecha.includes(data.fecha));
        setSpinner(null);
        savePermisosFiltrados(permisosSegunEvento);
        return permisosSegunEvento;
    }

    return (
        <PermisosContext.Provider
            value={{
                permisos,
                permisosFiltrados,
                errorPermisos,
                spinnerPermisos,
                exito,
                agregarPermiso,
                filtrarPermisos,
                getCiudadano
            }}
        >
            {props.children}
        </PermisosContext.Provider>
    );
}

export default PermisosProvider;