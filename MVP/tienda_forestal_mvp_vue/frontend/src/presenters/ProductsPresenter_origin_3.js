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
import { getProductos, buscarProductosApi } from '@/services/api.js'

export default function ProductsPresenter() {

  /* =================================================
   * ESTADO
   * ================================================= */

  const productos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Nuevo: término de búsqueda
  const terminoBusqueda = ref('')

  /* =================================================
   * ACCIONES
   * ================================================= */

  /**
   * Cargar todos los productos
   */
  const cargarProductos = async () => {
    loading.value = true
    error.value = null

    try {
      productos.value = await getProductos()
    } catch (err) {
      error.value = 'Error al cargar los productos'
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar productos por término
   */
  const buscarProductos = async () => {
    // Si no hay término, mostramos todo
    if (!terminoBusqueda.value.trim()) {
      cargarProductos()
      return
    }

    loading.value = true
    error.value = null

    try {
      productos.value = await buscarProductosApi(terminoBusqueda.value)
    } catch (err) {
      error.value = 'Error al buscar productos'
    } finally {
      loading.value = false
    }
  }

  /* =================================================
   * API DEL PRESENTER (lo que ve la Vista)
   * ================================================= */

  return {
    productos,
    loading,
    error,
    terminoBusqueda,
    cargarProductos,
    buscarProductos
  }
}
