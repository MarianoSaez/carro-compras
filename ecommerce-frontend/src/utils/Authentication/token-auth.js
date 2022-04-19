// Wrapper para obtener el token de sesion del usuario
export const getLocalToken = () => {
    return localStorage.getItem('token');
}

