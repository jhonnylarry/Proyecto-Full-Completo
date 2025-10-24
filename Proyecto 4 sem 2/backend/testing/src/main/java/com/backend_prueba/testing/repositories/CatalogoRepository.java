package com.backend_prueba.testing.repositories;

import org.springframework.data.repository.CrudRepository;

import com.backend_prueba.testing.entities.Categoria;

public interface CatalogoRepository extends CrudRepository <Categoria, Long> {

}
