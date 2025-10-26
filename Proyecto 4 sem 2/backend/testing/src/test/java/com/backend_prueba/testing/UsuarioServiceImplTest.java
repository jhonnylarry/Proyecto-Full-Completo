package com.backend_prueba.testing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.backend_prueba.testing.entities.Usuario;
import com.backend_prueba.testing.repositories.UsuarioRepositorio;
import com.backend_prueba.testing.services.UsuarioServiceImpl;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepositorio usuarioRepositorio;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        usuarioPrueba = new Usuario();
        usuarioPrueba.setId(1L);
        usuarioPrueba.setNombre("Juan");
        usuarioPrueba.setApellido("Perez");
        usuarioPrueba.setEmail("juan@correo.com");
        usuarioPrueba.setRut("12345678-9");
        usuarioPrueba.setFechaNacimiento(LocalDate.of(1990, 1, 1));
    }

    @Test
    void testCrearUsuario() {
        Usuario usuarioNuevo = new Usuario();
        usuarioNuevo.setNombre("Juan");
        usuarioNuevo.setEmail("juan@correo.com");

        when(usuarioRepositorio.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        Usuario resultado = usuarioService.crear(usuarioNuevo);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Juan", resultado.getNombre());

        verify(usuarioRepositorio, times(1)).save(any(Usuario.class));
    }

    @Test
    void testObtenerId_CuandoUsuarioExiste() {

        when(usuarioRepositorio.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        Usuario resultado = usuarioService.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Juan", resultado.getNombre());
        verify(usuarioRepositorio, times(1)).findById(1L);
    }
    
    @Test
    void testObtenerId_CuandoUsuarioNOExiste() {

        when(usuarioRepositorio.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            usuarioService.obtenerId(99L);
        });

        verify(usuarioRepositorio, times(1)).findById(99L);
    }

    @Test
    void testObtenerTodosLosUsuarios() {

        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("Ana");
        List<Usuario> listaDeUsuarios = Arrays.asList(usuarioPrueba, usuario2);
        
        when(usuarioRepositorio.findAll()).thenReturn(listaDeUsuarios);

        List<Usuario> resultado = usuarioService.listarTodas();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(usuarioRepositorio, times(1)).findAll();
    }

    @Test
    void testActualizarUsuario() {

        Usuario datosNuevos = new Usuario();
        datosNuevos.setNombre("Juanito");
        datosNuevos.setEmail("juanito@nuevo.com");

        when(usuarioRepositorio.findById(1L)).thenReturn(Optional.of(usuarioPrueba));

        when(usuarioRepositorio.save(any(Usuario.class))).thenReturn(usuarioPrueba);

        Usuario resultado = usuarioService.actualizar(1L, datosNuevos);

        assertNotNull(resultado);
        assertEquals("Juanito", resultado.getNombre());
        assertEquals("juanito@nuevo.com", resultado.getEmail());

        verify(usuarioRepositorio, times(1)).findById(1L);
        verify(usuarioRepositorio, times(1)).save(any(Usuario.class));
    }

@Test
    void testEliminarUsuario() {
        Long idParaBorrar = 1L;
        when(usuarioRepositorio.existsById(idParaBorrar)).thenReturn(true);
        doNothing().when(usuarioRepositorio).deleteById(idParaBorrar);
        usuarioService.eliminar(idParaBorrar);
        verify(usuarioRepositorio, times(1)).existsById(idParaBorrar);
        verify(usuarioRepositorio, times(1)).deleteById(idParaBorrar);
    }
}

