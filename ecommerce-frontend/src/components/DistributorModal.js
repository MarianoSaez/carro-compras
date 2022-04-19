import React, { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { getLocalToken } from "../utils/Authentication/token-auth";

const API = process.env.REACT_APP_API_PRODUCT;

export const DistributorModal = ({ show, setShow, pk, setDists, dists }) => {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [isActive, setIsactive] = useState(true);

    // Wrapper - Determina la accion a realizar y llama a la funcion correspondiente
    const handleSubmit = (e) => {
        if (pk === 0) {
            createDist(e);
        } else {
            editUser(e);
        }
    };

    // Cargar datos del distribuidor a los campos
    const getDist = async () => {
        // Obtener distribuidor directamente desde la DB
        const req = await fetch(`${API}/productos/distribuidores/${pk}`, {
            "method": "GET",
            "mode": "cors",
            "headers": {
                "Authorization" : `Token ${getLocalToken()}`
            },
        });

        const dist = await req.json();

        console.log(dist)

        // Cargar atributos en los campos del fomulario
        setNombre(dist.nombre);
        setDescripcion(dist.descripcion);

    };

    // Modificar distribuidor en la DB
    const editUser = async (e) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();

        let editedDist = {
            'id' : pk,
            nombre,
            descripcion,
            'is_active' : isActive,
        }

        const req = await fetch(`${API}/productos/distribuidores/`, {
            'method' : 'PATCH',
            'mode' : 'cors',
            'headers' : {
                'Content-Type' : 'application/json',
                "Authorization" : `Token ${getLocalToken()}`
            },
            'body' : JSON.stringify(editedDist)
        });

        const dist = await req.json();

        // Encontrar el indice del elemento en el array para el id dado
        const i = dists.findIndex(u => u.id === pk);
        
        // Manejar posible error
        if (i === -1) {
            console.error('El indice que se solicito no existe!')
            return;
        }

        // Setear el nuevo array - NECESARIO PARA RE-RENDERIZAR CAMBIOS
        setDists([
            ...dists.slice(0, i),
            dist.result,
            ...dists.slice(i + 1)
        ]);

        // Ocultar modal
        setShow(false);
    };

    const createDist = async (e) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();


        const req = await fetch(`${API}/productos/distribuidores/`, {
            'method' : 'POST',
            'mode' : 'cors',
            'headers' : {
                'Content-Type' : 'application/json',
                "Authorization" : `Token ${getLocalToken()}`
            },
            'body' : JSON.stringify({
                nombre,
                descripcion,
                'is_active' : isActive,
            })
        });

        const newDist = await req.json();

        // Agregar nuevo distribuidor y re-renderizar la lista
        setDists([...dists, newDist.result]);

        // Ocultar modal
        setShow(false);


    };

    useEffect(() => {
        pk > 0 && getDist();
    })

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} animation={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{pk > 0 ? "Editar distribuidor" : "Crear distribuidor"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Nombre</InputGroup.Text>
                            <FormControl
                                placeholder="Nombre"
                                aria-label="Nombre"
                                aria-describedby="basic-addon1"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Descripcion</InputGroup.Text>
                            <FormControl as="textarea" aria-label="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        </InputGroup>
              

                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check label="Activo" checked={isActive} onChange={e => {setIsactive(e.target.checked)}}/>
                        </Form.Group>   


                    </>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={(e) => setShow(false)}>
                        Cerrar
                    </button>
                    <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
                        {pk === 0 ? "Crear" : "Actualizar"}
                    </button>
                </Modal.Footer>
            </Modal>

        </>
    );
}