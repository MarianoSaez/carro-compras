import React, { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { getLocalToken } from "../utils/Authentication/token-auth";

const API = process.env.REACT_APP_API_PRODUCT;

export const ProductModal = ({ show, setShow, pk, setProds, prods }) => {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [distribuidor, setDistribuidor] = useState("");
    const [cantidadVendido, setCantidadVendido] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [distribuidores, setDistribuidores] = useState([]);

    // const [isActive, setIsactive] = useState(true);

    // Wrapper - Determina la accion a realizar y llama a la funcion correspondiente
    const handleSubmit = (e) => {
        if (pk == 0) {
            createProd(e);
        } else {
            editProd(e);
        }
    };

    // Cargar datos del usuario a los campos
    const getProd = async () => {
        // Obtener usuario directamente desde la DB
        const req = await fetch(`${API}/productos/admin-prod/${pk}`, {
            "method": "GET",
            "mode": "cors",
            "headers": {
                "Authorization": `Token ${getLocalToken()}`,
            },
        });

        const producto = await req.json();

        console.log(producto)

        // Cargar atributos en los campos del fomulario
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion);
        setPrecio(producto.precio);
        setDistribuidor(producto.distribuidor);
        setCantidadVendido(producto.cantidadVendido);
        setIsActive(producto.is_active);
    };

    // Modificar usuario en la DB
    const editProd = async (e) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();

        let editedProd = {
            'id' : pk,
            nombre,
            descripcion,
            precio,
            distribuidor,
            cantidadVendido,
            'is_active' : isActive,
        }


        const req = await fetch(`${API}/productos/admin-prod/`, {
            'method' : 'PATCH',
            'mode' : 'cors',
            'headers' : {
                'Authorization' : `Token ${getLocalToken()}`,
                'Content-Type' : 'application/json',
            },
            'body' : JSON.stringify(editedProd)
        });

        const prod = await req.json();

        // Encontrar el indice del elemento en el array para el id dado
        const i = prods.findIndex(u => u.id === pk);
        
        // Manejar posible error
        if (i === -1) {
            console.error('El indice que se solicito no existe!')
            return;
        }

        // Setear el nuevo array - NECESARIO PARA RE-RENDERIZAR CAMBIOS
        setProds([
            ...prods.slice(0, i),
            prod.producto,
            ...prods.slice(i + 1)
        ]);

        // Ocultar modal
        setShow(false);
    };

    const createProd = async (e) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();


        const req = await fetch(`${API}/productos/admin-prod/`, {
            'method' : 'POST',
            'mode' : 'cors',
            'headers' : {
                'Content-Type' : 'application/json',
                'Authorization' : `Token ${getLocalToken()}`,
            },
            'body' : JSON.stringify({
                nombre,
                descripcion,
                precio,
                distribuidor,
                cantidadVendido,
                'is_active' : isActive,
            })
        });

        const newProd = await req.json();
        console.log(newProd)
        // Agregar nuevo usuario y re-renderizar la lista
        setProds([...prods, newProd.producto]);

        // Ocultar modal
        setShow(false);


    };

    const getDist = async() => {
        
        const req = await fetch(`${API}/productos/distribuidores/${0}`, {
            'method' : 'GET',
            'mode' : 'cors',
            'headers' : {
                'Authorization' : `Token ${getLocalToken()}`,
                'Content-Type' : 'application/json',
            }})
        const dists = await req.json()

        setDistribuidores(dists)
    }

    useEffect(() => {
        pk > 0 && getProd();
        getDist();
    }, [])

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} animation={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{pk > 0 ? "Editar producto" : "Crear Producto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Nombre</InputGroup.Text>
                            <FormControl
                                aria-label="Nombre"
                                aria-describedby="basic-addon1"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Descripcion</InputGroup.Text>
                            <FormControl aria-label="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Precio</InputGroup.Text>
                            <FormControl
                                aria-label="Precio"
                                aria-describedby="basic-addon1"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </InputGroup>                  

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Distribuidor</InputGroup.Text>
                            <Form.Select onChange={(e) => {setDistribuidor(e.target.value)}}>
                                <option>Seleccione un distribuidor</option>
                                {distribuidores.map(d => (
                                    <option value={d.id}>{d.nombre}</option>
                                ))}
                                </Form.Select>
                        </InputGroup>    

                        {/* <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Cantidad Vendido</InputGroup.Text>
                            <FormControl
                                aria-label="Cantidad Vendido"
                                aria-describedby="basic-addon1"
                                value={cantidadVendido}
                                onChange={(e) => setCantidadVendido(e.target.value)}
                            />
                        </InputGroup> */}

                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check label="Activo" checked={isActive} onChange={e => {setIsActive(e.target.checked)}}/>
                        </Form.Group>   

                    </>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={(e) => setShow(false)}>
                        Cerrar
                    </button>
                    <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}>
                        {pk == 0 ? "Crear" : "Actualizar"}
                    </button>
                </Modal.Footer>
            </Modal>

        </>
    );
}