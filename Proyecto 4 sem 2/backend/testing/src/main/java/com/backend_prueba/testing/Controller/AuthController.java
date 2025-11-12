package com.backend_prueba.testing.Controller;

import com.backend_prueba.testing.dto.LoginRequest;
import com.backend_prueba.testing.dto.LoginResponse;
import com.backend_prueba.testing.entities.Usuario;
import com.backend_prueba.testing.services.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// NOTA: El @CrossOrigin ya no es necesario aquí si usas el WebConfig
@RestController
@RequestMapping("/api/auth") // <-- Esta es la ruta base
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    // Este método escucha en POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        
        try {
            // 1. Buscamos al usuario por su email
            Usuario usuario = usuarioService.obtenerPorEmail(loginRequest.getEmail());

            // 2. Comparamos la contraseña (texto plano vs texto plano)
            if (usuario.getContrasena().equals(loginRequest.getContrasena())) {
                
                // --- ¡Respuesta actualizada! ---
                String role = usuario.getTipoUsuario().getNombre().toUpperCase(); // "ADMIN" o "CLIENTE"
                Long usuarioId = usuario.getId(); // <-- Dato nuevo
                String nombreUsuario = usuario.getNombre(); // <-- Dato nuevo
                
                // Mandamos respuesta 200 OK con los nuevos datos
                return ResponseEntity.ok(new LoginResponse("Login exitoso", role, usuarioId, nombreUsuario));
                
            } else {
                // 4. Si la contraseña es incorrecta
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
            }

        } catch (Exception e) {
            // 5. Si el email no se encuentra (el servicio lanzó la excepción)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }
    }
}