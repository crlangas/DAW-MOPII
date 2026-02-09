/**
 * api.js
 * -----------------------------------------
 * Capa de acceso a la API (datos del backend Flask)
 * En MVP: esta capa SOLO se encarga de pedir datos
 * 
 * - Centraliza todas las llamadas HTTP
 * - Oculta detalles del backend al Presenter
 */

import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

/* =========================================
 * PRODUCTOS
 * ========================================= */

/**
 * Obtener productos paginados
 */
export const getProductos = async (pagina = 1, porPagina = 10) => {
  const res = await api.get('/productos', {
    params: {
      pagina,
      por_pagina: porPagina
    }
  })
  return res.data
}

/**
 * Buscar productos (con o sin paginación)
 */
export const buscarProductosApi = async (
  termino,
  pagina = 1,
  porPagina = 10
) => {
  const res = await api.get('/productos/buscar', {
    params: {
      termino,
      pagina,
      por_pagina: porPagina
    }
  })
  return res.data
}

