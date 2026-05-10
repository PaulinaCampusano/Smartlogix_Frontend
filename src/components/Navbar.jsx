import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">SmartLogix</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Tienda</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin">Administración</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/gestionpedido">Gestion de Pedidos</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}