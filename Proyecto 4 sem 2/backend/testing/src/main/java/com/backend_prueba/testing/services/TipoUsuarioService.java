package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.TipoUsuario;

public interface TipoUsuarioService {

    TipoUsuario obtenerId(Long id);
    List<TipoUsuario> listarTodas();
}
