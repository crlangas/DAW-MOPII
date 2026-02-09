import { ref } from 'vue'
import { obtenerProductos } from '@/services/api'

export default function ProductsPresenter() {

  /*
  =============================================
  ESTADO (State)
  =============================================
  */
  const productos = ref([])
  const loading = ref(false)

  // Búsqueda y filtros
  const terminoBusqueda = ref('')
  const filtroMarca = ref('')
  const filtroTipo = ref('')

  // Paginación
  const paginaActual = ref(1)
  const porPagina = ref(6)
  const totalPaginas = ref(1)

  /*
  =============================================
  FUNCIÓN CENTRAL
  =============================================
  */
  const cargarProductos = async () => {
    loading.value = true

    const params = {
      pagina: paginaActual.value,
      por_pagina: porPagina.value,
    }

    if (terminoBusqueda.value) params.termino = terminoBusqueda.value
    if (filtroMarca.value) params.marca = filtroMarca.value
    if (filtroTipo.value) params.tipo = filtroTipo.value

    try {
      const data = await obtenerProductos(params)

      /*
      El backend puede devolver:
      {
        productos: [],
        total_paginas: X
      }
      */
      productos.value = data.productos ?? data
      totalPaginas.value = data.total_paginas ?? 1

    } catch (error) {
      console.error('Error cargando productos', error)
    } finally {
      loading.value = false
    }
  }

  /*
  =============================================
  ACCIONES DEL USUARIO
  =============================================
  */
  const buscarProductos = () => {
    paginaActual.value = 1
    cargarProductos()
  }

  const paginaSiguiente = () => {
    if (paginaActual.value < totalPaginas.value) {
      paginaActual.value++
      cargarProductos()
    }
  }

  const paginaAnterior = () => {
    if (paginaActual.value > 1) {
      paginaActual.value--
      cargarProductos()
    }
  }

  /*
  =============================================
  API DEL PRESENTER
  =============================================
  */
  return {
    productos,
    loading,
    terminoBusqueda,
    filtroMarca,
    filtroTipo,
    paginaActual,
    totalPaginas,
    cargarProductos,
    buscarProductos,
    paginaSiguiente,
    paginaAnterior,
  }
}

