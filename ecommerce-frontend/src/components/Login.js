import React, { useContext, useState } from "react"
import { useNavigate } from "react-router";
import Modal from 'react-bootstrap/Modal';
import AuthContext from "../utils/Authentication/AuthContext";


export const Login = ({show, setShow, setPerms}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login, auth} = useContext(AuthContext);

    const handleLogin = async (e, username, password) => {
        // IMPORTANTE - Prevenir comportamiento por defecto (refrescar la pagina)
        e.preventDefault();
        
        login(username, password)

        // Limpiar input's
        setUsername('');
        setPassword('');

        // Esconder modal
        setShow(false);

        // Redirigir al home
        navigate('/');
    };

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                Username
                            </label>
                            <input onChange={(e) => {setUsername(e.target.value)}} value={username} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                Password
                            </label>
                            <input onChange={(e) => {setPassword(e.target.value)}} value={password} type="password" className="form-control" id="exampleInputPassword1"></input>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <button className="btn btn-secondary" onClick={(e) => setShow(false)}>
                    Close
                </button>
                <button className="btn btn-primary" onClick={(e) => handleLogin(e, username, password)}>
                    Login
                </button>
                </Modal.Footer>
            </Modal>
            
        </>
    );
}