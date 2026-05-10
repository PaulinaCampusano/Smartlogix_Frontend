import axios from 'axios';

const BFF_URL = 'http://localhost:8088/api/bff';

// --- Funciones de Pedidos ---
export const getBoletaCompleta = async (idPedido) => {
    try {
        const response = await axios.get(`${BFF_URL}/boleta/${idPedido}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la boleta:", error);
        throw error;
    }
};

// --- Funciones de Inventario (Ahora pasan por el BFF) ---
export const getProductos = async () => {
    const response = await axios.get(`${BFF_URL}/productos`);
    return response.data;
};

export const crearProducto = async (producto) => {
    const response = await axios.post(`${BFF_URL}/productos`, producto);
    return response.data;
};

export const actualizarProducto = async (id, producto) => {
    const response = await axios.put(`${BFF_URL}/productos/${id}`, producto);
    return response.data;
};

export const eliminarProducto = async (id) => {
    await axios.delete(`${BFF_URL}/productos/${id}`);
};


export const getPedidos = async () => {
    const response = await axios.get(`${BFF_URL}/pedidos`);
    return response.data;
};

export const crearPedido = async (pedido) => {
    const response = await axios.post(`${BFF_URL}/pedidos`, pedido);
    return response.data;
};

export const actualizarPedido = async (id, pedido) => {
    await axios.put(`${BFF_URL}/pedidos/${id}`, pedido);
};

export const eliminarPedido = async (id) => {
    await axios.delete(`${BFF_URL}/pedidos/${id}`);
};