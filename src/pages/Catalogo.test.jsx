import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Catalogo from './Catalogo'
import * as api from '../services/api'

vi.mock('../services/api')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockProductos = [
  { id: 1, sku: 'LAP-01', nombre: 'Laptop', descripcion: 'Laptop básica', precio: 1000, stock: 5 },
  { id: 2, sku: 'MOU-01', nombre: 'Mouse', descripcion: 'Mouse inalámbrico', precio: 50, stock: 0 },
]

const renderCatalogo = () =>
  render(
    <MemoryRouter>
      <Catalogo />
    </MemoryRouter>
  )

describe('Catalogo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getProductos.mockResolvedValue(mockProductos)
  })

  it('muestra "Cargando productos..." mientras carga', () => {
    api.getProductos.mockReturnValue(new Promise(() => {}))
    renderCatalogo()
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
  })

  it('muestra los productos después de cargar', async () => {
    renderCatalogo()
    await waitFor(() => expect(screen.getByText('Laptop')).toBeInTheDocument())
    expect(screen.getByText('Mouse')).toBeInTheDocument()
  })

  it('muestra la descripción y SKU de los productos', async () => {
    renderCatalogo()
    await waitFor(() => expect(screen.getByText('Laptop básica')).toBeInTheDocument())
    expect(screen.getByText('SKU: LAP-01')).toBeInTheDocument()
  })

  it('muestra el precio de los productos', async () => {
    renderCatalogo()
    await waitFor(() => expect(screen.getByText('$1000')).toBeInTheDocument())
  })

  it('muestra botón "Agotado" deshabilitado para productos sin stock', async () => {
    renderCatalogo()
    await waitFor(() => {
      const btnAgotado = screen.getByText('Agotado')
      expect(btnAgotado).toBeInTheDocument()
      expect(btnAgotado).toBeDisabled()
    })
  })

  it('muestra el carrito vacío al inicio', async () => {
    renderCatalogo()
    await waitFor(() => expect(screen.getByText('El carrito está vacío')).toBeInTheDocument())
  })

  it('agrega un producto al carrito al hacer click en "Añadir al Carrito"', async () => {
    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByText('Añadir al Carrito'))

    expect(screen.queryByText('El carrito está vacío')).not.toBeInTheDocument()
  })

  it('muestra el nombre del producto en el carrito al agregarlo', async () => {
    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByText('Añadir al Carrito'))

    // El carrito muestra el nombre del producto
    const itemsCarrito = screen.getAllByText('Laptop')
    expect(itemsCarrito.length).toBeGreaterThan(1)
  })

  it('muestra el total correctamente al agregar un producto', async () => {
    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByText('Añadir al Carrito'))

    await waitFor(() => expect(screen.getByText('Total:')).toBeInTheDocument())
  })

  it('quita un producto del carrito al hacer click en X', async () => {
    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByText('Añadir al Carrito'))
    await waitFor(() => expect(screen.queryByText('El carrito está vacío')).not.toBeInTheDocument())

    fireEvent.click(screen.getByText('X'))

    await waitFor(() => expect(screen.getByText('El carrito está vacío')).toBeInTheDocument())
  })

  it('muestra alerta si la cantidad es 0 al agregar al carrito', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    const input = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.blur(input)

    fireEvent.click(screen.getByText('Añadir al Carrito'))

    expect(alertMock).toHaveBeenCalledWith('La cantidad debe ser mayor a 0')
    alertMock.mockRestore()
  })

  it('muestra alerta si la cantidad supera el stock disponible', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Producto con stock 1 para forzar exceso fácilmente
    api.getProductos.mockResolvedValue([
      { id: 1, sku: 'LAP-01', nombre: 'Laptop', descripcion: 'Desc', precio: 1000, stock: 1 },
    ])

    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    // Agregar al carrito (ocupa el 1 de stock)
    fireEvent.click(screen.getByText('Añadir al Carrito'))

    // Intentar agregar de nuevo (0 stock disponible)
    fireEvent.click(screen.getByText('Añadir al Carrito'))

    expect(alertMock).toHaveBeenCalled()
    alertMock.mockRestore()
  })

  it('el botón "Proceder al Pago" no aparece con el carrito vacío', async () => {
    renderCatalogo()
    await waitFor(() => screen.getByText('El carrito está vacío'))
    expect(screen.queryByText('Proceder al Pago')).not.toBeInTheDocument()
  })

  it('navega a la boleta tras procesar la compra', async () => {
    api.crearPedido.mockResolvedValue({ id: 42 })
    api.getProductos.mockResolvedValue(mockProductos)

    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByText('Añadir al Carrito'))
    await waitFor(() => screen.getByText('Proceder al Pago'))

    fireEvent.click(screen.getByText('Proceder al Pago'))

    await waitFor(() => expect(api.crearPedido).toHaveBeenCalled())
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/boleta/42'))
  })

  it('muestra alerta si la compra falla', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    api.crearPedido.mockRejectedValue(new Error('Error de red'))

    renderCatalogo()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByText('Añadir al Carrito'))
    await waitFor(() => screen.getByText('Proceder al Pago'))

    fireEvent.click(screen.getByText('Proceder al Pago'))

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Hubo un problema al procesar tu compra.')
    )
    alertMock.mockRestore()
  })
})
