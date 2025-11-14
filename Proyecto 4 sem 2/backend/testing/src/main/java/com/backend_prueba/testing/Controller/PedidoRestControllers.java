package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend_prueba.testing.entities.Pedido;
import com.backend_prueba.testing.services.PedidoService;

// (El @CrossOrigin no es necesario si ya tienes el WebConfig global)
@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/pedidos") // <-- ¡CORRECCIÓN 1: Ruta en PLURAL!
public class PedidoRestControllers {

    @Autowired
    private PedidoService pedidoService;
    
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {
        // --- CORRECCIÓN 2: Añadido try-catch ---
        try {
            // Esto llama a tu ServiceImpl que tiene toda la lógica de stock
            Pedido nuevoPedido = pedidoService.crear(pedido);
            return ResponseEntity.ok(nuevoPedido);
        } catch (RuntimeException e) {
            // Si el service lanza error (ej: "Stock insuficiente..."), 
            // se lo mandamos al frontend.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable Long id) {
        // (Este estaba bien)
        Pedido pedido = pedidoService.obtenerId(id);
        return ResponseEntity.ok(pedido);
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        // (Este estaba bien)
        List<Pedido> pedidos = pedidoService.listarTodas();
        return ResponseEntity.ok(pedidos);
    }
}