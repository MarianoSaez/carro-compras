import { createContext, useEffect, useState } from "react";

// Contexto que almacenara estado de autenticacion y autorizacion del usuario
const AuthContext = createContext();

const API = process.env.REACT_APP_API_SHOPPING_CART;


const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState(null);
    const [username, setUsername] = useState("User");

    const login = async (username, password) => {
        // Se envian los datos del usuarios que YA POSEE CUENTA
        const result = await fetch(`${API}/carrocompras/get-token/`, {
            'method' : 'POST',
            'headers' : {
                'Content-Type' : 'application/json',
            },
            'mode' : 'cors',
            'body' : JSON.stringify({
                'username' : username,
                'password' : password
            }),
        });

        if (result.ok) {
            // Obtener DATA del Response
            const data = await result.json();

            // Almacenar TOKEN
            localStorage.setItem('token', data.token);

            // Si el login fue exitoso guardar username en el contexto
            if (data.token) setUsername(username);

            // Almacenar en el contexto los permisos
            const allowed = Boolean(data.is_superuser) | Boolean(data.is_admin)
            setAuth(allowed);

            localStorage.setItem('allowed', allowed)
        } else {
            // Advertir el error
            window.alert("Usuario y/o contraseña provistos son incorrectos");
        }
    }

    const logout = () => {
        // Limpiar localstorage
        localStorage.removeItem('token');
        localStorage.removeItem('allowed');

        // Limpiar permisos
        setAuth(false);
    }

    const data = { auth, login, logout, username }

    useEffect(() => {
        const cached = localStorage.getItem('allowed') === "1";
        console.log(cached, typeof(cached))
        setAuth(cached);
    }, [])

    return (
        <>
            <AuthContext.Provider value={data}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default AuthContext;
export {AuthProvider};