package com.backend_prueba.testing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.backend_prueba.testing.entities.TipoUsuario;
import com.backend_prueba.testing.repositories.TipoUsuarioRepository;
import com.backend_prueba.testing.services.TipoUsuarioServiceImpl;

@ExtendWith(MockitoExtension.class)
public class TipoUsuarioServiceImplTest {
@Mock
    private TipoUsuarioRepository tipoUsuarioRepository;

    @InjectMocks
    private TipoUsuarioServiceImpl tipoUsuarioService;

    private TipoUsuario tipoAdmin;
    private TipoUsuario tipoCliente;

    @BeforeEach
    void setUp() {
        tipoAdmin = new TipoUsuario();
        tipoAdmin.setId(1L);
        tipoAdmin.setNombre("ADMIN");

        tipoCliente = new TipoUsuario();
        tipoCliente.setId(2L);
        tipoCliente.setNombre("CLIENTE");
    }

    @Test
    void testListarTodosLosTiposUsuario() {
        List<TipoUsuario> listaTipos = Arrays.asList(tipoAdmin, tipoCliente);

        when(tipoUsuarioRepository.findAll()).thenReturn(listaTipos);

        List<TipoUsuario> resultado = tipoUsuarioService.listarTodas();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("ADMIN", resultado.get(0).getNombre());

        verify(tipoUsuarioRepository, times(1)).findAll();
    }

    @Test
    void testObtenerId_CuandoTipoUsuarioExiste() {
        when(tipoUsuarioRepository.findById(1L)).thenReturn(Optional.of(tipoAdmin));

        TipoUsuario resultado = tipoUsuarioService.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("ADMIN", resultado.getNombre());

        verify(tipoUsuarioRepository, times(1)).findById(1L);
    }
    
    @Test
    void testObtenerId_CuandoTipoUsuarioNOExiste() {
        Long idNoExistente = 99L;
        
        when(tipoUsuarioRepository.findById(idNoExistente)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tipoUsuarioService.obtenerId(idNoExistente);
        });

        assertEquals("Tipo de usuario no encontrado", exception.getMessage());
        verify(tipoUsuarioRepository, times(1)).findById(idNoExistente);
    }
}
