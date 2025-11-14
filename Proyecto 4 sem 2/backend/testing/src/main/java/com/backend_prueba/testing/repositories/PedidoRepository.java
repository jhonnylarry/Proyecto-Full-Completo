package com.backend_prueba.testing.repositories;

import org.springframework.data.repository.CrudRepository;

import com.backend_prueba.testing.entities.Pedido;

public interface PedidoRepository extends CrudRepository<Pedido, Long> {

}
