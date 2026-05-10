
import { useState, useEffect } from 'react';
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from '../services/api';

export default function Gestion() {
    const [productos, setProductos] = useState([]);
    const [formulario, setFormulario] = useState({ id: '', sku: '', nombre: '', descripcion: '', precio: '', stock: '' });
    const [modoEdicion, setModoEdicion] = useState(false);

    // Cargar productos al entrar a la página
    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const data = await getProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error cargando productos", error);
        }
    };

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const guardarProducto = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        try {
            if (modoEdicion) {
                // Actualizamos pasando el ID y los datos del formulario
                await actualizarProducto(formulario.id, formulario);
            } else {
                // Creamos un nuevo producto
                await crearProducto(formulario);
            }
            // Limpiamos el formulario y recargamos la tabla
            setFormulario({ id: '', sku: '', nombre: '', descripcion: '', precio: '', stock: '' });
            setModoEdicion(false);
            cargarProductos(); 
        } catch (error) {
            console.error("Error guardando producto", error);
            alert("Hubo un error al guardar el producto.");
        }
    };

    const editar = (prod) => {
        setFormulario(prod);
        setModoEdicion(true);
    };

    const borrar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                await eliminarProducto(id);
                cargarProductos();
            } catch (error) {
                console.error("Error al eliminar", error);
                alert("No se pudo eliminar el producto.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">⚙️ Gestión de Inventario</h2>

            {/* Formulario */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <form onSubmit={guardarProducto} className="row g-3">
                        <div className="col-md-2">
                            <input type="text" name="sku" value={formulario.sku} onChange={manejarCambio} className="form-control" placeholder="SKU (Ej: LAP-01)" required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="nombre" value={formulario.nombre} onChange={manejarCambio} className="form-control" placeholder="Nombre" required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="descripcion" value={formulario.descripcion} onChange={manejarCambio} className="form-control" placeholder="Descripción" required />
                        </div>
                        <div className="col-md-2">
                            <input type="number" name="precio" value={formulario.precio} onChange={manejarCambio} className="form-control" placeholder="Precio" required />
                        </div>
                        <div className="col-md-2">
                            <input type="number" name="stock" value={formulario.stock} onChange={manejarCambio} className="form-control" placeholder="Stock" required />
                        </div>
                        <div className="col-12 text-end">
                            {modoEdicion && (
                                <button type="button" className="btn btn-secondary me-2" onClick={() => { setModoEdicion(false); setFormulario({ id: '', sku: '', nombre: '', descripcion: '', precio: '', stock: '' }); }}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className={modoEdicion ? "btn btn-warning" : "btn btn-primary"}>
                                {modoEdicion ? "Actualizar Producto" : "Agregar Producto"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <div className="table-responsive shadow-sm">
                <table className="table table-hover table-bordered mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>SKU</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-4">No hay productos en el inventario.</td></tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td><span className="badge bg-secondary">{prod.sku}</span></td>
                                    <td>{prod.nombre}</td>
                                    <td>{prod.descripcion}</td>
                                    <td>${prod.precio}</td>
                                    <td>
                                        <span className={`badge ${prod.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                                            {prod.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => editar(prod)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
                                        <button onClick={() => borrar(prod.id)} className="btn btn-sm btn-outline-danger">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}