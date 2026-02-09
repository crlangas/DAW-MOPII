
package com.tienda.forestal.service;

import com.tienda.forestal.model.Producto;
import com.tienda.forestal.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Capa de servicio
 * Aquí vive la lógica de negocio
 */

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> findAll() {
        return repository.findAll();
    }
}

