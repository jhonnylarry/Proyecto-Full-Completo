import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductosA from './ProductosA';

describe('ProductosA Component', () => {
  it('should render the main title', () => {
    render(
      <MemoryRouter>
        <ProductosA />
      </MemoryRouter>
    );
    expect(screen.getByText('Administración de Productos')).toBeInTheDocument();
  });

  it('should render navigation cards with correct links', () => {
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
