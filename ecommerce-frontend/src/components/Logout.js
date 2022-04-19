import React, { useContext } from "react";
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from "react-router";
import AuthContext from "../utils/Authentication/AuthContext";

export const Logout = ({show, setShow, setPerms}) => {

    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);

    const handleClose = async () => {
        logout();
        setShow(false);
        navigate('/');


    };


    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Ventana de confirmacion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Seguro que desea cerrar la sesion?</Modal.Body>
                <Modal.Footer>
                <button className="btn btn-secondary" onClick={(e) => setShow(false)}>
                    Close
                </button>
                <button className="btn btn-primary" onClick={handleClose}>
                    Logout
                </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};