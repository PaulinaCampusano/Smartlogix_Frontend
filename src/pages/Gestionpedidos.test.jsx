import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GestionPedidos from './Gestionpedidos'
import * as api from '../services/api'

vi.mock('../services/api')

const mockPedidos = [
  {
    id: 1,
    cliente: 'Ana García',
    totalPedido: 2000,
    items: [{ skuProducto: 'LAP-01', cantidad: 2, precioUnitario: 1000 }],
  },
  {
    id: 2,
    cliente: 'Pedro López',
    totalPedido: 500,
    items: [{ skuProducto: 'MOU-01', cantidad: 10, precioUnitario: 50 }],
  },
]

const renderGestionPedidos = () =>
  render(
    <MemoryRouter>
      <GestionPedidos />
    </MemoryRouter>
  )

describe('GestionPedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getPedidos.mockResolvedValue(mockPedidos)
  })

  it('renderiza el título de Gestión de Pedidos', () => {
    renderGestionPedidos()
    expect(screen.getByText(/Gestión de Pedidos/i)).toBeInTheDocument()
  })

  it('carga y muestra los pedidos en la tabla', async () => {
    renderGestionPedidos()
    await waitFor(() => {
      expect(screen.getByText('Ana García')).toBeInTheDocument()
      expect(screen.getByText('Pedro López')).toBeInTheDocument()
    })
  })

  it('muestra el total de cada pedido', async () => {
    renderGestionPedidos()
    await waitFor(() => {
      expect(screen.getByText('$2000')).toBeInTheDocument()
      expect(screen.getByText('$500')).toBeInTheDocument()
    })
  })

  it('muestra los IDs de los pedidos', async () => {
    renderGestionPedidos()
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('abre el panel de edición al hacer click en Editar', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(screen.getByText(/Editar pedido #1/i)).toBeInTheDocument()
  })

  it('muestra los ítems del pedido en el panel de edición', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(screen.getByText('LAP-01')).toBeInTheDocument()
  })

  it('muestra el nombre del cliente en el campo de edición', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(screen.getByDisplayValue('Ana García')).toBeInTheDocument()
  })

  it('puede modificar la cantidad de un ítem en edición', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    const cantidadInput = screen.getByRole('spinbutton')
    fireEvent.change(cantidadInput, { target: { value: '5' } })

    expect(cantidadInput).toHaveValue(5)
  })

  it('puede eliminar un ítem del pedido en el panel de edición', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    expect(screen.getByText('LAP-01')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(screen.queryByText('LAP-01')).not.toBeInTheDocument()
    expect(screen.getByText('No hay productos asociados a este pedido.')).toBeInTheDocument()
  })

  it('llama a actualizarPedido al guardar cambios', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    api.actualizarPedido.mockResolvedValue()
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() =>
      expect(api.actualizarPedido).toHaveBeenCalledWith(1, expect.any(Object))
    )
    alertMock.mockRestore()
  })

  it('cierra el panel de edición al hacer click en X', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    expect(screen.getByText(/Editar pedido #1/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'X' }))

    expect(screen.queryByText(/Editar pedido #1/i)).not.toBeInTheDocument()
  })

  it('llama a eliminarPedido al confirmar el borrado', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    api.eliminarPedido.mockResolvedValue()
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Borrar' })[0])

    await waitFor(() => expect(api.eliminarPedido).toHaveBeenCalledWith(1))
    vi.restoreAllMocks()
  })

  it('no llama a eliminarPedido si el usuario cancela el confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Borrar' })[0])

    expect(api.eliminarPedido).not.toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('muestra botones Guardar y X en lugar de Editar/Borrar al editar', async () => {
    renderGestionPedidos()
    await waitFor(() => screen.getByText('Ana García'))

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    const fila = screen.getByText('Ana García').closest('tr')
    expect(fila.querySelector('button')).toHaveTextContent('Guardar')
  })
})
