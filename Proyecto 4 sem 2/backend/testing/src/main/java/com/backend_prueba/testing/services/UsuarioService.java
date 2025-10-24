package com.backend_prueba.testing.services;

import java.util.List;

import com.backend_prueba.testing.entities.Usuario;

public interface UsuarioService {

    Usuario crear(Usuario usuario);
    Usuario obtenerId(Long id);
    List<Usuario> listarTodas();
    void eliminar(Long id);
    Usuario actualizar(Long id, Usuario usuarioActualizado);
}
