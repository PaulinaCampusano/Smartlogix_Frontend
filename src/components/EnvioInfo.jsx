// Detalle de un despacho, reutilizado en la Boleta y en el Seguimiento.

const estadoInfo = {
    PREPARANDO: { badge: 'bg-secondary', icono: '📦', label: 'Preparando' },
    EN_RUTA: { badge: 'bg-info text-dark', icono: '🚚', label: 'En ruta' },
    ENTREGADO: { badge: 'bg-success', icono: '✅', label: 'Entregado' },
};

const formatoCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
        .format(n || 0);

export function EstadoEnvioBadge({ estado }) {
    const info = estadoInfo[estado] || { badge: 'bg-light text-dark', icono: '•', label: estado };
    return <span className={`badge ${info.badge} px-3 py-2`}>{info.icono} {info.label}</span>;
}

// Línea de progreso de la última milla
function ProgresoEnvio({ estado }) {
    const pasos = ['PREPARANDO', 'EN_RUTA', 'ENTREGADO'];
    const actual = pasos.indexOf(estado);
    return (
        <div className="d-flex justify-content-between align-items-center my-3">
            {pasos.map((p, i) => (
                <div key={p} className="d-flex align-items-center" style={{ flex: i < pasos.length - 1 ? 1 : '0 0 auto' }}>
                    <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${i <= actual ? 'bg-success text-white' : 'bg-light text-muted border'}`}
                        style={{ width: 28, height: 28, fontSize: 14 }}
                    >
                        {estadoInfo[p].icono}
                    </div>
                    {i < pasos.length - 1 && (
                        <div className="flex-grow-1 mx-1" style={{ height: 3, background: i < actual ? '#2e9e8f' : '#dee2e6' }} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function EnvioInfo({ envio }) {
    if (!envio) return null;
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-bold">🚚 Despacho</span>
                <EstadoEnvioBadge estado={envio.estado} />
            </div>
            <div className="card-body">
                <ProgresoEnvio estado={envio.estado} />
                <div className="row g-2 small">
                    <div className="col-6"><span className="text-muted">Transportista:</span> <strong>{envio.transportista}</strong></div>
                    <div className="col-6"><span className="text-muted">Seguimiento:</span> <code>{envio.numeroSeguimiento}</code></div>
                    <div className="col-6"><span className="text-muted">Región:</span> {envio.region}</div>
                    <div className="col-6"><span className="text-muted">Entrega estimada:</span> {envio.diasEstimados} día(s)</div>
                    <div className="col-6"><span className="text-muted">Costo de envío:</span> {formatoCLP(envio.costoEnvio)}</div>
                    {envio.pedidoId != null && (
                        <div className="col-6"><span className="text-muted">Pedido:</span> #{envio.pedidoId}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
