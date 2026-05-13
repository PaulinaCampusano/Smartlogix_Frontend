import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Boleta from './Boleta'
import * as api from '../services/api'

vi.mock('../services/api')

const mockBoleta = {
  id: 42,
  idPedido: 42,
  cliente: 'María González',
  totalPedido: 3000,
  detalles: [
    { producto: 'Laptop', skuProducto: 'LAP-01', cantidad: 2, precioUnitario: 1000 },
    { producto: 'Mouse', skuProducto: 'MOU-01', cantidad: 10, precioUnitario: 50 },
  ],
}

const renderBoleta = (id = '42') =>
  render(
    <MemoryRouter initialEntries={[`/boleta/${id}`]}>
      <Routes>
        <Route path="/boleta/:id" element={<Boleta />} />
      </Routes>
    </MemoryRouter>
  )

describe('Boleta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra pantalla de carga mientras obtiene la boleta', () => {
    api.getBoletaCompleta.mockReturnValue(new Promise(() => {}))
    renderBoleta()
    expect(screen.getByText('Generando boleta...')).toBeInTheDocument()
  })

  it('muestra el mensaje de compra exitosa al cargar', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() =>
      expect(screen.getByText('¡Compra Exitosa! 🎉')).toBeInTheDocument()
    )
  })

  it('muestra el nombre del cliente', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() => expect(screen.getByText('María González')).toBeInTheDocument())
  })

  it('muestra el número de pedido', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() => expect(screen.getByText(/Pedido #42/i)).toBeInTheDocument())
  })

  it('muestra los productos de los detalles', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument()
      expect(screen.getByText('Mouse')).toBeInTheDocument()
    })
  })

  it('muestra las cantidades de cada detalle', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() => {
      expect(screen.getByText('Cantidad: 2')).toBeInTheDocument()
      expect(screen.getByText('Cantidad: 10')).toBeInTheDocument()
    })
  })

  it('muestra el total pagado', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() => expect(screen.getByText('$3000')).toBeInTheDocument())
  })

  it('muestra enlace para volver a la tienda', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta()
    await waitFor(() => {
      const enlace = screen.getByRole('link', { name: 'Volver a la Tienda' })
      expect(enlace).toBeInTheDocument()
      expect(enlace).toHaveAttribute('href', '/')
    })
  })

  it('llama a getBoletaCompleta con el ID extraído de la URL', async () => {
    api.getBoletaCompleta.mockResolvedValue(mockBoleta)
    renderBoleta('42')
    await waitFor(() => expect(api.getBoletaCompleta).toHaveBeenCalledWith('42'))
  })

  it('usa el campo total como fallback si totalPedido no existe', async () => {
    const boletaSinTotalPedido = { ...mockBoleta, totalPedido: undefined, total: 9999 }
    api.getBoletaCompleta.mockResolvedValue(boletaSinTotalPedido)
    renderBoleta()
    await waitFor(() => expect(screen.getByText('$9999')).toBeInTheDocument())
  })
})
