import React from 'react';
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Advertencia = ({ advertencia }) => {
    return (
        <div className="error">
            <FontAwesomeIcon icon={faExclamationCircle} /> {advertencia}
        </div>
    )
}

export default Advertencia;