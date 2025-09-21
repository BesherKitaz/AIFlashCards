from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from peewee import fn, JOIN
import os
import base64
from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime, timezone
from app.models.FC_set import FC_Set
from app.models.cards import Card
from app.models.users import User
from app.models.dbSetup import db
from app.secret_key import SECRET_KEY 
from app.logic.generate_cards_from_photo import generate_flashcards_from_photo
import jwt
import json

api = Blueprint("api", __name__)


# Card Sets endpoints
@api.route("/api/card-sets/", methods=["GET"])
def get_card_sets():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        try:
            db.connect()
            query = (
                FC_Set
                .select(FC_Set, fn.COUNT(Card.id).alias('card_count'))
                .join(Card, JOIN.LEFT_OUTER)  
                .where(FC_Set.owner == user_id)
                .group_by(FC_Set)
            )

            sets_data = []

            for fc_set in query:
                sets_data.append({
                    "id": fc_set.id,
                    "name": fc_set.name,
                    "description": fc_set.description,
                    "cardCount": fc_set.card_count,  # Match frontend expectation
                    "created_at": fc_set.created_at.isoformat() if fc_set.created_at else None,
                    "updated_at": fc_set.updated_at.isoformat() if fc_set.updated_at else None
                })
            
            db.close()
            return jsonify(sets_data)
        except Exception as e:
            print(e)
            db.close()
            return jsonify({"error": str(e)}), 500
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

