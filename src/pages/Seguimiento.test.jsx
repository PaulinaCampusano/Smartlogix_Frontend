import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Seguimiento from './Seguimiento'
import * as api from '../services/api'

vi.mock('../services/api')

const renderSeguimiento = () =>
  render(
    <MemoryRouter>
      <Seguimiento />
    </MemoryRouter>
  )

const envioMock = {
  id: 1,
  pedidoId: 5,
  transportista: 'CHILEXPRESS',
  region: 'METROPOLITANA',
  diasEstimados: 1,
  costoEnvio: 6390,
  estado: 'EN_RUTA',
  numeroSeguimiento: 'SLX-1A2B3C4D',
}

describe('Seguimiento', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el formulario de búsqueda', () => {
    renderSeguimiento()
    expect(screen.getByPlaceholderText(/SLX-/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument()
  })

  it('el botón Buscar está deshabilitado sin número', () => {
    renderSeguimiento()
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled()
  })

  it('muestra el detalle del envío cuando se encuentra', async () => {
    api.getEnvioPorSeguimiento.mockResolvedValue(envioMock)
    renderSeguimiento()

    fireEvent.change(screen.getByPlaceholderText(/SLX-/), { target: { value: 'SLX-1A2B3C4D' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    await waitFor(() => expect(screen.getByText('CHILEXPRESS')).toBeInTheDocument())
    expect(api.getEnvioPorSeguimiento).toHaveBeenCalledWith('SLX-1A2B3C4D')
    expect(screen.getByText('SLX-1A2B3C4D')).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no se encuentra el envío', async () => {
    api.getEnvioPorSeguimiento.mockRejectedValue(new Error('404'))
    renderSeguimiento()

    fireEvent.change(screen.getByPlaceholderText(/SLX-/), { target: { value: 'NO-EXISTE' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    await waitFor(() =>
      expect(screen.getByText(/No encontramos ningún envío/i)).toBeInTheDocument()
    )
  })
})
