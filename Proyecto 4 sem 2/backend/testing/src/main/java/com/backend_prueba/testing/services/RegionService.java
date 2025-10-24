package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.Region;

public interface RegionService {

    Region obtenerId(Long id);
    List<Region> listarTodas();
}
