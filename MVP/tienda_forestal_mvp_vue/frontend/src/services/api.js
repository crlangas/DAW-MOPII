import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

/*
=================================================
OBTENER PRODUCTOS (MVP)
=================================================
Este método sirve para:
- listado normal
- búsqueda
- filtros
- paginación

El Presenter decide QUÉ pasar.
*/
export async function obtenerProductos(params = {}) {
  const response = await api.get('/productos', { params })
  return response.data
}

