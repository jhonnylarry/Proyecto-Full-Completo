package com.backend_prueba.testing.repositories;

import org.springframework.data.repository.CrudRepository;

import com.backend_prueba.testing.entities.Usuario;

public interface UsuarioRepositorio extends CrudRepository <Usuario, Long>{

}
