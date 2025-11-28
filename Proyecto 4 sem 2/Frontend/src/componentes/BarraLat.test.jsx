import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BarraLat from './BarraLat';

describe('Componente BarraLat', () => {
  it('debería renderizar todos los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <BarraLat />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Mensajes')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('debería tener el href correcto para los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <BarraLat />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/admin');
    expect(screen.getByText('Usuarios').closest('a')).toHaveAttribute('href', '/admin/usuarios');
    expect(screen.getByText('Productos').closest('a')).toHaveAttribute('href', '/admin/productos');
    expect(screen.getByText('Mensajes').closest('a')).toHaveAttribute('href', '/admin/mensajes');
    expect(screen.getByText('Cerrar Sesión').closest('a')).toHaveAttribute('href', '/');
  });
});
