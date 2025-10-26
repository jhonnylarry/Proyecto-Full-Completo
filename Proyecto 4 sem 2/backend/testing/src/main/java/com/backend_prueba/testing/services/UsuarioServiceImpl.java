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
        if (usuarioActualizado.getRut() != null) existente.setRut(usuarioActualizado.getRut());
        if (usuarioActualizado.getNombre() != null) existente.setNombre(usuarioActualizado.getNombre());
        if (usuarioActualizado.getApellido() != null) existente.setApellido(usuarioActualizado.getApellido());
        if (usuarioActualizado.getEmail() != null) existente.setEmail(usuarioActualizado.getEmail());
        if (usuarioActualizado.getFechaNacimiento() != null) existente.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
        if (usuarioActualizado.getDireccion() != null) existente.setDireccion(usuarioActualizado.getDireccion());

        if (usuarioActualizado.getContrasena() != null && !usuarioActualizado.getContrasena().isEmpty()) {
            existente.setContrasena(usuarioActualizado.getContrasena()); // (Idealmente hasheada)
        }

        if (usuarioActualizado.getComuna() != null && usuarioActualizado.getComuna().getId() != null) {
            existente.setComuna(usuarioActualizado.getComuna());
        }
        if (usuarioActualizado.getTipoUsuario() != null && usuarioActualizado.getTipoUsuario().getId() != null) {
            existente.setTipoUsuario(usuarioActualizado.getTipoUsuario());
        }

        // ¡Ahora sí, guarda TODOS los cambios!
        return usuarioRepositorio.save(existente);
}
}