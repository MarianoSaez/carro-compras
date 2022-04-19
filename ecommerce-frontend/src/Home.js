import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Navbar } from './components/Navbar';
import { ShoppingCart } from './components/ShoppingCart';
import { ListarProductos } from './components/ListaProducto';
import { Producto } from './components/Producto';
import { Buy } from './components/Buy';
import { RequireAuth } from './utils/Authentication/RequireAuth';
import { PermissionGate } from './utils/Permissions/PermissionGate'
import { Profile } from './components/Profile';
import { UserManager } from './components/UserManager';
import { DistributorManager } from './components/DistributorManager';
import { ProductManager } from './components/ProductManager';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './utils/Authentication/AuthContext';

// Codigo de la pagina de Home, que en este caso, coincide con
// la pagina de listado de productos de la DB
// Bruno Bonil -.
const Home = () => {

    const [items, setItems] = useState([]);

    return (
        <Router>

            {/* EL componente Navbar estara al tanto de los cambios de contexto de autenticacion */}
            <AuthProvider>
                <Navbar />

            <div className="container p-4">
                <Routes>
                    <Route path="/" element={<ListarProductos />}/>
                    <Route path="/producto/get-product/:id" element={<Producto />}/>
                    <Route path="/shopping-cart" element={<ShoppingCart items={items} setItems={setItems}/>}/>
                    <Route path="/buy" element={
                        <RequireAuth>
                            <Buy items={items} setItems={setItems} />
                        </RequireAuth>
                        } />
                    <Route path="/profile" element={
                        <RequireAuth>
                            <Profile />
                        </RequireAuth>
                        }/>
                        {/* PUBLICO!!!!! FALTA COMPONENTE QUE CONTROLE PERMISOS */}
                    <Route path="/admin" element={
                        <RequireAuth>
                            <PermissionGate>
                                <Dashboard />
                            </PermissionGate>
                        </RequireAuth>
                        }>
                    </Route>
                    <Route path="/productos-admin" element={
                        <RequireAuth>
                            <PermissionGate>
                                <ProductManager />
                            </PermissionGate>
                        </RequireAuth>
                        }>
                    </Route>
                </Routes>
            </div>
            </AuthProvider>


        </Router>
    )
};

export default Home;