@api.route("/api/card-sets/", methods=["POST"])
def create_card_set():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    token = auth_header.split(" ")[1]
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id = payload['user_id']
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    if not name:
        return jsonify({"error": "Set name is required"}), 400
    db.connect()
    try:
        user = User.get(User.id == user_id)
    except User.DoesNotExist:
        user = User.create(
            username=f"user_{user_id}",
            email=f"user{user_id}@example.com",
            password_hash="dummy_hash"
        )
    fc_set = FC_Set.create(
        name=name,
        description=description,
        owner=user,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.close()
    return jsonify({
        "id": fc_set.id,
        "name": fc_set.name,
        "description": fc_set.description,
        "created_at": fc_set.created_at.isoformat(),
        "updated_at": fc_set.updated_at.isoformat()
    }), 201
"""     except Exception as e:
        print(f"Error in create_card_set: {e}")
        db.close()
        return jsonify({"error": str(e)}), 500 """

@api.route("/api/card-sets/<int:set_id>", methods=["GET"])
def get_card_set(set_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        db.connect()
        fc_set = FC_Set.get_by_id(set_id)
        # Verify ownership
        if fc_set.owner.id != user_id:
            db.close()
            return jsonify({"error": "Unauthorized"}), 403
        set_data = {
            "id": fc_set.id,
            "name": fc_set.name,
            "description": fc_set.description,
            "created_at": fc_set.created_at.isoformat(),
            "updated_at": fc_set.updated_at.isoformat()
        }
        db.close()
        return jsonify(set_data)
    except FC_Set.DoesNotExist:
        db.close()
        return jsonify({"error": "Set not found"}), 404
    except Exception as e:
        db.close()
        return jsonify({"error": str(e)}), 500

@api.route("/api/card-sets/<int:set_id>", methods=["DELETE"])
def delete_card_set(set_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        db.connect()
        fc_set = FC_Set.get_by_id(set_id)
        # Verify ownership
        if fc_set.owner.id != user_id:
            db.close()
            return jsonify({"error": "Unauthorized"}), 403
        # Delete all cards in this set first
        Card.delete().where(Card.fc_set == fc_set).execute()
        # Delete the set
        fc_set.delete_instance()
        db.close()
        return jsonify({"message": "Set deleted successfully"})
    except FC_Set.DoesNotExist:
        db.close()
        return jsonify({"error": "Set not found"}), 404
    except Exception as e:
        db.close()
        return jsonify({"error": str(e)}), 500

# Cards endpoints
@api.route("/api/card-sets/<int:set_id>/cards", methods=["GET"])
def get_cards(set_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    token = auth_header.split(" ")[1]
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id = payload['user_id']
    db.connect()
    fc_set = FC_Set.get_by_id(set_id)
    # Verify ownership
    if fc_set.owner.id != user_id:
        db.close()
        return jsonify({"error": "Unauthorized"}), 403
    cards = Card.select().where(Card.fc_set == fc_set)
    cards_data = []
    for card in cards:
        cards_data.append({
            "id": card.id,
            "front": card.question,
            "back": card.answer,
            "setId": set_id,
            "created_at": card.created_at.isoformat(),
            "updated_at": card.updated_at.isoformat()
        })
    db.close()
    return jsonify(cards_data)



@api.route("/api/card-sets/<int:set_id>/cards", methods=["POST"])
def add_cards(set_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        data = request.get_json()
        cards_data = data.get('cards', [])
        if not cards_data:
            return jsonify({"error": "No cards provided"}), 400
        db.connect()
        fc_set = FC_Set.get_by_id(set_id)
        # Verify ownership
        if fc_set.owner.id != user_id:
            db.close()
            return jsonify({"error": "Unauthorized"}), 403
        created_cards = []
        for card_data in cards_data:
            front = card_data.get('front', '').strip()
            back = card_data.get('back', '').strip()
            if front and back:
                card = Card.create(
                    question=front,
                    answer=back,
                    fc_set=fc_set,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc)
                )
                created_cards.append({
                    "id": card.id,
                    "front": card.question,
                    "back": card.answer,
                    "setId": set_id
                })
        db.close()
        return jsonify({"cards": created_cards, "count": len(created_cards)}), 201
    except FC_Set.DoesNotExist:
        db.close()
        return jsonify({"error": "Set not found"}), 404
    except Exception as e:
        db.close()
        return jsonify({"error": str(e)}), 500

@api.route("/api/cards/<int:card_id>", methods=["PUT"])
def update_card(card_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        data = request.get_json()
        front = data.get('front', '').strip()
        back = data.get('back', '').strip()
        if not front or not back:
            print("Both front and back are required")
            return jsonify({"error": "Both front and back are required"}), 400
        db.connect()
        card = Card.get_by_id(card_id)
        # Verify ownership through the card's set
        if card.fc_set.owner.id != user_id:
            db.close()
            print("Unauthorized access to update card")
            return jsonify({"error": "Unauthorized"}), 403
        card.question = front
        card.answer = back
        card.updated_at = datetime.now(timezone.utc)
        card.save()
        updated_card = {
            "id": card.id,
            "front": card.question,
            "back": card.answer,
            "setId": card.fc_set.id,
            "updated_at": card.updated_at.isoformat()
        }
        db.close()
        return jsonify(updated_card)
    except Card.DoesNotExist:
        db.close()
        return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        db.close()
        return jsonify({"error": str(e)}), 500

@api.route("/api/cards/<int:card_id>", methods=["DELETE"])
def delete_card(card_id):
    try:
        db.connect()
        card = Card.get_by_id(card_id)
        card.delete_instance()
        
        db.close()
        return jsonify({"message": "Card deleted successfully"})
    except Card.DoesNotExist:
        print(f"Card not found for deletion with id: {card_id}")
        db.close()
        return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        print(f"Error in delete_card: {e}")
        db.close()
        return jsonify({"error": str(e)}), 500

# Image processing endpoint
@api.route("/api/process-image/", methods=["POST"])
def process_image():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload['user_id']
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        file = request.files['image']
        set_id = request.form.get('setId')
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            # Process the image with AI
            cards_data = generate_flashcards_from_photo(file)
            # If setId is provided, save the cards to the database
            if set_id:
                db.connect()
                try:
                    fc_set = FC_Set.get_by_id(int(set_id))
                    # Verify ownership
                    if fc_set.owner.id != user_id:
                        db.close()
                        return jsonify({"error": "Unauthorized"}), 403
                    created_cards = []
                    for card_data in cards_data:
                        card = Card.create(
                            question=card_data['front'],
                            answer=card_data['back'],
                            fc_set=fc_set,
                            created_at=datetime.now(timezone.utc),
                            updated_at=datetime.now(timezone.utc)
                        )
                        created_cards.append({
                            "id": card.id,
                            "front": card.question,
                            "back": card.answer,
                            "setId": int(set_id)
                        })
                    db.close()
                    return jsonify({"cards": created_cards})
                except FC_Set.DoesNotExist:
                    db.close()
                    return jsonify({"error": "Set not found"}), 404
            else:
                # Return cards without saving (for create new set flow)
                formatted_cards = []
                for i, card_data in enumerate(cards_data):
                    formatted_cards.append({
                        "id": f"temp_{i}",
                        "front": card_data['front'],
                        "back": card_data['back']
                    })
                return jsonify({"cards": formatted_cards})
        return jsonify({"error": "Invalid file format"}), 400
    except Exception as e:
        if 'db' in locals():
            db.close()
        print(f"Error in process_image: {e}")
        return jsonify({"error": str(e)}), 500

@api.route("/api/score/<int:card_id>", methods=["PUT"])
def update_card_score(card_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401    
    try:
        db.connect()
        card = Card.get_by_id(card_id)
        data = request.get_json()
        remembered = data.get('remembered')
        card.review(remembered)
        return jsonify({
            "id": card.id,
            "front": card.question,
            "back": card.answer,
            "remembered": card.remembered
        })
    except Card.DoesNotExist:
        db.close()
        return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        db.close()
        return jsonify({"error": str(e)}), 500