package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.Mensaje;

public interface MensajeService {

    Mensaje crear(Mensaje mensaje);
    Mensaje obtenerId(Long id);
    List<Mensaje> listarTodas();
    void eliminar(Long id);
}
