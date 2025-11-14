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

import com.backend_prueba.testing.entities.DetallePedido;
import com.backend_prueba.testing.services.DetallePedidoService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/detallepedido")
public class DetallePedidoRestControllers {

    @Autowired
    private DetallePedidoService detallePedidoService;
    
    @PostMapping
    public ResponseEntity<DetallePedido> crearDetallePedido(@RequestBody DetallePedido detallePedido) {
        DetallePedido nuevoDetallePedido = detallePedidoService.crear(detallePedido);
        return ResponseEntity.ok(nuevoDetallePedido);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedido> obtenerDetallePedidoPorId(@PathVariable Long id) {
        DetallePedido detallePedido = detallePedidoService.obtenerId(id);
        return ResponseEntity.ok(detallePedido);
    }
 
    @GetMapping
    public ResponseEntity<List<DetallePedido>> listarDetallePedidos() {
        List<DetallePedido> detallePedidos = detallePedidoService.listarTodas();
        return ResponseEntity.ok(detallePedidos);
    }
}
