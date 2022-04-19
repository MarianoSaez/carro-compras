import React, { useState, useEffect } from "react";
import { getLocalToken } from "../utils/Authentication/token-auth";
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Col from "react-bootstrap/esm/Col";
import moment from 'moment/moment';
import { Filter } from "./Filter";


const API = process.env.REACT_APP_API_SHOPPING_CART


export const SellingsReport = () => {

    const [ventas, setVentas] = useState([]);
    const [currVenta, setCurrVenta] = useState([]);

    // Estados de fechas bajo useEffect
    const [lowerDate, setLowerDate] = useState("0");
    const [upperDate, setUpperDate] = useState("0");


    const getVentas = async () => {
        const req = await fetch(`${API}/carrocompras/sellings-report/0/${lowerDate}&${upperDate}`, {
            'method': 'GET',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`
            }
        });

        const reporte = await req.json();

        setVentas(reporte);

    };

    const getVenta = async (id) => {
        const req = await fetch(`${API}/carrocompras/user-selling-detail/${id}`, {
            'method': 'GET',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const venta = await req.json()

        console.log(venta)

        setCurrVenta(venta);
    };

    useEffect(() => {
        getVentas();
    }, [lowerDate, upperDate])

    return (
        <>
            <div className="row">

                <Filter setLowerDate={setLowerDate} setUpperDate={setUpperDate} />
                
                <div className="container">

                    <div className="row" style={{ paddingBottom: 10 + 'px' }}>
                        <div className="col-6">
                            Fecha
                        </div>
                        <div className="col-3">
                            Total
                        </div>
                        <div className="col-3">
                            Username
                        </div>
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
                                        <div className="col-3" style={{ paddingLeft: 3 + 'rem' }}>
                                            {v.username}
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className='container'>
                                    <h5>Informacion de compra</h5>
                                    <Form.Group>
                                        <Form.Label>Nombre y apellido</Form.Label>
                                        <Col>
                                            <Form.Control readOnly defaultValue={`${v.first_name} ${v.last_name}`}></Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Direccion</Form.Label>
                                        <Col>
                                            <Form.Control readOnly defaultValue={v.direccion}></Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Telefono</Form.Label>
                                        <Col>
                                            <Form.Control readOnly defaultValue={v.telefono}></Form.Control>
                                        </Col>
                                    </Form.Group>

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
        </>
    );

};

