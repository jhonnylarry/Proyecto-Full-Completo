package com.backend_prueba.testing.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_prueba.testing.entities.Mensaje;
import com.backend_prueba.testing.repositories.MensajeRepositorio;

@Service
public class MensajeServiceImpl implements MensajeService {
 
    @Autowired
    private MensajeRepositorio mensajeRepositorio;

    @Override
    public Mensaje crear(Mensaje mensaje) {
        return mensajeRepositorio.save(mensaje);
    }

    @Override
    public Mensaje obtenerId(Long id) {
        return mensajeRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
    }

    @Override
    public List<Mensaje> listarTodas() {
        return (List<Mensaje>) mensajeRepositorio.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!mensajeRepositorio.existsById(id)) {
            throw new RuntimeException("Mensaje no encontrado");
        }
        mensajeRepositorio.deleteById(id);
    }
}
