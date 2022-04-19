import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';

const API = process.env.REACT_APP_API_PRODUCT
const API2 = process.env.REACT_APP_API_SHOPPING_CART
export const ListarProductos = () => {

    const [lista, setLista] = useState([])
    const [cantidad, setCantidad] = useState(0)

    useEffect(() => {
        getProduct();
    }, [])

    const getProduct = async () => {
        const listProducts = await fetch(`${API}/productos/`, {'mode': 'cors'});
        const data = await listProducts.json()
        setLista(data)
    }

    const getCantidad = async (e) => {
        e.preventDefault()
        setCantidad(e.target.value)
    }

    const addProduct = async (prod) => {
        const res = await fetch(`${API2}/carrocompras/add-product/`, {
            'mode': 'cors', 
            'method': 'POST',
            'headers': {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',},
            'body': JSON.stringify({
                'nombre': prod.nombre,
                'descripcion': prod.descripcion,
                'id_prodOriginal': prod.id,
                'precio': prod.precio,
                'cantidad': cantidad
            })});
        const data = await res.json();
    }

    return(
        <div className="col md-6">
            <h2 style={{textAlign:"center"}}>Listado de Productos de Tito's Store</h2>

                <div className="grid-container">
                    {lista.map(l => (
                        <div className="grid-item">                            
                            <Card className='text-center' style={{ width: '25rem', borderColor: 'grey' }}>
                                <Card.Body>
                                    <Link to={`/producto/get-product/${l.id}`}>
                                    <Card.Title>{l.nombre}</Card.Title>
                                    </Link>
                                    <Card.Text>
                                    Precio: ${l.precio}

                                    <div>
                                    <input type='number' 
                                    className='cantidad-col'
                                    defaultValue='0'
                                    min='0'
                                    onChange={(e)=>getCantidad(e)}
                                    style={{width: "3.5rem"}}>
                                    </input>
                                    </div>
                                    
                                    </Card.Text>
                                    <Card.Footer style={{height:'3.2rem'}}>
                                    <button 
                                    style={{borderRadius:"5px"}}
                                    className="btn btn-success" 
                                    onClick={() => addProduct(l)}>
                                    Agregar
                                    </button> 
                                    </Card.Footer>
                                </Card.Body>
                            </Card>
                        </div>                     
                    ))}
                </div>
        </div>
    )}
