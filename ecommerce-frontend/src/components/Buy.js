import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { getLocalToken } from '../utils/Authentication/token-auth';


const API = process.env.REACT_APP_API_SHOPPING_CART

export const Buy = ({items, setItems}) => {

    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    // Muestra los items alojados en el carro de compras
    const listShoppingCartItems = async () => {
        const token = getLocalToken();

        if (token !== null) {
            console.log(typeof(token))
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

    const getCliente = async () => {
        const result = await fetch(`${API}/carrocompras/client-profile/`, {
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const client = await result.json();

        setDireccion(client.direccion);
        setTelefono(client.telefono);
    }

    // Efectuar compra
    const confirmPurchase = async (e) => {
        e.preventDefault();
        const respuesta = window.confirm("Desea efectuar la compra?");
        const token = localStorage.getItem('token');

        if (token !== null && respuesta) {
            const result = await fetch(`${API}/carrocompras/payment-info/`, {
                'method' : 'POST',
                'headers' : {
                    'Authorization' : `Token ${token}`,
                    'Content-Type' : 'application/json',
                },
                'mode' : 'cors',
                'body' : JSON.stringify({
                    direccion,
                    telefono,
                })
            });

            const data = await result.json();

            console.log(data);

            await fetch(`${API}/carrocompras/clear-shopping-cart/` , {
                'method' : 'DELETE',
                'headers' : {
                    'Authorization' : `Token ${token}`,
                    'Content-Type' : 'application/json',
                },
                'mode' : 'cors',
            });

            setConfirmed(true);
        }
    };

    useEffect(() => {
        listShoppingCartItems();
        getCliente();
    }, [])

    return (
        <>
            <div className="row">

            <div className="col-md-6 col-lg-4 col-xl-4 col-sm-12">
                <h2>Datos personales</h2>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="form-group py-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Direccion"
                                    onChange={(e) => setDireccion(e.target.value)}
                                    value={direccion}
                                    required
                                    >
                                </input>
                            </div>
                            <div className="form-group py-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Telefono"
                                    onChange={(e) => setTelefono(e.target.value)}
                                    value={telefono}
                                    required
                                    >
                                </input>
                            </div>
                            <div className="form-group py-2">
                                {!confirmed ?
                                    <button 
                                        type="submit"
                                        className="btn btn-success btn-block text-white"
                                        onClick={(e) => confirmPurchase(e)}
                                        >
                                            Confirmar compra
                                    </button> :
                                    <Navigate to="/"/>
                                }
                                
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-8 col-xl-8 col-sm-12">
                <h2>Carro de compras</h2>
                <div className="table-responsive py-2">
                    <table className="table table-striped">
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
                                    <td>{item.cantidad}</td>
                                    <td>{item.cantidad*item.precio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <h3>
                            Total : $ {items.reduce((acc, item) => acc + item.cantidad*item.precio, 0)}
                        </h3>
                    </div>
                </div>
            </div>


            </div>
        </>
    );
};
