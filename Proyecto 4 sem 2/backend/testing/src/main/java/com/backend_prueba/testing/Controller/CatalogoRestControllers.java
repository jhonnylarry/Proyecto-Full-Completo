package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend_prueba.testing.entities.Categoria;
import com.backend_prueba.testing.services.CatalogoService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/catalogo")
public class CatalogoRestControllers {

    @Autowired
    private CatalogoService categoriaService;

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCatalogoPorId(@PathVariable Long id) {
        Categoria categoria = categoriaService.obtenerId(id);
        return ResponseEntity.ok(categoria);
    }
 
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        List<Categoria> categorias = categoriaService.listarTodas();
        return ResponseEntity.ok(categorias);
    }
}
