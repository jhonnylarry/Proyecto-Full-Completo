package com.backend_prueba.testing.repositories;

import org.springframework.data.repository.CrudRepository;

import com.backend_prueba.testing.entities.Producto;

public interface ProductoRepositorio extends CrudRepository <Producto, Long> {

}
