package com.backend_prueba.testing.repositories;

import org.springframework.data.repository.CrudRepository;

import com.backend_prueba.testing.entities.Mensaje;

public interface MensajeRepositorio extends CrudRepository <Mensaje, Long>{

}
