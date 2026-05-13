import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  getBoletaCompleta,
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getPedidos,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
} from './api'

vi.mock('axios')

const BFF_URL = 'http://localhost:8088/api/bff'

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getBoletaCompleta', () => {
    it('retorna los datos de la boleta correctamente', async () => {
      const mockBoleta = { id: 1, cliente: 'Test', total: 5000 }
      axios.get.mockResolvedValue({ data: mockBoleta })

      const result = await getBoletaCompleta(1)

      expect(axios.get).toHaveBeenCalledWith(`${BFF_URL}/boleta/1`)
      expect(result).toEqual(mockBoleta)
    })

    it('lanza error cuando la petición falla', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'))

      await expect(getBoletaCompleta(1)).rejects.toThrow('Network Error')
    })
  })

  describe('getProductos', () => {
    it('retorna la lista de productos', async () => {
      const mockProductos = [{ id: 1, nombre: 'Laptop' }]
      axios.get.mockResolvedValue({ data: mockProductos })

      const result = await getProductos()

      expect(axios.get).toHaveBeenCalledWith(`${BFF_URL}/productos`)
      expect(result).toEqual(mockProductos)
    })
  })

  describe('crearProducto', () => {
    it('envía POST y retorna el producto creado', async () => {
      const nuevoProducto = { sku: 'LAP-01', nombre: 'Laptop', precio: 1000, stock: 10 }
      const productoCreado = { id: 1, ...nuevoProducto }
      axios.post.mockResolvedValue({ data: productoCreado })

      const result = await crearProducto(nuevoProducto)

      expect(axios.post).toHaveBeenCalledWith(`${BFF_URL}/productos`, nuevoProducto)
      expect(result).toEqual(productoCreado)
    })
  })

  describe('actualizarProducto', () => {
    it('envía PUT con el ID y datos correctos', async () => {
      const datosActualizados = { nombre: 'Laptop Pro', precio: 1500 }
      axios.put.mockResolvedValue({ data: datosActualizados })

      const result = await actualizarProducto(1, datosActualizados)

      expect(axios.put).toHaveBeenCalledWith(`${BFF_URL}/productos/1`, datosActualizados)
      expect(result).toEqual(datosActualizados)
    })
  })

  describe('eliminarProducto', () => {
    it('envía DELETE con el ID correcto', async () => {
      axios.delete.mockResolvedValue({})

      await eliminarProducto(1)

      expect(axios.delete).toHaveBeenCalledWith(`${BFF_URL}/productos/1`)
    })
  })

  describe('getPedidos', () => {
    it('retorna la lista de pedidos', async () => {
      const mockPedidos = [{ id: 1, cliente: 'Ana', total: 3000 }]
      axios.get.mockResolvedValue({ data: mockPedidos })

      const result = await getPedidos()

      expect(axios.get).toHaveBeenCalledWith(`${BFF_URL}/pedidos`)
      expect(result).toEqual(mockPedidos)
    })
  })

  describe('crearPedido', () => {
    it('envía POST y retorna el pedido creado', async () => {
      const nuevoPedido = { cliente: 'Cliente Web', items: [] }
      const pedidoCreado = { id: 5, ...nuevoPedido }
      axios.post.mockResolvedValue({ data: pedidoCreado })

      const result = await crearPedido(nuevoPedido)

      expect(axios.post).toHaveBeenCalledWith(`${BFF_URL}/pedidos`, nuevoPedido)
      expect(result).toEqual(pedidoCreado)
    })
  })

  describe('actualizarPedido', () => {
    it('envía PUT con el ID y datos del pedido', async () => {
      const datosPedido = { cliente: 'Juan', items: [] }
      axios.put.mockResolvedValue({})

      await actualizarPedido(3, datosPedido)

      expect(axios.put).toHaveBeenCalledWith(`${BFF_URL}/pedidos/3`, datosPedido)
    })
  })

  describe('eliminarPedido', () => {
    it('envía DELETE con el ID correcto', async () => {
      axios.delete.mockResolvedValue({})

      await eliminarPedido(2)

      expect(axios.delete).toHaveBeenCalledWith(`${BFF_URL}/pedidos/2`)
    })
  })
})
