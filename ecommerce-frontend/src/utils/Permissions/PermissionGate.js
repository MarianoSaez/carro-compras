import React, { useContext } from "react";
import AuthContext from "../Authentication/AuthContext";


export const PermissionGate = ({ children }) => {

    const {auth} = useContext(AuthContext);

    return (
        <>  
            {
                auth ? 
                children :
                <h2>Permisos insuficientes!</h2>
            }
        </>
    );
};