import React from "react";
import { Tab, Nav, Col, Row } from "react-bootstrap";
import { ClientReport } from "./ClientsReport";
import { DistributorManager } from "./DistributorManager";
import { SellingsReport } from "./SellingsReport";
import { UserManager } from "./UserManager";
import { ProductManager } from "./ProductManager";
import { DistributorReport } from "./DistributorReport";

export const Dashboard = () => {
	return (
		<>
			<Tab.Container id="left-tabs" defaultActiveKey="user-admin">
				<Row>
					<Col sm={2}>
						<Nav variant="pills" className="flex-column">
							<Nav.Item>
								<Nav.Link eventKey="Info" disabled>
									Administracion
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="user-admin">Usuarios</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="product-admin">Productos</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="distributor-admin">Distribuidores</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="Info" disabled>
									Reportes
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="client-report">Clientes</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="selling-report">Ventas</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="distributor-report">
									Informacion de Distribuidores
								</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>
					<Col sm={10}>
						<Tab.Content>
							<Tab.Pane eventKey="user-admin">
								<UserManager />
							</Tab.Pane>
							<Tab.Pane eventKey="product-admin">
								<ProductManager />
							</Tab.Pane>
							<Tab.Pane eventKey="distributor-admin">
								<DistributorManager />
							</Tab.Pane>
							<Tab.Pane eventKey="client-report">
								<ClientReport />
							</Tab.Pane>
							<Tab.Pane eventKey="selling-report">
								<SellingsReport />
							</Tab.Pane>
							<Tab.Pane eventKey="distributor-report">
								<DistributorReport />
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		</>
	);
};
