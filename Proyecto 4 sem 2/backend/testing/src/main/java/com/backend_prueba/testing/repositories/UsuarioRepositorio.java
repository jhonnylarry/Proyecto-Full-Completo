package com.backend_prueba.testing.repositories;

import org.springframework.data.repository.CrudRepository;

import com.backend_prueba.testing.entities.Usuario;
import java.util.Optional;

public interface UsuarioRepositorio extends CrudRepository <Usuario, Long>{

    Optional<Usuario> findByEmail(String email);
}
