package com.tienda.forestal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador básico de prueba
 * Equivalente al "/" de Flask
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Backend Spring Boot funcionando correctamente";
    }
}

