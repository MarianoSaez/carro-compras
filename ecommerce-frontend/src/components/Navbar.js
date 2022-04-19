import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { getLocalToken } from '../utils/Authentication/token-auth';
import AuthContext from "../utils/Authentication/AuthContext";

export const Navbar = () => {

	const [showLogout, setShowLogout] = useState(false);
	const [showLogin, setShowLogin] = useState(false);

	const {auth, username} = useContext(AuthContext);


	return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
		<div className="container-fluid">
			<Link className="navbar-brand" to="/">
				Tito's Store
			</Link>
			<button
				className="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarNavAltMarkup"
				aria-controls="navbarNavAltMarkup"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
				<div className="navbar-nav" style={{ display: 'flex', justifyContent: 'space-between', width: 100 + "%", paddingRight: '50px' }}>
					<div style={{ display: 'flex' }}>
						{/* Seccion con autenticacion */}
						{
							getLocalToken() === null ? (
								null
							) : (
								<>
									<Link className="nav-link" to="/shopping-cart">
										Carro <i className="fas fa-shopping-cart"></i>
									</Link>
								</>
							)
						}

						{/* Seccion con permisos */}
						{
							auth ?
								<>
									<Link className="nav-link" to="/admin">
										Panel de adminitrador <i class="fas fa-users-cog"></i>
									</Link>
								</> :
								null
						}
					</div>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						{
							getLocalToken() === null ?
								<>
									<button className="btn nav-link" onClick={(e) => setShowLogin(true)}>
										Login <i class="fas fa-sign-in-alt"></i>
									</button>
									<Login show={showLogin} setShow={setShowLogin}/>
								</> :
								<>
									<button className="btn nav-link" onClick={(e) => setShowLogout(true)}>
										Logout <i class="fas fa-sign-out-alt"></i>
									</button>
									<Logout show={showLogout} setShow={setShowLogout}/>
									<Link className="nav-link" to="/profile">
										{username} <i className="fas fa-user-circle"></i>
									</Link>

								</>
						}
					</div>
				</div>
			</div>
		</div>
	</nav>);
};
