package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.DetallePedido;

public interface DetallePedidoService {

    DetallePedido crear(DetallePedido detallePedido);
    DetallePedido obtenerId(Long id);
    List<DetallePedido> listarTodas();
}