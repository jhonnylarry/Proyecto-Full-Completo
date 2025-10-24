package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_prueba.testing.entities.TipoUsuario;

import com.backend_prueba.testing.repositories.TipoUsuarioRepository;

@Service
public class TipoUsuarioServiceImpl implements TipoUsuarioService {

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;
    
    @Override
    public TipoUsuario obtenerId(Long id) {
        return tipoUsuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado"));
    }

    @Override
    public List<TipoUsuario> listarTodas() {
        return (List<TipoUsuario>) tipoUsuarioRepository.findAll();
    }
}
