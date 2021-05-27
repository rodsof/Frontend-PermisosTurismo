import React from 'react';
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Error = ({ error }) => {
    return (
        <div className="error">
            <FontAwesomeIcon icon={faTimesCircle} />
           Error: {error}
        </div>
    )
}

export default Error;