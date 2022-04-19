import React, { useEffect, useState } from "react";
import { getLocalToken } from '../utils/Authentication/token-auth';
import Accordion from 'react-bootstrap/Accordion';
import moment from 'moment/moment';


const API = process.env.REACT_APP_API_SHOPPING_CART

export const Profile = () => {

    const [ventas, setVentas] = useState([]);
    const [currVenta, setCurrVenta] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [categoria, setCategoria] = useState('');
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");

    const getUser = async () => {
        const result = await fetch(`${API}/carrocompras/user-profile/`, {
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const user = await result.json();

        setNombre(user.first_name);
        setApellido(user.last_name);
        setEmail(user.email);
        setCategoria(user.is_admin | user.is_staff ? "ADMINISTRADOR" : "USUARIO");
    };

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

    const editUser = async (e) => {
        e.preventDefault()
        await fetch(`${API}/carrocompras/user-profile/`, {
            'method': 'PATCH',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                "first_name": nombre,
                "last_name": apellido,
                email,
            })
        })

    };

    const editClient = async (e) => {
        e.preventDefault()
        await fetch(`${API}/carrocompras/client-profile/`, {
            'method': 'PATCH',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                direccion,
                telefono,
            })
        })

    };

    const getUserVentas = async () => {
        const result = await fetch(`${API}/carrocompras/user-sellings/`, {
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const data = await result.json();

        setVentas(data);

    };

    const getVenta = async (id) => {
        const result = await fetch(`${API}/carrocompras/user-selling-detail/${id}`, {
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            },
        });

        const data = await result.json();

        setCurrVenta(data);

    };

    useEffect(() => {
        getUser();
        getCliente();
        getUserVentas();
    }, [])


    return (
        <>
            <div className="row">
                {/* Datos del usuario */}
                <div className="col-md-6 col-lg-4 col-xl-4 col-sm-12">
                    <h2>Datos de usuario</h2>
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="form-group py-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        onChange={(e) => setNombre(e.target.value)}
                                        value={nombre}
                                        required
                                    >
                                    </input>
                                </div>
                                <div className="form-group py-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Apellido"
                                        onChange={(e) => setApellido(e.target.value)}
                                        value={apellido}
                                        required
                                    >
                                    </input>
                                </div>
                                <div className="form-group py-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                    >
                                    </input>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="staticEmail" className="col-sm col-form-label">Categoria : </label>
                                    <div className="col-8">
                                        <input type="text" readOnly className="form-control-plaintext" id="staticEmail" value={categoria.toUpperCase()}></input>
                                    </div>
                                </div>
                                <div className="form-group py-2">
                                    {
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-block text-white"
                                            onClick={(e) => editUser(e)}
                                        >
                                            Modificar
                                        </button>
                                    }

                                </div>

                            </form>
                        </div>
                    </div>

                    {
                        direccion !== "" & telefono !== "" ?
                        <>
                        <h2 style={{ marginTop: 10 + "px" }}>Datos de cliente</h2>
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
                                    {
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-block text-white"
                                            onClick={(e) => editClient(e)}
                                        >
                                            Modificar
                                        </button>
                                    }

                                </div>

                            </form>
                        </div>
                    </div>
                    </> :
                            null

                    }
                </div>

                {/* Historial de ventas */}
                <div className="col-md-6 col-lg-8 col-xl-8 col-sm-12">
                    <h2>Historial de ventas</h2>
                    <div className="table-responsive py-2">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                        </table>
                        <Accordion>
                            {ventas.map(v => (
                                <Accordion.Item eventKey={v.id}>
                                    <Accordion.Header onClick={(e) => getVenta(v.id)}>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-7">
                                                    {moment(v.fecha).format("LLL")}
                                                </div>
                                                <div className="col-4">
                                                    $ {v.total}
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Precio unitario</th>
                                                    <th>Cantidad</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currVenta.map(prod => (
                                                        <tr key={prod.id}>
                                                            <td>{prod.nombre}</td>
                                                            <td>{prod.precio}</td>
                                                            <td>{prod.cantidad}</td>
                                                            <td>{prod.precio * prod.cantidad}</td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>

                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                            }
                        </Accordion>
                    </div>
                </div>


            </div>
        </>
    );
};