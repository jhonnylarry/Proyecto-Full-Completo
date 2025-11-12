package com.backend_prueba.testing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Constructor fácil
public class LoginResponse {
    private String mensaje;
    private String role;
    private Long usuarioId;
    private String nombreUsuario;
}