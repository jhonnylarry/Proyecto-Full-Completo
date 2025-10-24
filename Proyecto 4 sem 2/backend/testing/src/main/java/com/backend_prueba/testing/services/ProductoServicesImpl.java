package com.backend_prueba.testing.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.backend_prueba.testing.entities.Producto;
import com.backend_prueba.testing.repositories.ProductoRepositorio;

@Service
public class ProductoServicesImpl implements ProductoService {

 @Autowired
    private ProductoRepositorio productoRepositories;

    @Override
    public Producto crear(Producto producto){
        return productoRepositories.save(producto);
    }


    @Override
    public Producto obtenerId(Long id) {
        return productoRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override
    public List<Producto> listarTodas() {
        return (List<Producto>) productoRepositories.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!productoRepositories.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
       productoRepositories.deleteById(id);
    }

    @Override
    public Producto actualizar(Long id, Producto productoActualizado) {
        Producto existente = obtenerId(id);
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        return productoRepositories.save(existente);
    }

    @Override
    public Producto desactivar(Long id){
        Producto producto = obtenerId(id);
        producto.setActivo(false);
        return productoRepositories.save(producto);
    }

    @Override
    public Producto guardarImagen(Long id, MultipartFile file) throws java.io.IOException {
        Producto producto = obtenerId(id);
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Archivo vacio");
        }
        // Validar tipo y tamaño
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Tipo de archivo no soportado. Solo imágenes permitidas.");
        }
        producto.setImagen(file.getBytes());
        producto.setImagenContentType(file.getContentType());
        return productoRepositories.save(producto);
    }

    @Override
    public byte[] obtenerImagen(Long id) {
        Producto producto = obtenerId(id);
        byte[] imagen = producto.getImagen();
        if (imagen == null) {
            throw new RuntimeException("Producto no tiene imagen");
        }
        return imagen;
    }

    @Override
    public String obtenerImagenContentType(Long id) {
        Producto producto = obtenerId(id);
        return producto.getImagenContentType();
    }

    @Override
    public Producto eliminarImagen(Long id) {
        Producto producto = obtenerId(id);
        producto.setImagen(null);
        producto.setImagenContentType(null);
        return productoRepositories.save(producto);
    }

}
