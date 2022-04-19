import React, {useState, useEffect} from "react";
import { getLocalToken } from '../utils/Authentication/token-auth';
import { DistributorModal } from "./DistributorModal";


const API_PROD = process.env.REACT_APP_API_PRODUCT


export const DistributorManager = () => {

    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);
  
  
    const [dists, setDists] = useState([]);
  
  
    // Listar usuarios de la DB
    const getDists = async () => {
      const res = await fetch(`${API_PROD}/productos/distribuidores/0`, {
          'mode' : 'cors',
          'headers' : {
            'Authorization' : `Token ${getLocalToken()}`
          }
      });
      const data = await res.json();
      console.log(data)
      setDists(data);
    };

    // Eliminar un usuario de la DB
    const deleteDist = async (pk) => {
      const distResponse = window.confirm("Are you sure you want to delete it?");
      if (distResponse) {
        const res = await fetch(`${API_PROD}/productos/distribuidores/`, {
          "method": "DELETE",
          "mode" : "cors",
          "headers" : {
              "Content-Type" : "application/json"
          },
          "body" : JSON.stringify({
              "id" : pk
          })
        });
        const data = await res.json();
        console.log(data);
        await getDists();
      }
    };
   
    useEffect(() => {
      getDists();
    }, []);
  
    return (
      <>
        {showModal ? <DistributorModal show={showModal} setShow={setShowModal} pk={id} setDists={setDists} dists={dists}/> : null}
      <div className="row">
        <div className="">
          <button className="btn btn-success btn-block" onClick={(e) => {setId(0); setShowModal(true)}}>Agregar distribuidor</button>
        </div>
        <div className="">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Activo</th>

                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {dists.map((dist) => (
                <tr key={dist.id}>
                  <td>{dist.nombre}</td>
                  <td>{dist.descripcion}</td>
                  <td>{dist.is_active ? "✔️" : "×"}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm btn-block"
                      onClick={(e) => {
                        setId(dist.id);  
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-block"
                      onClick={(e) => deleteDist(dist.id)}
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