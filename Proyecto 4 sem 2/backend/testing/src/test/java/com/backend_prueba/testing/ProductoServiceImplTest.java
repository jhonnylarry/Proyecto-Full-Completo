package com.backend_prueba.testing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import com.backend_prueba.testing.entities.Producto;
import com.backend_prueba.testing.repositories.ProductoRepositorio;
import com.backend_prueba.testing.services.ProductoServicesImpl;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceImplTest {

    @Mock
    private ProductoRepositorio productoRepositories;

    @InjectMocks
    private ProductoServicesImpl productoService;

    @Mock
    private MultipartFile mockFile;

    private Producto productoPrueba1;
    private Producto productoPrueba2;
    private byte[] testImageBytes;

    @BeforeEach
    void setUp() {
        testImageBytes = "test-data".getBytes();
        
        productoPrueba1 = new Producto();
        productoPrueba1.setId(1L);
        productoPrueba1.setNombre("Producto 1");
        productoPrueba1.setDescripcion("Desc 1");
        productoPrueba1.setPrecio(100L);
        productoPrueba1.setActivo(true);
        productoPrueba1.setImagen(testImageBytes);
        productoPrueba1.setImagenContentType("image/jpeg");

        productoPrueba2 = new Producto();
        productoPrueba2.setId(2L);
        productoPrueba2.setNombre("Producto 2");
        productoPrueba2.setActivo(true);
        productoPrueba2.setImagen(null);
    }

    @Test
    void testCrearProducto() {
        when(productoRepositories.save(any(Producto.class))).thenReturn(productoPrueba1);

        Producto resultado = productoService.crear(new Producto());

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(productoRepositories, times(1)).save(any(Producto.class));
    }

    @Test
    void testObtenerId_CuandoProductoExiste() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));

        Producto resultado = productoService.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals("Producto 1", resultado.getNombre());
        verify(productoRepositories, times(1)).findById(1L);
    }

    @Test
    void testObtenerId_CuandoProductoNOExiste() {
        when(productoRepositories.findById(99L)).thenReturn(Optional.empty());

        Exception e = assertThrows(RuntimeException.class, () -> {
            productoService.obtenerId(99L);
        });
        assertEquals("Producto no encontrado", e.getMessage());
    }

    @Test
    void testListarTodosLosProductos() {
        List<Producto> lista = Arrays.asList(productoPrueba1, productoPrueba2);
        when(productoRepositories.findAll()).thenReturn(lista);

        List<Producto> resultado = productoService.listarTodas();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(productoRepositories, times(1)).findAll();
    }

    @Test
    void testEliminarProducto_Exitoso() {
        when(productoRepositories.existsById(1L)).thenReturn(true);
        doNothing().when(productoRepositories).deleteById(1L);

        productoService.eliminar(1L);

        verify(productoRepositories, times(1)).existsById(1L);
        verify(productoRepositories, times(1)).deleteById(1L);
    }

    @Test
    void testEliminarProducto_NoEncontrado() {
        when(productoRepositories.existsById(99L)).thenReturn(false);

        Exception e = assertThrows(RuntimeException.class, () -> {
            productoService.eliminar(99L);
        });
        
        assertEquals("Producto no encontrado", e.getMessage());
        verify(productoRepositories, times(1)).existsById(99L);
        verify(productoRepositories, never()).deleteById(anyLong());
    }

    @Test
    void testActualizarProducto() {
        Producto datosNuevos = new Producto();
        datosNuevos.setDescripcion("Nueva Descripcion");
        datosNuevos.setPrecio(200L);

        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        when(productoRepositories.save(any(Producto.class))).then(inv -> inv.getArgument(0));

        Producto resultado = productoService.actualizar(1L, datosNuevos);

        assertNotNull(resultado);
        assertEquals("Nueva Descripcion", resultado.getDescripcion());
        assertEquals(200L, resultado.getPrecio());
        verify(productoRepositories, times(1)).findById(1L);
        verify(productoRepositories, times(1)).save(any(Producto.class));
    }

    @Test
    void testDesactivarProducto() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        when(productoRepositories.save(any(Producto.class))).thenReturn(productoPrueba1);

        Producto resultado = productoService.desactivar(1L);

        assertNotNull(resultado);
        assertFalse(resultado.getActivo());
        verify(productoRepositories, times(1)).findById(1L);
        verify(productoRepositories, times(1)).save(productoPrueba1);
    }

    @Test
    void testGuardarImagen_Exitoso() throws IOException {
        byte[] newBytes = "new-image".getBytes();
        
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getContentType()).thenReturn("image/png");
        when(mockFile.getBytes()).thenReturn(newBytes);
        when(productoRepositories.save(any(Producto.class))).thenReturn(productoPrueba1);

        Producto resultado = productoService.guardarImagen(1L, mockFile);

        assertNotNull(resultado);
        assertEquals(newBytes, resultado.getImagen());
        assertEquals("image/png", resultado.getImagenContentType());
        verify(productoRepositories, times(1)).save(productoPrueba1);
    }

    @Test
    void testGuardarImagen_ArchivoVacio() throws IOException {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        when(mockFile.isEmpty()).thenReturn(true);

        Exception e = assertThrows(RuntimeException.class, () -> {
            productoService.guardarImagen(1L, mockFile);
        });
        
        assertEquals("Archivo vacio", e.getMessage());
        verify(productoRepositories, never()).save(any());
    }

    @Test
    void testGuardarImagen_TipoNoSoportado() throws IOException {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getContentType()).thenReturn("application/pdf");

        Exception e = assertThrows(RuntimeException.class, () -> {
            productoService.guardarImagen(1L, mockFile);
        });
        
        assertEquals("Tipo de archivo no soportado. Solo imágenes permitidas.", e.getMessage());
        verify(productoRepositories, never()).save(any());
    }

    @Test
    void testObtenerImagen_Exitoso() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));

        byte[] resultado = productoService.obtenerImagen(1L);

        assertNotNull(resultado);
        assertEquals(testImageBytes, resultado);
    }

    @Test
    void testObtenerImagen_SinImagen() {
        when(productoRepositories.findById(2L)).thenReturn(Optional.of(productoPrueba2));

        Exception e = assertThrows(RuntimeException.class, () -> {
            productoService.obtenerImagen(2L);
        });
        assertEquals("Producto no tiene imagen", e.getMessage());
    }

    @Test
    void testObtenerImagenContentType() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        String contentType = productoService.obtenerImagenContentType(1L);
        assertEquals("image/jpeg", contentType);
    }

    @Test
    void testEliminarImagen() {
        when(productoRepositories.findById(1L)).thenReturn(Optional.of(productoPrueba1));
        when(productoRepositories.save(any(Producto.class))).thenReturn(productoPrueba1);

        Producto resultado = productoService.eliminarImagen(1L);

        assertNull(resultado.getImagen());
        assertNull(resultado.getImagenContentType());
        verify(productoRepositories, times(1)).save(productoPrueba1);
    }
}
