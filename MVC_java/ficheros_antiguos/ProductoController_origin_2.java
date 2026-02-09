
package com.tienda.forestal.controller;

import com.tienda.forestal.service.ProductoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controlador REST
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }


    @GetMapping("/api/productos")
    public Map<String, Object> obtenerProductos() {
        return Map.of(
            "productos", productoService.obtenerTodos()
        );
    }
}

