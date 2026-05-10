import { useState, useEffect } from 'react';
import { getPedidos, actualizarPedido, eliminarPedido } from '../services/api';

export default function GestionPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [editando, setEditando] = useState(null); // Guarda el pedido que estamos editando

    useEffect(() => { cargarPedidos(); }, []);

    const cargarPedidos = async () => {
        const data = await getPedidos();
        setPedidos(data);
    };

    const manejarBorrar = async (id) => {
        if (window.confirm("¿Anular este pedido?")) {
            await eliminarPedido(id);
            cargarPedidos();
        }
    };

    const iniciarEdicion = (pedido) => {
        setEditando({ ...pedido, cliente: pedido.cliente || 'Cliente Web', items: pedido.items || [] });
    };

    const manejarCantidadItem = (index, nuevaCantidad) => {
        const itemsActualizados = editando.items.map((item, idx) => idx === index ? { ...item, cantidad: nuevaCantidad } : item);
        setEditando({ ...editando, items: itemsActualizados });
    };

    const manejarEliminarItem = (index) => {
        const itemsActualizados = editando.items.filter((_, idx) => idx !== index);
        setEditando({ ...editando, items: itemsActualizados });
    };

    const guardarCambios = async () => {
        try {
            await actualizarPedido(editando.id, editando);
            setEditando(null);
            cargarPedidos();
            alert("Pedido actualizado con éxito");
        } catch (error) {
            alert("Error al actualizar");
        }
    };

    return (
        <div className="container mt-4">
            <h2>📦 Gestión de Pedidos (Ventas)</h2>
            <div className="table-responsive mt-4">
                <table className="table table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.cliente || 'Cliente Web'}</td>
                                <td>${p.totalPedido || p.total || (p.items ? p.items.reduce((sum, item) => sum + ((item.precioUnitario || 0) * item.cantidad), 0) : 0)}</td>
                                <td>
                                    {editando?.id === p.id ? (
                                        <>
                                            <button onClick={guardarCambios} className="btn btn-sm btn-success me-2">Guardar</button>
                                            <button onClick={() => setEditando(null)} className="btn btn-sm btn-secondary">X</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => iniciarEdicion(p)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
                                            <button onClick={() => manejarBorrar(p.id)} className="btn btn-sm btn-outline-danger">Borrar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editando && (
                <div className="card shadow-sm border-info mt-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Editar pedido #{editando.id}</h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Cliente</label>
                            <input
                                className="form-control"
                                value={editando.cliente || ''}
                                onChange={(e) => setEditando({...editando, cliente: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <h6>Productos del pedido</h6>
                            {editando.items?.length > 0 ? (
                                editando.items.map((item, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <div className="flex-grow-1">
                                            <strong>{item.skuProducto}</strong>
                                            <div className="text-muted">Cantidad: </div>
                                        </div>
                                        <input
                                            type="number"
                                            className="form-control me-2"
                                            style={{ width: '100px' }}
                                            min="1"
                                            value={item.cantidad}
                                            onChange={(e) => manejarCantidadItem(index, Number(e.target.value))}
                                        />
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => manejarEliminarItem(index)}>
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No hay productos asociados a este pedido.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}