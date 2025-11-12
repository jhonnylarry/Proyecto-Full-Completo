package com.backend_prueba.testing.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String contrasena; // El nombre debe coincidir con el JSON de React
}

