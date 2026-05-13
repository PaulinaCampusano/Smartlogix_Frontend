import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Gestion from './Gestion'
import * as api from '../services/api'

vi.mock('../services/api')

const mockProductos = [
  { id: 1, sku: 'LAP-01', nombre: 'Laptop', descripcion: 'Laptop básica', precio: 1000, stock: 5 },
]

const renderGestion = () =>
  render(
    <MemoryRouter>
      <Gestion />
    </MemoryRouter>
  )

const llenarFormulario = (datos = {}) => {
  const defaults = { sku: 'MON-01', nombre: 'Monitor', descripcion: 'Monitor HD', precio: '500', stock: '10' }
  const valores = { ...defaults, ...datos }

  fireEvent.change(screen.getByPlaceholderText('SKU (Ej: LAP-01)'), { target: { value: valores.sku } })
  fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: valores.nombre } })
  fireEvent.change(screen.getByPlaceholderText('Descripción'), { target: { value: valores.descripcion } })
  fireEvent.change(screen.getByPlaceholderText('Precio'), { target: { value: valores.precio } })
  fireEvent.change(screen.getByPlaceholderText('Stock'), { target: { value: valores.stock } })
}

describe('Gestion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getProductos.mockResolvedValue(mockProductos)
  })

  it('renderiza el título de Gestión de Inventario', () => {
    renderGestion()
    expect(screen.getByText(/Gestión de Inventario/i)).toBeInTheDocument()
  })

  it('carga y muestra los productos en la tabla', async () => {
    renderGestion()
    await waitFor(() => expect(screen.getByText('Laptop')).toBeInTheDocument())
    expect(screen.getByText('LAP-01')).toBeInTheDocument()
    expect(screen.getByText('$1000')).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay productos', async () => {
    api.getProductos.mockResolvedValue([])
    renderGestion()
    await waitFor(() =>
      expect(screen.getByText('No hay productos en el inventario.')).toBeInTheDocument()
    )
  })

  it('el botón de envío dice "Agregar Producto" por defecto', () => {
    renderGestion()
    expect(screen.getByRole('button', { name: 'Agregar Producto' })).toBeInTheDocument()
  })

  it('llama a crearProducto al enviar el formulario en modo creación', async () => {
    api.crearProducto.mockResolvedValue({ id: 2, sku: 'MON-01' })
    renderGestion()

    llenarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    await waitFor(() =>
      expect(api.crearProducto).toHaveBeenCalledWith(
        expect.objectContaining({ sku: 'MON-01', nombre: 'Monitor' })
      )
    )
  })

  it('limpia el formulario después de crear un producto', async () => {
    api.crearProducto.mockResolvedValue({ id: 2 })
    renderGestion()

    llenarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('SKU (Ej: LAP-01)')).toHaveValue('')
      expect(screen.getByPlaceholderText('Nombre')).toHaveValue('')
    })
  })

  it('entra en modo edición al hacer click en Editar', async () => {
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

    expect(screen.getByRole('button', { name: 'Actualizar Producto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('rellena el formulario con los datos del producto en modo edición', async () => {
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('Laptop')
    expect(screen.getByPlaceholderText('SKU (Ej: LAP-01)')).toHaveValue('LAP-01')
  })

  it('llama a actualizarProducto al guardar en modo edición', async () => {
    api.actualizarProducto.mockResolvedValue({})
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar Producto' }))

    await waitFor(() =>
      expect(api.actualizarProducto).toHaveBeenCalledWith(1, expect.any(Object))
    )
  })

  it('vuelve al modo creación al hacer click en Cancelar', async () => {
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
    expect(screen.getByRole('button', { name: 'Actualizar Producto' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('button', { name: 'Agregar Producto' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('cancela la edición y limpia el formulario', async () => {
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('')
    expect(screen.getByPlaceholderText('SKU (Ej: LAP-01)')).toHaveValue('')
  })

  it('llama a eliminarProducto al confirmar el borrado', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    api.eliminarProducto.mockResolvedValue()
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => expect(api.eliminarProducto).toHaveBeenCalledWith(1))
    vi.restoreAllMocks()
  })

  it('no elimina el producto si el usuario cancela el confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(api.eliminarProducto).not.toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('muestra alerta de SKU duplicado cuando la API retorna error 400', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    api.crearProducto.mockRejectedValue({ response: { status: 400 } })
    renderGestion()

    llenarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining('SKU')
      )
    )
    alertMock.mockRestore()
  })

  it('muestra alerta genérica para otros errores al guardar', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    api.crearProducto.mockRejectedValue(new Error('Error de servidor'))
    renderGestion()

    llenarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith('Hubo un error al guardar el producto.')
    )
    alertMock.mockRestore()
  })

  it('muestra badge rojo para productos con stock bajo (< 10)', async () => {
    renderGestion()
    await waitFor(() => screen.getByText('Laptop'))

    // stock=5, debe tener badge bg-danger
    const badgeStock = screen.getByText('5')
    expect(badgeStock).toHaveClass('bg-danger')
  })
})
