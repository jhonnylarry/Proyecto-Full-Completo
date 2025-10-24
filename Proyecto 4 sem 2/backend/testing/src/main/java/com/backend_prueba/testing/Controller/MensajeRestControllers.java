package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend_prueba.testing.entities.Mensaje;
import com.backend_prueba.testing.services.MensajeService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mensajes")
public class MensajeRestControllers {

    @Autowired
    private MensajeService mensajeService;

    @PostMapping
    public ResponseEntity<Mensaje> crearMensaje(@RequestBody Mensaje mensaje) {
        Mensaje nuevoMensaje = mensajeService.crear(mensaje);
        return ResponseEntity.ok(nuevoMensaje);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mensaje> obtenerMensajePorId(@PathVariable Long id) {
        Mensaje mensaje = mensajeService.obtenerId(id);
        return ResponseEntity.ok(mensaje);
    }
 
    @GetMapping
    public ResponseEntity<List<Mensaje>> listarMensajes() {
        List<Mensaje> mensajes = mensajeService.listarTodas();
        return ResponseEntity.ok(mensajes);
    }

  
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable Long id) {
        mensajeService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
