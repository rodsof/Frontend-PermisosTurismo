import React from "react";

const Header = () => {
    return (
        <div className="row" style={{padding: "15px"}}>
            <div className="col-sm-9 col-xs-12 col-xxs-12 col-tn-12" >
                <a href="/" style={{color: "#0082c1", marginTop: "1rem"}}><h1>Permisos para turismo<br/> Gobierno de La Pampa</h1></a>
            </div>
            <div className="col-sm-3 col-xs-12 col-xxs-12 col-tn-12">
                <a href="/"><img src="/logoLP.png" className="img-fluid right" /></a>
            </div>
    </div>
    )
}

export default Header;