import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBoletaCompleta } from '../services/api';

export default function Boleta() {
    const { id } = useParams(); // Extrae el ID de la URL
    const [boleta, setBoleta] = useState(null);

    useEffect(() => {
        const cargarBoleta = async () => {
            try {
                const data = await getBoletaCompleta(id);
                setBoleta(data);
            } catch (error) {
                console.error("Error cargando la boleta", error);
            }
        };
        cargarBoleta();
    }, [id]);

    if (!boleta) return <div className="container mt-5 text-center"><h5>Generando boleta...</h5></div>;

    return (
        <div className="container mt-5">
            <div className="card shadow border-0 mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-header bg-success text-white text-center py-3">
                    <h3 className="mb-0">¡Compra Exitosa! 🎉</h3>
                </div>
                <div className="card-body p-4">
                    <h5 className="text-muted mb-4">Pedido #{boleta.id}</h5>
                    <p><strong>Cliente:</strong> {boleta.cliente}</p>
                    
                    <ul className="list-group mb-4">
                        {boleta.detalles?.map((detalle, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">{detalle.productoNombre || `Producto ID: ${detalle.productoId}`}</h6>
                                    <small className="text-muted">Cantidad: {detalle.cantidad}</small>
                                </div>
                                <span className="fw-bold">${detalle.precioUnitario || detalle.precio}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="d-flex justify-content-between border-top pt-3">
                        <h4 className="fw-bold">Total Pagado:</h4>
                        <h4 className="fw-bold text-success">${boleta.totalPedido || boleta.total}</h4>
                    </div>
                </div>
                <div className="card-footer bg-light text-center py-3">
                    <Link to="/" className="btn btn-outline-primary">Volver a la Tienda</Link>
                </div>
            </div>
        </div>
    );
}