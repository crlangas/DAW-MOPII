"""
Punto de entrada principal del servidor Flask.
Registra los Blueprints (controladores) y arranca la aplicación.
"""

from flask import Flask
from flask_cors import CORS
from controllers.producto_controller import producto_blueprint
from config import Config

def create_app():
    # Instanciamos la aplicación Flask
    app = Flask(__name__)

    # Cargamos la configuración desde config.py
    app.config.from_object(Config)

    # Habilitamos CORS para que Vue.js (frontend) pueda acceder a la API
    CORS(app)

    # Registramos el Blueprint de productos
    app.register_blueprint(producto_blueprint, url_prefix='/api')

    return app

# Ejecutamos la aplicación en el puerto 5000
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
