import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )

describe('Navbar', () => {
  it('renderiza el logo SmartLogix', () => {
    renderNavbar()
    expect(screen.getByText('SmartLogix')).toBeInTheDocument()
  })

  it('el logo enlaza a la ruta raíz', () => {
    renderNavbar()
    expect(screen.getByText('SmartLogix').closest('a')).toHaveAttribute('href', '/')
  })

  it('renderiza el enlace Tienda apuntando a /', () => {
    renderNavbar()
    const enlace = screen.getByRole('link', { name: 'Tienda' })
    expect(enlace).toBeInTheDocument()
    expect(enlace).toHaveAttribute('href', '/')
  })

  it('renderiza el enlace Administración apuntando a /admin', () => {
    renderNavbar()
    const enlace = screen.getByRole('link', { name: 'Administración' })
    expect(enlace).toBeInTheDocument()
    expect(enlace).toHaveAttribute('href', '/admin')
  })

  it('renderiza el enlace Gestion de Pedidos apuntando a /gestionpedido', () => {
    renderNavbar()
    const enlace = screen.getByRole('link', { name: 'Gestion de Pedidos' })
    expect(enlace).toBeInTheDocument()
    expect(enlace).toHaveAttribute('href', '/gestionpedido')
  })

  it('la barra de navegación tiene fondo oscuro', () => {
    renderNavbar()
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('navbar-dark', 'bg-dark')
  })
})
