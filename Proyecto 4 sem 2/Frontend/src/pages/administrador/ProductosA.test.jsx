import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductosA from './ProductosA';

describe('Componente ProductosA', () => {
  it('debería renderizar el título principal', () => {
    render(
      <MemoryRouter>
        <ProductosA />
      </MemoryRouter>
    );
    expect(screen.getByText('Administración de Productos')).toBeInTheDocument();
  });

  it('debería renderizar las tarjetas de navegación con los enlaces correctos', () => {
    render(
      <MemoryRouter>
        <ProductosA />
      </MemoryRouter>
    );

    const stockLink = screen.getByText('Stock Productos').closest('a');
    expect(stockLink).toBeInTheDocument();
    expect(stockLink).toHaveAttribute('href', '/admin/productos/stock');

    const newProductLink = screen.getByText('Nuevo Producto').closest('a');
    expect(newProductLink).toBeInTheDocument();
    expect(newProductLink).toHaveAttribute('href', '/admin/productos/nuevo');

    const editProductLink = screen.getByText('Editar Producto').closest('a');
    expect(editProductLink).toBeInTheDocument();
    expect(editProductLink).toHaveAttribute('href', '/admin/productos/editar');
  });
});
