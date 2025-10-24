package com.backend_prueba.testing.services;

import java.util.List;
import com.backend_prueba.testing.entities.Producto;

public interface ProductoService {

    Producto crear(Producto producto);
    Producto obtenerId(Long id);
    List<Producto> listarTodas();    
    void eliminar(Long id);
    Producto actualizar(Long id, Producto productoActualizado);
    Producto desactivar(Long id);
    Producto guardarImagen(Long id, org.springframework.web.multipart.MultipartFile file) throws java.io.IOException;
    byte[] obtenerImagen(Long id);
    String obtenerImagenContentType(Long id);
    Producto eliminarImagen(Long id);
}
