from flask import Blueprint, request, jsonify
from app.models.users import User
from app.models.dbSetup import db
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from peewee import DoesNotExist
from app.secret_key import SECRET_KEY

bcrypt = Bcrypt()
auth = Blueprint('auth', __name__)

@auth.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    db.connect()
    if User.select().where(User.email == email).exists():
        db.close()
        return jsonify({'error': 'Email already exists'}), 400
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User.create(username=name, email=email, password_hash=password_hash)
    db.close()
    token = jwt.encode({'user_id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(days=1)}, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token, 'user': {'id': user.id, 'name': user.username, 'email': user.email}})

@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    db.connect()
    try:
        user = User.get(User.email == email)
        if not bcrypt.check_password_hash(user.password_hash, password):
            db.close()
            return jsonify({'error': 'Invalid credentials'}), 401
        token = jwt.encode({'user_id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(days=1)}, SECRET_KEY, algorithm='HS256')
        db.close()
        return jsonify({'token': token, 'user': {'id': user.id, 'name': user.username, 'email': user.email}})
    except DoesNotExist:
        db.close()
        return jsonify({'error': 'Invalid credentials'}), 401
