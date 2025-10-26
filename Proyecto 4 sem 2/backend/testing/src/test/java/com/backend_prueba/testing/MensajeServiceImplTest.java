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

import com.backend_prueba.testing.entities.Mensaje;
import com.backend_prueba.testing.repositories.MensajeRepositorio;
import com.backend_prueba.testing.services.MensajeServiceImpl;

@ExtendWith(MockitoExtension.class)
class MensajeServiceImplTest {

    @Mock
    private MensajeRepositorio mensajeRepositorio;

    @InjectMocks
    private MensajeServiceImpl mensajeService;

    private Mensaje mensajePrueba1;
    private Mensaje mensajePrueba2;

    @BeforeEach
    void setUp() {
        mensajePrueba1 = new Mensaje();
        mensajePrueba1.setId(1L);
        mensajePrueba1.setNombre("Carlos");
        mensajePrueba1.setEmail("carlos@mail.com");
        mensajePrueba1.setMensaje("Hola, necesito ayuda");

        mensajePrueba2 = new Mensaje();
        mensajePrueba2.setId(2L);
        mensajePrueba2.setNombre("Ana");
        mensajePrueba2.setEmail("ana@mail.com");
        mensajePrueba2.setMensaje("Gracias por todo");
    }

    @Test
    void testCrearMensaje() {
        Mensaje mensajeNuevo = new Mensaje();
        mensajeNuevo.setNombre("Carlos");
        mensajeNuevo.setMensaje("Hola, necesito ayuda");
        
        when(mensajeRepositorio.save(any(Mensaje.class))).thenReturn(mensajePrueba1);

        Mensaje resultado = mensajeService.crear(mensajeNuevo);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Carlos", resultado.getNombre());
        
        verify(mensajeRepositorio, times(1)).save(any(Mensaje.class));
    }

    @Test
    void testObtenerId_CuandoMensajeExiste() {
        when(mensajeRepositorio.findById(1L)).thenReturn(Optional.of(mensajePrueba1));

        Mensaje resultado = mensajeService.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Carlos", resultado.getNombre());
        
        verify(mensajeRepositorio, times(1)).findById(1L);
    }
    
    @Test
    void testObtenerId_CuandoMensajeNOExiste() {
        Long idNoExistente = 99L;
        
        when(mensajeRepositorio.findById(idNoExistente)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            mensajeService.obtenerId(idNoExistente);
        });

        assertEquals("Mensaje no encontrado", exception.getMessage());
        verify(mensajeRepositorio, times(1)).findById(idNoExistente);
    }

    @Test
    void testListarTodosLosMensajes() {
        List<Mensaje> listaDeMensajes = Arrays.asList(mensajePrueba1, mensajePrueba2);
        
        when(mensajeRepositorio.findAll()).thenReturn(listaDeMensajes);

        List<Mensaje> resultado = mensajeService.listarTodas();

        assertNotNull(resultado); 
        assertEquals(2, resultado.size()); 
        assertEquals("Ana", resultado.get(1).getNombre());
        
        verify(mensajeRepositorio, times(1)).findAll();
    }

    @Test
    void testEliminarMensaje_Exitoso() {
        Long idParaBorrar = 1L;
        
        when(mensajeRepositorio.existsById(idParaBorrar)).thenReturn(true);
        doNothing().when(mensajeRepositorio).deleteById(idParaBorrar);

        mensajeService.eliminar(idParaBorrar);

        verify(mensajeRepositorio, times(1)).existsById(idParaBorrar);
        verify(mensajeRepositorio, times(1)).deleteById(idParaBorrar);
    }

    @Test
    void testEliminarMensaje_NoEncontrado() {
        Long idNoExistente = 99L;
        
        when(mensajeRepositorio.existsById(idNoExistente)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            mensajeService.eliminar(idNoExistente);
        });

        // ¡Ojo con este mensaje!
        assertEquals("Mensaje no encontrado", exception.getMessage());
        
        verify(mensajeRepositorio, times(1)).existsById(idNoExistente);
        verify(mensajeRepositorio, never()).deleteById(anyLong()); // Verifica que NO se llamó a borrar
    }
}