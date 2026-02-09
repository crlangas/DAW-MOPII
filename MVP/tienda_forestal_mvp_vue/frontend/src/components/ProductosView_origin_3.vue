<!-- src/components/ProductosView.vue -->
<template>
  <section class="productos">

    <!-- ===============================
         TÍTULO
         =============================== -->
    <h1>Catálogo de productos</h1>

    <!-- ===============================
         ESTADO: CARGANDO
         =============================== -->
    <p v-if="loading">Cargando productos...</p>

    <!-- ===============================
         ESTADO: ERROR
         =============================== -->
    <p v-if="error" class="error">
      {{ error }}
    </p>

    <!-- ===============================
         LISTADO DE PRODUCTOS
         =============================== -->
    <ul v-if="!loading && !error">
      <li
        v-for="producto in productos"
        :key="producto.id"
        class="producto"
      >
        <h3>{{ producto.nombre }}</h3>
        <p>{{ producto.descripcion }}</p>
        <strong>{{ producto.precio }} €</strong>
      </li>
    </ul>

  </section>
</template>

<script setup>
/**
 * ProductosView.vue
 * ---------------------------------------------------
 * Vista del patrón MVP.
 * 
 * Características clave:
 *  - NO contiene llamadas a la API
 *  - NO contiene lógica de negocio
 *  - Solo muestra datos y lanza acciones
 */

import { onMounted } from 'vue'
import ProductsPresenter from '@/presenters/ProductsPresenter.js'

/* =================================================
 * CONEXIÓN CON EL PRESENTER
 * ================================================= */

// Creamos una instancia del Presenter
const {
  productos,
  loading,
  error,
  cargarProductos
} = ProductsPresenter()

/* =================================================
 * CICLO DE VIDA
 * ================================================= */

// Cuando la vista se monta, pedimos los datos
onMounted(() => {
  cargarProductos()
})
</script>

<style scoped>
.productos {
  padding: 1rem;
}

.producto {
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
