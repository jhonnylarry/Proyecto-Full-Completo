package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.Categoria;

public interface CatalogoService {

    Categoria obtenerId(Long id);
    List<Categoria> listarTodas();
}
