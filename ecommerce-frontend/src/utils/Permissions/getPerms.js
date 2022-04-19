import { getLocalToken } from "../Authentication/token-auth"

const API = process.env.REACT_APP_API_SHOPPING_CART


// Comprueba los permisos del usuario contra el backend y retorna
// true | false segun el resultado de la consulta
export const getPerms = async () => {
    if (getLocalToken() === null) {console.log(false); return false};

    const req = await fetch(`${API}/carrocompras/validate-token/`, {
        'method' : 'POST',
        'mode' : 'cors',
        'headers' : {
            'Content-Type' : 'application/json',
        },
        'body' : JSON.stringify({
            'key' : getLocalToken(),
        })
    })
    
    const data = await req.json()

    console.log(data.is_valid)

    return data.is_valid
}