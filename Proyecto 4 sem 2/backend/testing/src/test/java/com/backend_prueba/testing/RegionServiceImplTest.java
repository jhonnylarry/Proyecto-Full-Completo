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

import com.backend_prueba.testing.entities.Region;
import com.backend_prueba.testing.repositories.RegionRepository;
import com.backend_prueba.testing.services.RegionServiceImpl;

@ExtendWith(MockitoExtension.class)
public class RegionServiceImplTest {
@Mock
    private RegionRepository regionRepository;

    @InjectMocks
    private RegionServiceImpl regionService;

    private Region regionPrueba;

    @BeforeEach
    void setUp() {
        regionPrueba = new Region();
        regionPrueba.setId(13L);
        regionPrueba.setNombre("Metropolitana");
    }

    @Test
    void testListarTodasLasRegiones() {
        // GIVEN
        Region region2 = new Region();
        region2.setId(5L);
        region2.setNombre("Valparaíso");
        
        // (usa 'regionPrueba' del setUp)
        List<Region> listaRegiones = Arrays.asList(regionPrueba, region2);

        when(regionRepository.findAll()).thenReturn(listaRegiones);

        // WHEN
        List<Region> resultado = regionService.listarTodas();

        // THEN
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Metropolitana", resultado.get(0).getNombre());

        verify(regionRepository, times(1)).findAll();
    }
    
    @Test
    void testObtenerId_CuandoRegionExiste() {
        when(regionRepository.findById(13L)).thenReturn(Optional.of(regionPrueba));

        Region resultado = regionService.obtenerId(13L);

        assertNotNull(resultado);
        assertEquals(13L, resultado.getId());
        assertEquals("Metropolitana", resultado.getNombre());
        
        verify(regionRepository, times(1)).findById(13L);
    }
    
    @Test
    void testObtenerId_CuandoRegionNOExiste() {
        Long idNoExistente = 99L;
        
        when(regionRepository.findById(idNoExistente)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            regionService.obtenerId(idNoExistente);
        });

        assertEquals("Región no encontrada", exception.getMessage());
        verify(regionRepository, times(1)).findById(idNoExistente);
    }
}
