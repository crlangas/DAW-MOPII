# Imagen base con Python
FROM python:3.11-slim

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos las dependencias
COPY requirements.txt .

# Instalamos los paquetes necesarios sin cache
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código fuente de la aplicación
COPY app/ ./app

# Exponemos el puerto 5000 para Flask
EXPOSE 5000

# Comando de arranque de la aplicación
CMD ["python", "app/run.py"]

