import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import { getLocalToken } from '../utils/Authentication/token-auth';


const API = process.env.REACT_APP_API_SHOPPING_CART

export const ShoppingCart = ({items, setItems}) => {
    // Muestra los items alojados en el carro de compras
    const listShoppingCartItems = async () => {
        const token = getLocalToken();

        if (token !== null) {
            const result = await fetch(`${API}/carrocompras/list-shopping-cart/`, {
                    'mode': 'cors',
                    'headers' : {
                        'Authorization' : `Token ${token}`,
                    }
                });
            const data = await result.json();
            setItems(data);
        }
    }

    // Modificar cantidad de un producto del carrito
    const editShoppingCartItem = async (id, e) => {
        const newQuantity = e.target.value;

        // Encontrar el indice del elemento en el array para el id dado
        const i = items.findIndex(item => item.id === id);
        
        // Manejar posible error
        if (i === -1) {
            console.error('El indice que se solicito no existe!')
            return;
        }

        // Modificar el valor de cantidad con newQuantity
        items[i].cantidad = newQuantity;

        // Setear el nuevo array - NECESARIO PARA RE-RENDERIZAR SUBTOTALES
        setItems([
            ...items.slice(0, i),
            items[i],
            ...items.slice(i + 1)
        ]);

        // Enviar cambio al BACKEND
        const token = localStorage.getItem('token');
        await fetch(`${API}/carrocompras/review/`, {
            'method' : 'PATCH',
            'headers' : {
                'Authorization' : `Token ${token}`,
                'Content-Type' : 'application/json',
            },
            'mode' : 'cors',
            'body' : JSON.stringify({
                'pk' : id,
                'cantidad' : newQuantity,
            })
        });

    };

    // Vacia el carro de compras
    const cleanShoppingCart = async () => {
        await fetch(`${API}/carrocompras/clear-shopping-cart/` , {
            'method' : 'DELETE',
            'headers' : {
                'Authorization' : `Token ${getLocalToken()}`,
                'Content-Type' : 'application/json',
            },
            'mode' : 'cors',
        });

        await listShoppingCartItems();
    };

    // Elimina un item del carro de compras
    const deleteShoppingCartItem = async (pk) => {
        const respuesta = window.confirm("Desea eliminar este producto del carro?")
        const token = localStorage.getItem('token');

        if (respuesta) {
            await fetch(`${API}/carrocompras/review/`, {
                'mode' : 'cors',
                'method' : 'DELETE',
                'headers' : {
                    'Authorization' : `Token ${token}`,
                    'Content-Type' : 'application/json',
                },
                'body' : JSON.stringify({
                    "pk" : pk,
                })
            });


            // Refresca la lista en pantalla
            await listShoppingCartItems();
        }
    };

    useEffect(() => {
        listShoppingCartItems();
    });

    return (
        <>
        <div>
            <h2>Carrito de compras de Tito's Store</h2>
            <form>
                <table className="table table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio unitario</th>
                            <th className="cantidad-col">Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>    
                                <td>{item.nombre}</td>
                                <td>{item.precio}</td>
                                <td>
                                        <input
                                            type="number"
                                            defaultValue={item.cantidad}
                                            className="table-input"
                                            min="0"
                                            onChange={(e) => editShoppingCartItem(item.id, e)}
                                            >
                                        </input>
                                </td>
                                <td>{item.cantidad*item.precio}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={(e) => deleteShoppingCartItem(item.id, e)}
                                    >
                                            Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                        <Link className="btn btn-success btn-block" to={getLocalToken() === null ? "/login" : "/buy"}>
                            {getLocalToken() === null ? "Log In" : "Comprar"}
                        </Link>
                        <button className="btn btn-danger btn-block" onClick={(e) => cleanShoppingCart()}>
                            Vaciar carro de compras
                        </button>
                </div>
            </form>
        </div>
        </>
    );
};