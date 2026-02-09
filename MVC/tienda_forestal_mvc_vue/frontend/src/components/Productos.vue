<!-- ============================================================
   COMPONENTE Productos.vue
   --------------------------------------------------------------
   Vista principal del catálogo:
   - Consulta productos al backend Flask mediante api.js
   - Soporta búsqueda, filtros, ordenación y paginación
   - Usa Composition API (Vue 3)
   - Explicado línea por línea para que sea didáctico en clase
   ============================================================ -->

<template>
  <div>
    <h2>Catálogo de Productos</h2>

    <!-- ===============================
         BÚSQUEDA GENERAL (campo + botón)
         =============================== -->
    <input
      type="text"
      v-model="terminoBusqueda"
      placeholder="Sólo nombre, tipo o marca - DiegoEspMig"
      @keyup.enter="accionSearch"
      class="search-input"
    />
    <button @click="accionSearch">Search</button>

    <!-- ===============================
         FILTROS AVANZADOS
         =============================== -->
    <div class="filtros">
      <input
        type="text"
        v-model="filtroTipo"
        placeholder="Tipo (motosierra, taladro…)"
      />
      <input
        type="text"
        v-model="filtroMarca"
        placeholder="Marca (STIHL, Makita…)"
      />
      <input
        type="number"
        v-model.number="precioMin"
        placeholder="Precio mínimo"
      />
      <input
        type="number"
        v-model.number="precioMax"
        placeholder="Precio máximo"
      />

      <select v-model="orden">
        <option value="">Orden</option>
        <option value="asc">Precio ascendente</option>
        <option value="desc">Precio descendente</option>
      </select>

      <button @click="accionFiltrar">Filtrar</button>
    </div>

    <!-- ===============================
         ESTADO DE CARGA
         =============================== -->
    <div v-if="loading">Cargando productos...</div>

    <!-- ===============================
         LISTA DE PRODUCTOS
         =============================== -->
    <div v-else class="grid">
      <div v-for="p in productos" :key="p.id" class="card">
        <img :src="'/img/' + p.imagen" :alt="p.nombre" />
        <h3>{{ p.nombre }}</h3>
        <p>{{ p.descripcion }}</p>
        <strong>{{ p.precio }} bucks</strong><br />
        <small>Stock: {{ p.stock }}</small>
      </div>
    </div>

    <!-- ===============================
         PAGINACIÓN
         =============================== -->
    <div class="paginacion" v-if="totalPaginas > 1">
      <button
        @click="cambiarPagina(paginaActual - 1)"
        :disabled="paginaActual === 1"
      >
        ← Anterior
      </button>

      <button
        v-for="n in totalPaginas"
        :key="n"
        @click="cambiarPagina(n)"
        :class="{ activo: n === paginaActual }"
      >
        {{ n }}
      </button>

      <button
        @click="cambiarPagina(paginaActual + 1)"
        :disabled="paginaActual === totalPaginas"
      >
        Siguiente →
      </button>
    </div>

    <!-- Información adicional -->
    <p v-if="totalResultados > 0" style="color: forestgreen;font-size: 200%;" >
      Mostrando página {{ paginaActual }} de {{ totalPaginas }} ({{
        totalResultados
      }}
      productos en total)
    </p>
  </div>
</template>

<script setup>
/* ============================================================
   IMPORTS
   ============================================================ */
import { ref } from "vue";

// Importamos las funciones del servicio api.js
// Estas funciones ya saben cómo llamar al backend Flask
import {
  obtenerProductos,
  filtrarProductos,
  buscarProductos,
} from "@/services/api";

/* ============================================================
   VARIABLES REACTIVAS DEL COMPONENTE
   ============================================================ */

// Lista de productos cargados desde el backend
const productos = ref([]);

// Indicador de carga (muestra "Cargando...")
const loading = ref(true);

// Campos de búsqueda y filtrado
const terminoBusqueda = ref("");
const filtroTipo = ref("");
const filtroMarca = ref("");
const precioMin = ref(null);
const precioMax = ref(null);
const orden = ref("");

// Paginación gestionada por el backend
const paginaActual = ref(1);
const porPagina = ref(10);
const totalPaginas = ref(1);
const totalResultados = ref(0);

/* ============================================================
   FUNCIÓN PRINCIPAL: cargar la lista de productos filtrados
   ------------------------------------------------------------
   - Llama a /api/productos/filtrar
   - Actualiza la lista, total de páginas y total de resultados
   ============================================================ */
const cargarProductos = async () => {
  loading.value = true;

  try {
    // Llamamos a api.js con los parámetros actuales
    const data = await filtrarProductos({
      pagina: paginaActual.value,
      por_pagina: porPagina.value,
      tipo: filtroTipo.value,
      marca: filtroMarca.value,
      precio_min: precioMin.value,
      precio_max: precioMax.value,
      ordenar: orden.value,
    });

    // El backend devuelve un objeto con:
    // productos, pagina_actual, total_paginas, total_resultados
    productos.value = data.productos;
    paginaActual.value = data.pagina_actual;
    totalPaginas.value = data.total_paginas;
    totalResultados.value = data.total_resultados;
  } catch (e) {
    console.error("Error cargando productos:", e);
    productos.value = [];
  }

  loading.value = false;
};

/* ============================================================
   FUNCIÓN: realizar búsqueda general
   ------------------------------------------------------------
   - Llama a /api/productos/buscar?termino=...
   - Se ejecuta al pulsar ENTER o el botón Buscar
   ============================================================ */
const accionSearch = async () => {
  paginaActual.value = 1;

  // Si no hay texto, recargamos el catálogo normal
  if (!terminoBusqueda.value.trim()) {
    cargarProductos();
    return;
  }

  loading.value = true;

  try {
    const resultados = await buscarProductos(terminoBusqueda.value);
    productos.value = resultados;

    // La búsqueda devuelve un array simple
    totalResultados.value = resultados.length;
    totalPaginas.value = Math.ceil(resultados.length / porPagina.value);
  } catch (e) {
    console.error("Error en la búsqueda:", e);
  }

  loading.value = false;
};

/* ============================================================
   FUNCIÓN: filtrado (reinicia a página 1)
   ============================================================ */
const accionFiltrar = () => {
  paginaActual.value = 1;
  cargarProductos();
};

/* ============================================================
   FUNCIÓN: cambiar página (botones numerados)
   ============================================================ */
const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return;
  paginaActual.value = nuevaPagina;
  cargarProductos();
};

/* ============================================================
   CARGA INICIAL DEL COMPONENTE
   ============================================================ */
cargarProductos();
</script>

<style scoped>
/* ---- DISEÑO BÁSICO PARA GRID DE PRODUCTOS ---- */

.grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
  gap: 2rem; }

.card { background: repeating-linear-gradient( 
  to right, #ffffff 0, 
  #ffffff calc(100% / 13), 
  #00a651 calc(100% / 13), 
  #00a651 calc(2 * (100% / 13)) 
  ); 
  padding: 1.2rem; border-radius: 12px; 
  border: 3px dashed #00a651; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
}

.card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18); 
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}

.filtros {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.paginacion button { 
  margin: 0 4px; 
  padding: 0.5rem 0.9rem; 
  border-radius: 6px; 
  border: 1px solid #ccc; 
  background: #f7f7f7; 
  cursor: pointer; 
  transition: background 0.2s ease, color 0.2s ease; 
}

.paginacion button:hover { 
  background: #eaeaea; 
}

button.activo {
  background-color: gold;
  color: darkolivegreen;
  font-weight: bold;
  border-color: goldenrod;
}
</style>
