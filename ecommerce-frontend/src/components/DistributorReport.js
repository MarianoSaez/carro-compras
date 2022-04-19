import React, { useState, useEffect } from "react";
import { getLocalToken } from "../utils/Authentication/token-auth";
import { Accordion } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";



const API = process.env.REACT_APP_API_PRODUCT

export const DistributorReport = () => {

    const [distribuidor, setDistribuidor] = useState([]);
    
    const getDistribuidores = async () => {
        const req = await fetch(`${API}/productos/distribuidor-report/`, {
            'method': 'GET',
            'mode': 'cors',
            'headers': {
                'Authorization': `Token ${getLocalToken()}`,
            }
        });

        const data = await req.json();
        setDistribuidor(data);
    };

    useEffect(() => {
        getDistribuidores();
    }, [])



    return (
        <>
            <div className="row">
                <div className="col-md-5 col-lg-5 col-xl-10 col-sm-12">
                    <h2>Listado de Distribuidores</h2>
                    <div>
                        <div className="row" style={{ paddingBottom: 10 + 'px' }}>

                        </div>
                        <Accordion>
                            {distribuidor.map(d => (
                                <Accordion.Item eventKey={d.distribuidor.id}>
                                    <Accordion.Header>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-4">
                                                    {d['distribuidor']['nombre']}
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                    {d.productos.map(p => (
                                        <Form.Group>
                                            <Form.Label>{p.nombre}</Form.Label>
                                        </Form.Group>
                                    ))}

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