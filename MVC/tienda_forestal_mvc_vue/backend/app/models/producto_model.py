"""
Capa de Modelo (Model) del patrón MVC.
Aquí se gestiona el acceso y manipulación de los datos en la base de datos MySQL.
Incluimos funciones de búsqueda y filtrado.
"""

import MySQLdb
import os

# Función para obtener una conexión a la base de datos MySQL
def obtener_conexion():
    """
    Crea y devuelve una conexión a la base de datos usando las variables de entorno
    definidas en docker-compose.yml.
    """
    return MySQLdb.connect(
        host=os.getenv('MYSQL_HOST', 'db'),
        user=os.getenv('MYSQL_USER', 'mopii'),
        passwd=os.getenv('MYSQL_PASSWORD', 'daw'),
        db=os.getenv('MYSQL_DB', 'tienda_forestal'),
        charset='utf8mb4'
    )

# --- FUNCIONES CRUD (Create, Read, Update, Delete) ---

def obtener_productos():
    """Obtiene todos los productos de la base de datos."""
    conexion = obtener_conexion()
    cursor = conexion.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM productos;")
    productos = cursor.fetchall()
    conexion.close()
    return productos

def obtener_producto_por_id(id):
    """Devuelve un solo producto por su ID."""
    conexion = obtener_conexion()
    cursor = conexion.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM productos WHERE id = %s;", (id,))
    producto = cursor.fetchone()
    conexion.close()
    return producto

def crear_producto(datos):
    """Inserta un nuevo producto en la base de datos."""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    query = """
        INSERT INTO productos (nombre, tipo, marca, descripcion, precio, stock, imagen)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """
    cursor.execute(query, (
        datos['nombre'],
        datos['tipo'],
        datos['marca'],
        datos['descripcion'],
        datos['precio'],
        datos['stock'],
        datos['imagen']
    ))
    conexion.commit()
    conexion.close()
    return cursor.lastrowid

def actualizar_producto(id, datos):
    """Actualiza un producto existente por su ID."""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    query = """
        UPDATE productos
        SET nombre=%s, tipo=%s, marca=%s, descripcion=%s, precio=%s, stock=%s, imagen=%s
        WHERE id=%s;
    """
    cursor.execute(query, (
        datos['nombre'],
        datos['tipo'],
        datos['marca'],
        datos['descripcion'],
        datos['precio'],
        datos['stock'],
        datos['imagen'],
        id
    ))
    conexion.commit()
    conexion.close()
    return cursor.rowcount

def eliminar_producto(id):
    """Elimina un producto de la base de datos por su ID."""
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM productos WHERE id=%s;", (id,))
    conexion.commit()
    conexion.close()
    return cursor.rowcount

# --- FUNCIONES DE FILTRADO Y BÚSQUEDA ---

def buscar_productos(termino):
    """
    Busca productos cuyo nombre, tipo o marca contenga el término proporcionado.
    Se usa LIKE con comodines para coincidencias parciales.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor(MySQLdb.cursors.DictCursor)
    query = """
        SELECT * FROM productos
        WHERE nombre LIKE %s OR tipo LIKE %s OR marca LIKE %s;
    """
    like_term = f"%{termino}%"
    cursor.execute(query, (like_term, like_term, like_term))
    resultados = cursor.fetchall()
    conexion.close()
    return resultados


def filtrar_productos(tipo=None, marca=None, precio_min=None, precio_max=None, ordenar=None, pagina=1, por_pagina=10):
    """
    Filtra productos según varios criterios y permite paginación.
    
    Parámetros:
    - tipo: filtrar por tipo de producto (ej. 'motosierra')
    - marca: filtrar por marca
    - precio_min / precio_max: rango de precios
    - ordenar: 'asc' o 'desc' por precio
    - pagina: número de página (1 por defecto)
    - por_pagina: cantidad de productos por página (10 por defecto)
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor(MySQLdb.cursors.DictCursor)

    # Comenzamos construyendo la consulta base
    query = "SELECT * FROM productos WHERE 1=1"
    params = []

    # Añadimos filtros dinámicos según los parámetros
    if tipo:
        query += " AND tipo = %s"
        params.append(tipo)
    if marca:
        query += " AND marca = %s"
        params.append(marca)
    if precio_min:
        query += " AND precio >= %s"
        params.append(precio_min)
    if precio_max:
        query += " AND precio <= %s"
        params.append(precio_max)

    # Ordenación opcional
    if ordenar == "asc":
        query += " ORDER BY precio ASC"
    elif ordenar == "desc":
        query += " ORDER BY precio DESC"

    # --- PAGINACIÓN ---
    offset = (pagina - 1) * por_pagina
    query += " LIMIT %s OFFSET %s"
    params.extend([por_pagina, offset])

    cursor.execute(query, params)
    resultados = cursor.fetchall()
    conexion.close()
    return resultados
