import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import axiosClient from '../../config/axios';

export const PermisosContext = createContext();

const PermisosProvider = (props) => {


    const [spinner, setSpinner] = useState(null);
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
        } catch (error) {
            setError("Hubo un error, intente de nuevo por favor")
        }

        if (ciudadanoExiste.data.data.length == 0) {
            const ciudadanoData = {
                "data": {
                    "type": "Ciudadano",
                    "id": null,
                    "attributes": {
                        "cuil": permiso.dni,
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
            try {
                ciudadanoExiste = await axiosClient.post(urlCiudadanos, ciudadanoData)
            }
            catch (error) {
                setError("Hubo un error, intente de nuevo por favor")
            }
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
            console.log(error);
        }
        return localidad;
    }

    const getDomicilio = async permiso => {
        var domicilioExiste;
        var urlDomicilios = "/domicilios/"
        /*    
        DUDA: preguntar si agregamos domicilios repetidos, chequeamos que la combinacion de calle nro piso depto sea unica?
        try {
                const localidad = permiso.localidad;
                const calle= permiso.calle;
                const nro= permiso.nro;
                const piso= permiso.piso;
                ciudadanoExiste = await axiosClient.get(urlDomicilios, { params: { localidad, calle, nro, piso, depto } });
            } catch (error) {
                setError("Hubo un error, intente de nuevo por favor")
            } */

        //if (domicilioExiste.data.data.length == 0){
        const localidad = await getLocalidad(permiso.localidad);
        const latLocalidad = localidad.centroide.lat;
        const lonLocalidad = localidad.centroide.lon;

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
        try {
            domicilioExiste = await axiosClient.post(urlDomicilios, domicilioData)
        }
        catch (error) {
            setError("Hubo un error, intente de nuevo por favor")
        }
        //}
        return domicilioExiste;
    }


    const agregarPermiso = async permiso => {
        var urlPermisos = "/permisos/";
        setError(null);
        setSpinner(true);

        var ciudadanoExiste = await getCiudadano(permiso);
        var domicilioExiste = await getDomicilio(permiso);
        console.log(ciudadanoExiste);
        console.log(domicilioExiste)
        var linkCiudadano;
        if (ciudadanoExiste.data.data[0])
            linkCiudadano = ciudadanoExiste.data.data[0].links.self;
        else
            linkCiudadano = ciudadanoExiste.data.data.links.self;
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
                        "domicilio": domicilioExiste.data.data.links.self
                    }
                }
            }
            const results = await axiosClient.post(urlPermisos, permisoData);
            setExito("Permiso generado con éxito. <br/> Código: " + results.data.data.id + " <br/> Para: " + ciudadanoExiste.data.data[0].attributes.nombre + " " + ciudadanoExiste.data.data[0].attributes.apellido +
                "<br/> Fecha de generación: " + results.data.data.attributes.fechaGeneracion);
            setError(null);
            savePermisos(...permisos, results);
        }
        catch (error) {
            console.log(error)
            setError("Hubo un error! Revise los datos de su inscripción")
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
        const permisosSegunEvento = permisos.filter((permiso) => permiso.evento.includes(data.evento) && permiso.fecha.includes(data.fecha));
        savePermisosFiltrados(permisosSegunEvento);
        return permisosSegunEvento;
    }

    return (
        <PermisosContext.Provider
            value={{
                permisos,
                permisosFiltrados,
                errorPermisos,
                spinner,
                exito,
                agregarPermiso,
                filtrarPermisos
            }}
        >
            {props.children}
        </PermisosContext.Provider>
    );
}

export default PermisosProvider;