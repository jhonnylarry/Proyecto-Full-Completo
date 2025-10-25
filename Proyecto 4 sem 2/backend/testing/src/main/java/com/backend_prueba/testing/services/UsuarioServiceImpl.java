package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend_prueba.testing.entities.Usuario;
import com.backend_prueba.testing.repositories.UsuarioRepositorio;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public Usuario crear(Usuario usuario) {
        return usuarioRepositorio.save(usuario);
    }

    @Override
    public Usuario obtenerId(Long id) {
        return usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public List<Usuario> listarTodas() {
        return (List<Usuario>) usuarioRepositorio.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!usuarioRepositorio.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepositorio.deleteById(id);
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Usuario existente = obtenerId(id);
        existente.setNombre(usuarioActualizado.getNombre());
        existente.setEmail(usuarioActualizado.getEmail());
        return usuarioRepositorio.save(existente);
    }
}
