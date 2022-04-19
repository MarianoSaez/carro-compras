import React, { useState, useEffect, } from "react"
import { useParams } from "react-router-dom"



const API = process.env.REACT_APP_API_PRODUCT

export const Producto = () => {

    //Recibe el parámetro de la ULR 'id'
    const {id} = useParams()
    const [prod, setProd] = useState({})

    useEffect(() => {
        getProduct();
    }, [])

    const getProduct = async () => {
        const listProducts = await fetch(`${API}/productos/get-product/${id}/`, 
        {'mode': 'cors', 
            'method': 'GET',
            'headers': {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',}
            })

        const data = await listProducts.json()
        // const result = await data.filter( d => d.id == idProd.id)
        setProd(data)

    }

    // cantidadVendido: 0
    // descripcion: "Salsa hecha a base de tomates"
    // distribuidor: 1
    // id: 2
    // nombre: "Salsa de Tomate"
    // precio: 49.99

    return(
        <div>
            <center>
                <h1>
                    {prod.nombre}
                </h1>
                <p>
                    {prod.descripcion}
                </p>
                <p>
                    Precio Unitario: ${prod.precio}
                </p>
                <p>
                    Distribuidor: {prod.distribuidor}
                </p>
            </center>
        </div>

    )
}