import React, {useState, useEffect} from "react";
import { getLocalToken } from '../utils/Authentication/token-auth';
import { ProductModal } from "./ProductModal";


const API = process.env.REACT_APP_API_PRODUCT


export const ProductManager = () => {

    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);
  
  
    const [prods, setProds] = useState([]);
  
  
    // Listar usuarios de la DB
    const getProds = async () => {
      const res = await fetch(`${API}/productos/admin-prod/0`, {
          'mode' : 'cors',
          'headers' : {
              'Authorization' : `Token ${getLocalToken()}`
          }
      });
      const data = await res.json();
      console.log(data)
      setProds(data);
    };

    // Eliminar un usuario de la DB
    const deleteProd = async (pk) => {
      const UserResponse = window.confirm("Are you sure you want to delete it?");
      if (UserResponse) {
        const res = await fetch(`${API}/productos/admin-prod/`, {
          "method": "DELETE",
          "mode" : "cors",
          "headers" : {
              "Authorization" : `Token ${getLocalToken()}`,
              "Content-Type" : "application/json"
          },
          "body" : JSON.stringify({
              "id" : pk
          })
        });
        const data = await res.json();
        console.log(data);
        await getProds();
      }
    };
   
    useEffect(() => {
      getProds();
    }, []);
  
    return (
      <>
        {showModal ? <ProductModal show={showModal} setShow={setShowModal} pk={id} setProds={setProds} prods={prods}/> : null}
      <div className="row">
        <div className="">
          <button className="btn btn-success btn-block" onClick={(e) => {setId(0); setShowModal(true)}}>Agregar Producto</button>
        </div>
        <div className="">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Precio</th>
                <th>Distribuidor</th>
                <th>Cantidad Vendido</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {prods.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.precio}</td>
                  <td style={{textAlign:"center"}}>{p.distribuidor}</td>
                  <td>{p.cantidadVendido}</td>
                  <td>{p.is_active ? "✔️" : "×"}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm btn-block"
                      onClick={(e) => {
                        setId(p.id);  
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-block"
                      onClick={(e) => deleteProd(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
    );

};