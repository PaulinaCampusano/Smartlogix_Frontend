import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top sl-navbar">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
                    <span className="sl-logo">🚚</span>
                    <span>SmartLogix</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#slNav"
                    aria-controls="slNav"
                    aria-expanded="false"
                    aria-label="Abrir menú"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="slNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Tienda</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/seguimiento">Seguimiento</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin">Administración</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/gestionpedido">Gestion de Pedidos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/envios">Envíos</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
