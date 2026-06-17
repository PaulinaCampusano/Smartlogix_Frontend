import { useState, useEffect } from 'react';
import { getEnvios, actualizarEstadoEnvio } from '../services/api';

// Flujo de estados de la última milla
const FLUJO = ['PREPARANDO', 'EN_RUTA', 'ENTREGADO'];

const estadoInfo = {
    PREPARANDO: { badge: 'bg-secondary', icono: '📦', label: 'Preparando' },
    EN_RUTA: { badge: 'bg-info text-dark', icono: '🚚', label: 'En ruta' },
    ENTREGADO: { badge: 'bg-success', icono: '✅', label: 'Entregado' },
};

function EstadoBadge({ estado }) {
    const info = estadoInfo[estado] || { badge: 'bg-light text-dark', icono: '•', label: estado };
    return <span className={`badge ${info.badge} px-3 py-2`}>{info.icono} {info.label}</span>;
}

const formatoCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
        .format(n || 0);

export default function GestionEnvios() {
    const [envios, setEnvios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => { cargarEnvios(); }, []);

    const cargarEnvios = async () => {
        try {
            setCargando(true);
            const data = await getEnvios();
            setEnvios(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando envíos', error);
            setEnvios([]);
        } finally {
            setCargando(false);
        }
    };

    const siguienteEstado = (estado) => {
        const i = FLUJO.indexOf(estado);
        return i >= 0 && i < FLUJO.length - 1 ? FLUJO[i + 1] : null;
    };

    const avanzarEstado = async (envio) => {
        const siguiente = siguienteEstado(envio.estado);
        if (!siguiente) return;
        try {
            await actualizarEstadoEnvio(envio.id, siguiente);
            cargarEnvios();
        } catch (error) {
            alert('No se pudo actualizar el estado del envío');
        }
    };

    const contar = (estado) => envios.filter((e) => e.estado === estado).length;

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h2 className="mb-0">🚚 Gestión de Envíos</h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={cargarEnvios}>↻ Actualizar</button>
            </div>
            <p className="text-muted">Trazabilidad de la última milla — seguimiento y avance de los despachos.</p>

            {/* Tarjetas resumen por estado */}
            <div className="row g-3 mb-4">
                {FLUJO.map((estado) => (
                    <div className="col-md-4" key={estado}>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body d-flex align-items-center">
                                <div className="display-6 me-3">{estadoInfo[estado].icono}</div>
                                <div>
                                    <div className="text-muted small text-uppercase">{estadoInfo[estado].label}</div>
                                    <div className="fs-3 fw-bold">{contar(estado)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {cargando ? (
                <div className="text-center my-5 text-muted">Cargando envíos…</div>
            ) : envios.length === 0 ? (
                <div className="alert alert-light border text-center">
                    No hay envíos registrados todavía. Genera un pedido en la tienda para crear su despacho.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle shadow-sm bg-white">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Transportista</th>
                                <th>Región</th>
                                <th>Costo</th>
                                <th>Plazo</th>
                                <th>Seguimiento</th>
                                <th>Estado</th>
                                <th className="text-end">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {envios.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td><span className="badge bg-light text-dark border">#{e.pedidoId}</span></td>
                                    <td>{e.cliente || 'Cliente Web'}</td>
                                    <td className="fw-semibold">{e.transportista}</td>
                                    <td>{e.region}</td>
                                    <td>{formatoCLP(e.costoEnvio)}</td>
                                    <td>{e.diasEstimados} día(s)</td>
                                    <td><code>{e.numeroSeguimiento}</code></td>
                                    <td><EstadoBadge estado={e.estado} /></td>
                                    <td className="text-end">
                                        {siguienteEstado(e.estado) ? (
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => avanzarEstado(e)}
                                            >
                                                Marcar {estadoInfo[siguienteEstado(e.estado)].label} →
                                            </button>
                                        ) : (
                                            <span className="text-success small">Finalizado</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
