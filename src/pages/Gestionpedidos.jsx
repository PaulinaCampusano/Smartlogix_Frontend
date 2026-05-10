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
        setEditando({ ...pedido });
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
                                <td>
                                    {editando?.id === p.id ? (
                                        <input 
                                            className="form-control form-control-sm"
                                            value={editando.cliente}
                                            onChange={(e) => setEditando({...editando, cliente: e.target.value})}
                                        />
                                    ) : p.cliente}
                                </td>
                                <td>${p.totalPedido || p.total}</td>
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
        </div>
    );
}