import React, { createContext, useEffect, useState } from 'react';
import axiosClient from '../../config/axios';
export const EventosContext = createContext();

const EventosProvider = (props) => {


    const [spinner, setSpinner] = useState(null);
    const [eventos, saveEventos] = useState([]);
    const [errorEventos, setError] = useState(null);
    
    useEffect(() => {
        const getEventos = async () => {
            setError(null);
            var url = "/eventos/";
            try {
                const results = await axiosClient.get(url);
                var status = results.request.status;
                if ( status != 200) {
                    saveEventos(null);
                    setError("Hubo un error")
                }
                else {
                    var arrayAuxiliar = [];
                    const res = results.data.data;

                    for (var i = 0; i < res.length; i++) {
                        // Agrego los atributos que servirán 
                        res[i].attributes.id = res[i].id;
                        res[i].attributes.link = res[i].links.self;
                        arrayAuxiliar.push(res[i].attributes);
                    }                    saveEventos(arrayAuxiliar);
                }

            } catch (error) {
                setError("Problema cargando los eventos")
            }
        }
        getEventos();
    }, []);



    return (
        <EventosContext.Provider
            value={{
                eventos,
                errorEventos,
                spinner
            }}
        >
            {props.children}
        </EventosContext.Provider>
    );
}

export default EventosProvider;