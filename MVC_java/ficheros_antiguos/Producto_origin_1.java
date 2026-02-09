package com.tienda.forestal.entity;

import jakarta.persistence.*;

/**
 * Entity Producto
 * Representa la tabla productos en MySQL
 */
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column(name = "nombre")
    private String nombre;
    // @Column(name = "precio")
    private Double precio;
    // @Column(name = "imagen")
    private String imagen;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public String getImagen() {
        return imagen;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}
