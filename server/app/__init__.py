from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow React frontend requests
    app.config["DEBUG"] = True
    
    from .routes import api
    app.register_blueprint(api)

    return app

