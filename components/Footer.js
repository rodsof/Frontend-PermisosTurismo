import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons"

const Footer = () => {
    return (
        <nav className="navbar navbar-light bg-light" style={{bottom: 0, position: "fixed", width: "100%"}}>
            <div className="container" >
                <a className="navbar-brand" href="https://github.com/rodsof/Frontend-PermisosTurismo" style={{ color: "#0082c2", margin: "auto", textAlign: 'center' }}>
                   <FontAwesomeIcon icon={faGithub}/> Sofía Rodríguez - Parcial Sistemas Distribuidos {new Date().getFullYear()}
                </a>
            </div>
        </nav>
    )
}

export default Footer;