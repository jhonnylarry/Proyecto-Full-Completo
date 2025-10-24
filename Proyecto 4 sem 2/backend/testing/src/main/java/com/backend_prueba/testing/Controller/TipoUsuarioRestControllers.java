package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend_prueba.testing.entities.TipoUsuario;
import com.backend_prueba.testing.services.TipoUsuarioService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tipo-usuarios")
public class TipoUsuarioRestControllers {

    @Autowired
    private TipoUsuarioService tipoUsuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<TipoUsuario> obtenerTipoUsuarioPorId(@PathVariable Long id) {
        TipoUsuario tipoUsuario = tipoUsuarioService.obtenerId(id);
        return ResponseEntity.ok(tipoUsuario);
    }

    @GetMapping
    public ResponseEntity<List<TipoUsuario>> listarTipoUsuarios() {
        List<TipoUsuario> tipoUsuarios = tipoUsuarioService.listarTodas();
        return ResponseEntity.ok(tipoUsuarios);
    }
}
