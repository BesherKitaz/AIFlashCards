from flask import Blueprint, jsonify

api = Blueprint("api", __name__)

@api.route("/api/", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from F!"})
