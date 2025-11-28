import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Componente Header', () => {
  it('debería renderizar todos los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('debería tener el href correcto para los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Productos').closest('a')).toHaveAttribute('href', '/productos');
    expect(screen.getByText('Nosotros').closest('a')).toHaveAttribute('href', '/nosotros');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blogs');
    expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto');
  });
});
