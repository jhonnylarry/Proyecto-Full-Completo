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

import com.backend_prueba.testing.entities.Comuna;
import com.backend_prueba.testing.entities.Region;
import com.backend_prueba.testing.repositories.ComunaRepository;
import com.backend_prueba.testing.services.ComunaServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ComunaServiceImplTest {

    @Mock
    private ComunaRepository comunaRepository;

    @InjectMocks
    private ComunaServiceImpl comunaService;

    private Comuna comunaPrueba1;
    private Comuna comunaPrueba2;
    private Region regionPrueba;

    @BeforeEach
    void setUp() {
        regionPrueba = new Region();
        regionPrueba.setId(13L);
        regionPrueba.setNombre("Metropolitana");

        comunaPrueba1 = new Comuna();
        comunaPrueba1.setId(1L); 
        comunaPrueba1.setNombre("Maipú");
        comunaPrueba1.setRegion(regionPrueba); 

        comunaPrueba2 = new Comuna();
        comunaPrueba2.setId(2L);
        comunaPrueba2.setNombre("Las Condes");
        comunaPrueba2.setRegion(regionPrueba);
    }

    @Test
    void testListarTodasLasComunas() {
        List<Comuna> listaDeComunas = Arrays.asList(comunaPrueba1, comunaPrueba2);
        
        when(comunaRepository.findAll()).thenReturn(listaDeComunas);

        List<Comuna> resultado = comunaService.listarTodas();

        assertNotNull(resultado); 
        assertEquals(2, resultado.size()); 
        assertEquals("Maipú", resultado.get(0).getNombre());
        
        verify(comunaRepository, times(1)).findAll();
    }

    @Test
    void testObtenerId_CuandoComunaExiste() {
        when(comunaRepository.findById(1L)).thenReturn(Optional.of(comunaPrueba1));

        Comuna resultado = comunaService.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Maipú", resultado.getNombre());
        assertEquals("Metropolitana", resultado.getRegion().getNombre());
        
        verify(comunaRepository, times(1)).findById(1L);
    }
    
    @Test
    void testObtenerId_CuandoComunaNOExiste() {
        Long idNoExistente = 99L;
        
        when(comunaRepository.findById(idNoExistente)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            comunaService.obtenerId(idNoExistente);
        });

        assertEquals("Comuna no encontrada", exception.getMessage());

        verify(comunaRepository, times(1)).findById(idNoExistente);
    }
}