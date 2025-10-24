package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_prueba.testing.entities.Region;
import com.backend_prueba.testing.repositories.RegionRepository;

@Service
public class RegionServiceImpl implements RegionService{

    @Autowired
    private RegionRepository regionRepository;
    
    @Override
    public Region obtenerId(Long id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Región no encontrada"));
    }

    @Override
    public List<Region> listarTodas() {
        return (List<Region>) regionRepository.findAll();
    }
    
}
