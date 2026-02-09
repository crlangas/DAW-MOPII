// src/presenters/ProductsPresenter.js
// ===================================================
// PRESENTER (MVP)
// Orquesta la lógica entre la View y la API
//
// Actúa como "cerebro" del frontend MVP.
// - Gestiona estado
// - Habla con la API
// - Expone métodos que la Vista utiliza
//
// El Presenter es un servicio de lógica reutilizable, no un componente visual. 
// ===================================================
/**
 * ProductsPresenter.js
 * ---------------------------------------------------
 * Presenter principal del patrón MVP.
 * 
 * Responsabilidades:
 *  - Gestionar estado (productos, loading, error)
 *  - Orquestar llamadas a la API
 *  - Exponer acciones a la Vista
 *  - NO contiene HTML
 *  - NO accede directamente al DOM
 */

import { ref } from 'vue'
import {
  getProductos,
  buscarProductosApi
} from '@/services/api.js'

export default function ProductsPresenter() {

  /* =========================================
   * ESTADO
   * ========================================= */

  const productos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Nuevo: término de búsqueda
  const terminoBusqueda = ref('')

  // NUEVO: estado de paginación
  const paginaActual = ref(1)
  const porPagina = ref(6)
  const totalPaginas = ref(1)
  const totalResultados = ref(0)

  /* =========================================
   * MÉTODOS
   * ========================================= */

  /**
   * Cargar productos paginados
   */
  const cargarProductos = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await getProductos(
        paginaActual.value,
        porPagina.value
      )

      productos.value = data.productos ?? data
      totalPaginas.value = data.total_paginas ?? 1
      totalResultados.value = data.total_resultados ?? productos.value.length

    } catch (err) {
      error.value = 'Error al cargar productos'
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar productos con paginación
   */
  const buscarProductos = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await buscarProductosApi(
        terminoBusqueda.value,
        paginaActual.value,
        porPagina.value
      )

      productos.value = data.productos ?? data
      totalPaginas.value = data.total_paginas ?? 1
      totalResultados.value = data.total_resultados ?? productos.value.length

    } catch (err) {
      error.value = 'Error al buscar productos'
    } finally {
      loading.value = false
    }
  }

  /**
   * Cambiar página
   */
  const cambiarPagina = (nuevaPagina) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas.value
    ) return

    paginaActual.value = nuevaPagina

    // Decide qué acción usar
    terminoBusqueda.value
      ? buscarProductos()
      : cargarProductos()
  }

  /* =========================================
   * API PÚBLICA DEL PRESENTER
   * ========================================= */

  return {
    productos,
    loading,
    error,

    terminoBusqueda,

    paginaActual,
    totalPaginas,
    totalResultados,

    cargarProductos,
    buscarProductos,
    cambiarPagina
  }
}

