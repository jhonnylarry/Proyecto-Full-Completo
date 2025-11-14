package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_prueba.testing.entities.DetallePedido;
import com.backend_prueba.testing.repositories.DetallePedidoRepository;

@Service
public class DetallePedidoServiceImpl implements DetallePedidoService{

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

        @Override
    public DetallePedido crear(DetallePedido detallePedido) {
        return detallePedidoRepository.save(detallePedido);
    }

    @Override
    public DetallePedido obtenerId(Long id) {
        return detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DetallePedido no encontrado"));
    }

    @Override
    public List<DetallePedido> listarTodas() {
        return (List<DetallePedido>) detallePedidoRepository.findAll();
    }
}