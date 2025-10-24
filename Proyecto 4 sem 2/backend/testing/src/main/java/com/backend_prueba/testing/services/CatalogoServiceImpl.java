package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_prueba.testing.entities.Categoria;
import com.backend_prueba.testing.repositories.CatalogoRepository;

@Service
public class CatalogoServiceImpl implements CatalogoService{

    @Autowired
    private CatalogoRepository categoriaRepository;

    @Override
    public Categoria obtenerId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Override
    public List<Categoria> listarTodas() {
        return (List<Categoria>) categoriaRepository.findAll();
    }
}
