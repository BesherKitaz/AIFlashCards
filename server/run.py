from app import create_app
from flask_cors import CORS
from flask import Flask, send_from_directory

app = create_app()
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Serve React build index.html for root and all non-API routes
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path.startswith("api/"):
        return "Not Found", 404
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
