package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.Pedido;

public interface PedidoService {

    Pedido crear(Pedido pedido);
    Pedido obtenerId(Long id);
    List<Pedido> listarTodas();
}