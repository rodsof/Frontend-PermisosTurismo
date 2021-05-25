import React, { useContext, useEffect } from 'react';
import { GeografiaContext } from "../context/datosGeograficos/datosGeograficosContext";

const Mapa = ({ permisos }) => {

    // Definir context de datos geograficos
    const datosGeograficosContext = useContext(GeografiaContext);
    const { locations, getLocations } = datosGeograficosContext;
    useEffect(() => {
        getLocations(permisos);
    }, [permisos]);

    // Chequear si hay marcadores en el mismo lugar para contar cuantos permisos hay por ciudad
    const contarMarcadores = (allMarkers, marker) => {

        var latlng = marker.getPosition();
        var cantidad = 0;

        if (allMarkers.length != 0) {
            for (i = 0; i < allMarkers.length; i++) {
                var existingMarker = allMarkers[i];
                var pos = existingMarker.getPosition();

                // chequea si hay un marcador duplicado
                if (latlng.equals(pos)) {
                    // sumar 
                    cantidad++;
                }
            }
        }

        if (cantidad > 1) {
            return cantidad.toString() + " permisos";
        } else {
            return cantidad.toString() + " permiso";
        }
    }

    if (locations) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(-38.416097, -63.616672),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        var allMarkers=[];
        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map
            });

            allMarkers.push(marker);
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(contarMarcadores(allMarkers, marker));
                    infowindow.open(map, marker);
                }
            })(marker, i));
        };

    }
    return null
}
export default Mapa;