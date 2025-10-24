package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_prueba.testing.entities.Comuna;
import com.backend_prueba.testing.repositories.ComunaRepository;

@Service
public class ComunaServiceImpl implements ComunaService{

    @Autowired
    private ComunaRepository comunaRepository;

    @Override
    public Comuna obtenerId(Long id) {
        return comunaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comuna no encontrada"));
    }

    @Override
    public List<Comuna> listarTodas() {
        return (List<Comuna>) comunaRepository.findAll();
    }
}
