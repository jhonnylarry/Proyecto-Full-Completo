package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.Comuna;

public interface ComunaService {

    Comuna obtenerId(Long id);
    List<Comuna> listarTodas();
}
