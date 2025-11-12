package com.backend_prueba.testing.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.lang.NonNull;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para TODAS las rutas (ej. /api/...)
            .allowedOrigins("http://localhost:5173") // Permite tu frontend de React
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ¡Importante! Permite OPTIONS
            .allowedHeaders("*") // Permite todos los headers (como Content-Type)
            .allowCredentials(true); // Permite enviar credenciales (cookies, etc.)
    }
}