import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const GeografiaContext = createContext();

const GeografiaProvider = (props) => {

    const [spinner, setSpinner] = useState(null);
    const [error, setError] = useState(null);
    const [provincias, saveProvincias] = useState([]);
    const [departamentos, saveDepartamentos] = useState([]);
    const [localidades, saveLocalidades] = useState([]);
    const [localidad, saveLocalidad] = useState(null); 
    // Para consumir en componente Map
    const [locations, saveLocations] = useState(null)

    const getDepartamentos = async (idProvincia) => {
        setSpinner(true);
        var url = "https://apis.datos.gob.ar/georef/api/departamentos?provincia=" + idProvincia;
        try {
            const results = await axios.get(url);
            setSpinner(false);
            if (results.data.errores) {
                saveDepartamentos(null);
                setError("Hubo un error")
            }
            else {
                var arrayAuxiliar = [];

                for (var i = 1; i < results.data.cantidad; i++) {
                    arrayAuxiliar.push(results.data.departamentos[i]);
                }
                arrayAuxiliar.sort((a,b) => { // Ordenar los resultados por alfabeto para que sea más fácil encontrar la opción deseada
                    return a.name > b.name;
                });
                arrayAuxiliar.sort(function(a, b) {
                    if(a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1;
                    if(a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
                    return 0;
                   })
                saveDepartamentos(arrayAuxiliar);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener localidades por departamento
    const getLocalidades = async (idDepartamento) => {
        setSpinner(true);
        var url = "https://apis.datos.gob.ar/georef/api/localidades?departamento=" + idDepartamento;
        try {
            const results = await axios.get(url);
            setSpinner(false);
            if (results.data.errores) {
                saveLocalidades(null);
                setError("Hubo un error")
            }
            else {
                var arrayAuxiliar = [];

                for (var i = 1; i < results.data.cantidad; i++) {
                    arrayAuxiliar.push(results.data.localidades[i]);
                }
                arrayAuxiliar.sort((a,b) => { // Ordenar los resultados por alfabeto para que sea más fácil encontrar la opción deseada
                    return a.name > b.name;
                });
                arrayAuxiliar.sort(function(a, b) {
                    if(a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1;
                    if(a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
                    return 0;
                   })
                saveLocalidades(arrayAuxiliar);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Función para obtener el nombre de las localidades por evento
    const getLocations= async (permisos) => {
        saveLocalidades(null);
        var locationsArray = [];
        for (var i = 0; i < permisos.length; i++) {
            const result = await axios.get(permisos[i].domicilio);
            locationsArray.push([result.data.data.attributes.idLocalidad, parseFloat(result.data.data.attributes.latLocalidad), parseFloat(result.data.data.attributes.longLocalidad)]);
        }
        saveLocations(locationsArray)
    }


    const getLocalidad = async (url) => {
        setSpinner(true);
        try {
            const results = await axios.get(url);
            setSpinner(false);
            console.log(results.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getProvincias = async () => {
            var url = "https://apis.datos.gob.ar/georef/api/provincias";

            try {
                const results = await axios.get(url);
                if (results.data.errores) {
                    saveProvincias(null);
                    setError("Hubo un error")
                }
                else {
                    var arrayAuxiliar = [];

                    for (var i = 1; i < results.data.cantidad; i++) {
                        arrayAuxiliar.push(results.data.provincias[i]);
                    }
       // Ordenar los resultados por alfabeto para que sea más fácil encontrar la opción deseada
                        arrayAuxiliar.sort(function(a, b) {
                            if(a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1;
                            if(a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
                            return 0;
                           })
                    saveProvincias(arrayAuxiliar);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getProvincias();
    }, []);

    return (
        <GeografiaContext.Provider
            value={{
                provincias,
                departamentos,
                localidades,
                locations,
                localidad,
                error,
                spinner,
                getLocalidades,
                getLocations,
                getLocalidad,
                getDepartamentos,
                saveProvincias,
                saveLocalidades,
                setError,
                setSpinner
            }}
        >
            {props.children}
        </GeografiaContext.Provider>
    );
}

export default GeografiaProvider;