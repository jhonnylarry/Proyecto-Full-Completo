import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import IniciarSesion from './IniciarSesion';
import userEvent from '@testing-library/user-event';

describe('IniciarSesion Component', () => {
  beforeEach(() => {
    // Limpiamos los mocks antes de cada prueba
    vi.restoreAllMocks();
  });

  it('should render the login form', () => {
    render(
      <MemoryRouter>
        <IniciarSesion />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Correo*')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña*')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('should allow user to type in the input fields', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <IniciarSesion />
      </MemoryRouter>
    );

    const userInput = screen.getByLabelText('Correo*');
    await user.type(userInput, 'testuser');
    expect(userInput).toHaveValue('testuser');

    const passwordInput = screen.getByLabelText('Contraseña*');
    await user.type(passwordInput, 'password');
    expect(passwordInput).toHaveValue('password');
  });

  it('should show an error message on failed login', async () => {
    const user = userEvent.setup();

    // Mock de la función fetch para simular una respuesta de error
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({}), // No necesitamos el contenido para este caso
    });
    
    render(
      <MemoryRouter>
        <IniciarSesion />
      </MemoryRouter>
    );

    const userInput = screen.getByLabelText('Correo*');
    await user.type(userInput, 'wronguser@example.com');

    const passwordInput = screen.getByLabelText('Contraseña*');
    await user.type(passwordInput, 'wrongpassword');

    const loginButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    await user.click(loginButton);

    // Esperamos a que aparezca el mensaje de error en el DOM
    await waitFor(() => {
      expect(screen.getByText('Error: Correo o contraseña incorrectos.')).toBeInTheDocument();
    });
  });
});
