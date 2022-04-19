import React, { useState, useEffect } from "react";
import { getLocalToken } from '../utils/Authentication/token-auth';
import { UserModal } from "./UserModal";


const API = process.env.REACT_APP_API_SHOPPING_CART


export const UserManager = () => {

	const [showModal, setShowModal] = useState(false);
	const [id, setId] = useState(0);


	const [users, setUsers] = useState([]);


	// Listar usuarios de la DB
	const getUsers = async () => {
		const res = await fetch(`${API}/carrocompras/admin/0`, {
			'mode': 'cors',
			'headers': {
				'Authorization': `Token ${getLocalToken()}`
			}
		});
		const data = await res.json();
		console.log(data)
		setUsers(data);
	};

	// Eliminar un usuario de la DB
	const deleteUser = async (pk) => {
		const userResponse = window.confirm("Are you sure you want to delete it?");
		if (userResponse) {
			const res = await fetch(`${API}/carrocompras/admin/`, {
				"method": "DELETE",
				"mode": "cors",
				"headers": {
					"Authorization": `Token ${getLocalToken()}`,
					"Content-Type": "application/json"
				},
				"body": JSON.stringify({
					"id": pk
				})
			});
			const data = await res.json();
			console.log(data);
			await getUsers();
		}
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<>
			{showModal ? <UserModal show={showModal} setShow={setShowModal} pk={id} setUsers={setUsers} users={users} /> : null}
			<div className="row">

				<div className="container">
					<button className="btn btn-success btn-block" onClick={(e) => { setId(0); setShowModal(true) }}>Agregar usuario</button>

					<table className="table table-striped">
						<thead>
							<tr>
								<th>Username</th>
								<th>Nombre y apellido</th>
								<th>Email</th>
								<th>Admin</th>
								<th>Activo</th>

								<th>Operations</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									<td>{user.username}</td>
									<td>{user.first_name} {user.last_name}</td>
									<td>{user.email}</td>
									<td>{user.is_admin | user.is_superuser ? "✔️" : "×"}</td>
									<td>{user.is_active ? "✔️" : "×"}</td>
									<td>
										<button
											className="btn btn-secondary btn-sm btn-block"
											onClick={(e) => {
												setId(user.id);
												setShowModal(true);
											}}
										>
											Edit
										</button>
										<button
											className="btn btn-danger btn-sm btn-block"
											onClick={(e) => deleteUser(user.id)}
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