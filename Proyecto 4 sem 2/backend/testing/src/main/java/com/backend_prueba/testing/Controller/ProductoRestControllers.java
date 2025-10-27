package com.backend_prueba.testing.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend_prueba.testing.entities.Producto;
import com.backend_prueba.testing.entities.Categoria;
import com.backend_prueba.testing.services.ProductoService;
import com.backend_prueba.testing.services.CatalogoService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/productos")
public class ProductoRestControllers {

    @Autowired
    private ProductoService productoServices;

    @Autowired
    private CatalogoService catalogoService;

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoServices.crear(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    // Nuevo endpoint para crear producto con imagen en una sola petición
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> crearProductoConImagen(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") Long precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Producto producto = new Producto();
            producto.setNombre(nombre);
            producto.setDescripcion(descripcion);
            producto.setPrecio(precio);
            producto.setStock(stock);
            
            // Obtener la categoría desde el servicio
            Categoria categoria = catalogoService.obtenerId(categoriaId);
            producto.setCategoria(categoria);
            producto.setActivo(true);
            
            // Si hay imagen, validar y agregar
            if (imagen != null && !imagen.isEmpty()) {
                // Validar tamaño (2MB máximo)
                if (imagen.getSize() > 2 * 1024 * 1024) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
                // Validar tipo
                String contentType = imagen.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
                producto.setImagen(imagen.getBytes());
                producto.setImagenContentType(imagen.getContentType());
            }
            
            Producto nuevoProducto = productoServices.crear(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            // Categoría no encontrada u otro error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Producto producto = productoServices.obtenerId(id);
        return ResponseEntity.ok(producto);
    }

 
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoServices.listarTodas();
        return ResponseEntity.ok(productos);
    }

  
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto productoActualizado) {
        Producto producto = productoServices.actualizar(id, productoActualizado);
        return ResponseEntity.ok(producto);
    }


    
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Producto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(productoServices.desactivar(id));
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<Producto> subirImagen(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Producto actualizado = productoServices.guardarImagen(id, file);
            return ResponseEntity.ok(actualizado);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/imagen")
    public ResponseEntity<Producto> actualizarImagen(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Producto actualizado = productoServices.guardarImagen(id, file);
            return ResponseEntity.ok(actualizado);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/imagen")
    public @ResponseBody ResponseEntity<byte[]> obtenerImagen(@PathVariable Long id) {
        byte[] imagen = productoServices.obtenerImagen(id);
        String contentType = productoServices.obtenerImagenContentType(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM);
        return new ResponseEntity<>(imagen, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/imagen")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long id) {
        productoServices.eliminarImagen(id);
        return ResponseEntity.noContent().build();
    }

}
