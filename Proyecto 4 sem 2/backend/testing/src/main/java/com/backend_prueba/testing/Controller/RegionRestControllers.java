package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend_prueba.testing.entities.Region;
import com.backend_prueba.testing.services.RegionService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/regiones")
public class RegionRestControllers {

    @Autowired
    private RegionService regionService;

    @GetMapping("/{id}")
    public ResponseEntity<Region> obtenerRegionPorId(@PathVariable Long id) {
        Region region = regionService.obtenerId(id);
        return ResponseEntity.ok(region);
    }
 
    @GetMapping
    public ResponseEntity<List<Region>> listarRegion() {
        List<Region> Regiones = regionService.listarTodas();
        return ResponseEntity.ok(Regiones);
    }
}
