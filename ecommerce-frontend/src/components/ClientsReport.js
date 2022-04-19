import React, { useState, useEffect } from "react";
import { getLocalToken } from "../utils/Authentication/token-auth";
import { Accordion } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
import moment from "moment";
import { Filter } from "./Filter";


const API = process.env.REACT_APP_API_SHOPPING_CART

export const ClientReport = () => {

    const [clientes, setClientes] = useState([]);
    const [currCliente, setCurrCliente] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [currVenta, setCurrVenta] = useState([]);

    const [lowerDate, setLowerDate] = useState("0");
    const [upperDate, setUpperDate] = useState("0");

    const getClients = async () => {
        const req = await fetch(`${API}/carrocompras/clients-report/`, {
            'method': 'GET',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const data = await req.json();

        setClientes(data);
    };

    const getClientVentas = async (id) => {
        const req = await fetch(`${API}/carrocompras/clients-report/sellings/${id}/${lowerDate}&${upperDate}`, {
            'method': 'GET',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const data = await req.json();

        console.log("\n\n\nNueva lista de ventas\n\n\n", data)


        setVentas(data);
    }

    const getVenta = async (id) => {
        const req = await fetch(`${API}/carrocompras/user-selling-detail/${id}`, {
            'method': 'GET',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const venta = await req.json();

        setCurrVenta(venta);
    };

    useEffect(() => {
        getClients();
    }, [])

    useEffect(() => {
        if (currCliente !== null) getClientVentas(currCliente.id);
    }, [lowerDate, upperDate])


    return (
        <>

            <div className="row">
                <Filter setLowerDate={setLowerDate} setUpperDate={setUpperDate} />
                {/* Listado de clientes */}
                <div className="col-md-5 col-lg-5 col-xl-5 col-sm-12">
                    <h2>Listado de Clientes</h2>
                    <div>
                        <div className="row" style={{ paddingBottom: 10 + 'px' }}>
                            <div className="col-4">
                                Username
                            </div>
                            <div className="col-6">
                                Nombre y apellido
                            </div>

                        </div>
                        <Accordion>
                            {clientes.map(c => (
                                <Accordion.Item eventKey={c.id}>
                                    <Accordion.Header onClick={(e) => {getClientVentas(c.id); setCurrCliente(c);}}>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-4">
                                                    {c.username}
                                                </div>
                                                <div className="col-4">
                                                    {`${c.first_name} ${c.last_name}`}
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                    <Form.Group>
                                        <Form.Label>Direccion</Form.Label>
                                        <Col>
                                            <Form.Control readOnly defaultValue={c.direccion}></Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Telefono</Form.Label>
                                        <Col>
                                            <Form.Control readOnly defaultValue={c.telefono}></Form.Control>
                                        </Col>
                                    </Form.Group>

                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                            }
                        </Accordion>
                    </div>
                </div>

                {/* Historial de ventas */}
                <div className="col-md-7 col-lg-7 col-xl-7 col-sm-12">
                    <h2>Ventas del cliente</h2>
                    <div>
                        <div className="row" style={{ paddingBottom: 10 + 'px' }}>
                            <div className="col-6">
                                Fecha
                            </div>
                            <div className="col-6">
                                Total
                            </div>

                        </div>
                        <Accordion>
                            {ventas.map(v => (
                                <Accordion.Item eventKey={v.id}>
                                    <Accordion.Header onClick={(e) => getVenta(v.id)}>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-6">
                                                    {moment(v.fecha).format("LLL")}
                                                </div>
                                                <div className="col-3" style={{ paddingLeft: 2 + 'rem' }}>
                                                    $ {v.total}
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='container'>
                                        </div>
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