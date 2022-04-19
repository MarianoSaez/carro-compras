import React, { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { getLocalToken } from "../utils/Authentication/token-auth";

const API = process.env.REACT_APP_API_SHOPPING_CART;

export const UserModal = ({ show, setShow, pk, setUsers, users }) => {

    const [username, setUsername] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [changePass, setChangePass] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isActive, setIsactive] = useState(true);

    // Wrapper - Determina la accion a realizar y llama a la funcion correspondiente
    const handleSubmit = (e) => {
        if (pk === 0) {
            createUser(e);
        } else {
            editUser(e);
        }
    };

    // Cargar datos del usuario a los campos
    const getUser = async () => {
        // Obtener usuario directamente desde la DB
        const req = await fetch(`${API}/carrocompras/admin/${pk}`, {
            "method": "GET",
            "mode": "cors",
            "headers": {
                "Authorization": `Token ${getLocalToken()}`,
            },
        });

        const user = await req.json();

        console.log(user)

        // Cargar atributos en los campos del fomulario
        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
        setIsAdmin(user.is_admin);
        setIsactive(user.is_active);
    };

    // Modificar usuario en la DB
    const editUser = async (e) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();

        let editedUser = {
            'id' : pk,
            username,
            first_name,
            last_name,
            email,
            'is_admin' : isAdmin,
            'is_active' : isActive,
        }

        if (changePass) editedUser = {...editedUser, password}

        const req = await fetch(`${API}/carrocompras/admin/`, {
            'method' : 'PATCH',
            'mode' : 'cors',
            'headers' : {
                'Authorization' : `Token ${getLocalToken()}`,
                'Content-Type' : 'application/json',
            },
            'body' : JSON.stringify(editedUser)
        });

        const user = await req.json();

        // Encontrar el indice del elemento en el array para el id dado
        const i = users.findIndex(u => u.id === pk);
        
        // Manejar posible error
        if (i === -1) {
            console.error('El indice que se solicito no existe!')
            return;
        }

        // Setear el nuevo array - NECESARIO PARA RE-RENDERIZAR CAMBIOS
        setUsers([
            ...users.slice(0, i),
            user.usuario,
            ...users.slice(i + 1)
        ]);

        // Ocultar modal
        setShow(false);
    };

    const createUser = async (e) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();


        const req = await fetch(`${API}/carrocompras/admin/`, {
            'method' : 'POST',
            'mode' : 'cors',
            'headers' : {
                'Content-Type' : 'application/json',
                'Authorization' : `Token ${getLocalToken()}`,
            },
            'body' : JSON.stringify({
                username,
                password,
                first_name,
                last_name,
                email,
                'is_admin' : isAdmin,
                'is_active' : isActive,
            })
        });

        const newUser = await req.json();

        // Agregar nuevo usuario y re-renderizar la lista
        setUsers([...users, newUser.usuario]);

        // Ocultar modal
        setShow(false);


    };

    useEffect(() => {
        pk > 0 && getUser();
    }, []);

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} animation={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{pk > 0 ? "Editar usuario" : "Crear Usuario"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <FormControl
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>Nombre</InputGroup.Text>
                            <FormControl aria-label="Nombre" value={first_name} onChange={e => setFirstName(e.target.value)} />
                            <InputGroup.Text>Apellido</InputGroup.Text>
                            <FormControl aria-label="Apellido" value={last_name} onChange={e => setLastName(e.target.value)} />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                            <FormControl
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>                 
                        {
                            pk > 0 &&
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check label="Modificar contraseña del usuario" onChange={e => {setChangePass(e.target.checked)}}/>
                            </Form.Group>
                        }                        

                        
                        <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Contraseña</InputGroup.Text>

                        {
                            changePass | pk === 0 ?
                                    <FormControl
                                        placeholder="Contraseña"
                                        aria-label="Contraseña"
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => setPassword(e.target.value)}
                                    /> :
                                    <FormControl
                                        placeholder="Contraseña"
                                        aria-label="Contraseña"
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled
                                    />
                        }

                        </InputGroup>
                        
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check label="Administrador" checked={isAdmin} onChange={e => {setIsAdmin(e.target.checked)}}/>
                        </Form.Group>                        
                        
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