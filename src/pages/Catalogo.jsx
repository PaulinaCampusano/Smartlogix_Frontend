import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos, crearPedido } from '../services/api';

export default function Catalogo() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [cantidades, setCantidades] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const data = await getProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error cargando el catálogo", error);
        }
    };

    const agregarAlCarrito = (producto, cantidad = 1) => {
        if (cantidad <= 0) {
            alert("La cantidad debe ser mayor a 0");
            return;
        }
        const itemExistente = carrito.find(item => item.productoId === producto.id);
        const cantidadEnCarrito = itemExistente ? itemExistente.cantidad : 0;
        const nuevaCantidadTotal = cantidadEnCarrito + cantidad;

        if (nuevaCantidadTotal > producto.stock) {
            alert(`No hay suficiente stock. Disponible: ${producto.stock}, en carrito: ${cantidadEnCarrito}`);
            return;
        }
        
        if (itemExistente) {
            setCarrito(carrito.map(item => 
                item.productoId === producto.id 
                    ? { ...item, cantidad: item.cantidad + cantidad } 
                    : item
            ));
        } else {
            setCarrito([...carrito, { 
                productoId: producto.id, 
                sku: producto.sku,
                nombre: producto.nombre, 
                precioUnitario: producto.precio, 
                cantidad: cantidad 
            }]);
        }
    };

    const quitarDelCarrito = (productoId) => {
        setCarrito(carrito.filter(item => item.productoId !== productoId));
    };

    const totalCarrito = carrito.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);

    const procesarCompra = async () => {
        if (carrito.length === 0) return;

        const nuevoPedido = {
            cliente: "Cliente Web",
            items: carrito.map(item => ({
                skuProducto: item.sku,
                cantidad: item.cantidad
            }))
        };

        try {
            const pedidoCreado = await crearPedido(nuevoPedido);
            await cargarProductos();
            setCarrito([]);
            navigate(`/boleta/${pedidoCreado.id}`);
        } catch (error) {
            console.error("Error procesando la compra", error);
            alert("Hubo un problema al procesar tu compra.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">🛒 Tienda SmartLogix</h2>
            
            <div className="row">
                {/* LISTA DE PRODUCTOS */}
                <div className="col-md-8">
                    <div className="row">
                        {productos.length === 0 ? (
                            <p>Cargando productos...</p>
                        ) : (
                            productos.map((prod) => (
                                <div className="col-md-6 mb-4" key={prod.id}>
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title fw-bold mb-0">{prod.nombre}</h5>
                                                <span className="badge bg-primary fs-6">${prod.precio}</span>
                                            </div>
                                            <p className="text-muted small mb-2">SKU: {prod.sku}</p>
                                            <p className="card-text flex-grow-1">{prod.descripcion}</p>
                                            
                                            <div className="d-flex align-items-center mt-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary" 
                                                    onClick={() => setCantidades({...cantidades, [prod.id]: (cantidades[prod.id] || 1) - 1})} 
                                                    disabled={(cantidades[prod.id] || 1) <= 0}
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type="number" 
                                                    className="form-control form-control-sm mx-2" 
                                                    style={{width: '60px'}} 
                                                    value={cantidades[prod.id] || 1} 
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setCantidades({...cantidades, [prod.id]: value});
                                                    }}
                                                    onBlur={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (isNaN(value) || value < 0) {
                                                            setCantidades({...cantidades, [prod.id]: 0});
                                                        } else if (value > prod.stock) {
                                                            setCantidades({...cantidades, [prod.id]: prod.stock});
                                                        } else {
                                                            setCantidades({...cantidades, [prod.id]: value});
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary" 
                                                    onClick={() => setCantidades({...cantidades, [prod.id]: (cantidades[prod.id] || 1) + 1})} 
                                                    disabled={(cantidades[prod.id] || 1) >= prod.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <button 
                                                className="btn btn-outline-primary mt-auto"
                                                onClick={() => agregarAlCarrito(prod, cantidades[prod.id] || 1)}
                                                disabled={prod.stock <= 0}
                                            >
                                                {prod.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RESUMEN DEL CARRITO */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-primary sticky-top" style={{ top: '20px' }}>
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Tu Pedido</h5>
                        </div>
                        <div className="card-body">
                            {carrito.length === 0 ? (
                                <p className="text-muted text-center my-4">El carrito está vacío</p>
                            ) : (
                                <>
                                    <ul className="list-group list-group-flush mb-3">
                                        {carrito.map((item, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                <div>
                                                    <h6 className="my-0">{item.nombre}</h6>
                                                    <small className="text-muted">Cant: {item.cantidad} x ${item.precioUnitario}</small>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="fw-bold me-3">${item.precioUnitario * item.cantidad}</span>
                                                    <button onClick={() => quitarDelCarrito(item.productoId)} className="btn btn-sm btn-danger py-0 px-2">X</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-3">
                                        <h5 className="fw-bold">Total:</h5>
                                        <h5 className="fw-bold text-success">${totalCarrito}</h5>
                                    </div>
                                    <button className="btn btn-success w-100 fw-bold" onClick={procesarCompra}>
                                        Proceder al Pago
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}