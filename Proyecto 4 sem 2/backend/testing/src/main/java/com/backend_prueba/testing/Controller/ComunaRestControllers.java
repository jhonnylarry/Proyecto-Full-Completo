package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend_prueba.testing.entities.Comuna;
import com.backend_prueba.testing.services.ComunaService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/comunas")
public class ComunaRestControllers {
  
    @Autowired
    private ComunaService comunaService;

    @GetMapping("/{id}")
    public ResponseEntity<Comuna> obtenerComunaPorId(@PathVariable Long id) {
        Comuna comuna = comunaService.obtenerId(id);
        return ResponseEntity.ok(comuna);
    }
 
    @GetMapping
    public ResponseEntity<List<Comuna>> listarComuna() {
        List<Comuna> Comunas = comunaService.listarTodas();
        return ResponseEntity.ok(Comunas);
    }
}
