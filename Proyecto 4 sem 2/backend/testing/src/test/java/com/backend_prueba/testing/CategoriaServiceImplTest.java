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

import com.backend_prueba.testing.entities.Categoria; 
import com.backend_prueba.testing.repositories.CatalogoRepository;
import com.backend_prueba.testing.services.CatalogoServiceImpl;

@ExtendWith(MockitoExtension.class)
public class CategoriaServiceImplTest {

    @Mock
    private CatalogoRepository catalogoRepository;

    @InjectMocks
    private CatalogoServiceImpl catalogoService;


    private Categoria categoriaPrueba1;
    private Categoria categoriaPrueba2;

    @BeforeEach
    void setUp() {

        categoriaPrueba1 = new Categoria();
        categoriaPrueba1.setId(1L);
        categoriaPrueba1.setNombre("Electrónica");

        categoriaPrueba2 = new Categoria();
        categoriaPrueba2.setId(2L);
        categoriaPrueba2.setNombre("Ropa");
    }

    @Test
    void testListarTodasLasCategorias() {

        List<Categoria> listaDeCategorias = Arrays.asList(categoriaPrueba1, categoriaPrueba2);

        when(catalogoRepository.findAll()).thenReturn(listaDeCategorias);


        List<Categoria> resultado = catalogoService.listarTodas();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Electrónica", resultado.get(0).getNombre());

        verify(catalogoRepository, times(1)).findAll();
    }

    @Test
    void testObtenerId_CuandoCategoriaExiste() {

        when(catalogoRepository.findById(1L)).thenReturn(Optional.of(categoriaPrueba1));

        Categoria resultado = catalogoService.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Electrónica", resultado.getNombre());

        verify(catalogoRepository, times(1)).findById(1L);
    }
    
    @Test
    void testObtenerId_CuandoCategoriaNOExiste() {

        Long idNoExistente = 99L;

        when(catalogoRepository.findById(idNoExistente)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            catalogoService.obtenerId(idNoExistente);
        });

        assertEquals("Categoría no encontrada", exception.getMessage());

        verify(catalogoRepository, times(1)).findById(idNoExistente);
    }
}
