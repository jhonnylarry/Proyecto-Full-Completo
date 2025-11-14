package com.backend_prueba.testing.services;

import java.time.LocalDateTime; // Para la fecha
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// ¡Importamos las entidades y repositorios que necesitamos!
import com.backend_prueba.testing.entities.DetallePedido;
import com.backend_prueba.testing.entities.Pedido;
import com.backend_prueba.testing.entities.Producto;
import com.backend_prueba.testing.entities.Usuario;
import com.backend_prueba.testing.repositories.PedidoRepository;
import com.backend_prueba.testing.repositories.ProductoRepositorio; // <-- 1. Necesitamos este
import com.backend_prueba.testing.repositories.UsuarioRepositorio;  // <-- 2. Y este

import org.springframework.transaction.annotation.Transactional; // <-- 3. Importante para la transacción

@Service
public class PedidoServiceImpl implements PedidoService{

    @Autowired
    private PedidoRepository pedidoRepository;

    // --- 4. Inyectamos los otros repositorios ---
    @Autowired
    private ProductoRepositorio productoRepositorio; // Para descontar stock

    @Autowired
    private UsuarioRepositorio usuarioRepositorio; // Para asociar al usuario

    // --- 5. REEMPLAZAMOS EL MÉTODO 'crear' ---
    @Override
    @Transactional // ¡MUY IMPORTANTE! Si algo falla (ej. sin stock), revierte todo.
    public Pedido crear(Pedido pedido) {
        
        // 1. Establecer la fecha actual
        pedido.setFechaVenta(LocalDateTime.now());

        // 2. Asociar al Usuario (React nos manda el ID)
        Usuario usuario = usuarioRepositorio.findById(pedido.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para el pedido"));
        pedido.setUsuario(usuario);

        long valorTotalCalculado = 0L;

        // 3. Recorrer los detalles para verificar y descontar stock
        // (Asegúrate de que React mande los 'detalles' en el JSON)
        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new RuntimeException("El pedido no tiene detalles (productos).");
        }
        
        for (DetallePedido detalle : pedido.getDetalles()) {
            
            // 3a. Buscar el producto en la BBDD (para evitar trampa en el precio)
            Producto productoDB = productoRepositorio.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalle.getProducto().getId()));

            // 3b. Verificar stock
            if (productoDB.getStock() < detalle.getCantidad()) {
                // Lanzamos el error que React mostrará
                throw new RuntimeException("Stock insuficiente para: " + productoDB.getNombre()); 
            }

            // 3c. Descontar stock
            productoDB.setStock(productoDB.getStock() - detalle.getCantidad());
            productoRepositorio.save(productoDB); // Guarda el stock actualizado

            // 3d. Asignar el precio real y el producto real al detalle
            detalle.setProducto(productoDB);
            detalle.setPrecioUnitario(productoDB.getPrecio());
            
            // 3e. Vincular el detalle al pedido (para la relación mappedBy)
            detalle.setPedido(pedido);

            // 3f. Sumar al total
            valorTotalCalculado += (detalle.getPrecioUnitario() * detalle.getCantidad());
        }

        // 4. Asignar el total calculado al pedido
        pedido.setValorTotal(valorTotalCalculado);

        // 5. Guardar el Pedido (y gracias a Cascade.ALL, los detalles se guardan solos)
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido obtenerId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    @Override
    public List<Pedido> listarTodas() {
        // Si PedidoRepository usa JpaRepository, no necesitas el cast
        return (List<Pedido>) pedidoRepository.findAll(); 
    }
}