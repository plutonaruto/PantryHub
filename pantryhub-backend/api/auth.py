from flask import Blueprint, request, jsonify, g
from firebase_admin import auth
from auth.auth_helper import login_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/verify', methods = ['POST'])
def verify_token():
    if request.method == "OPTIONS":
        return None
    if request.path in ['/register']:
        return None
    auth_header = request.headers.get('Authorization', '')
    print("Authorization header:", auth_header)
    if not auth_header.startswith('Bearer '):
        return jsonify({"error": "Token is missing"}), 401
    token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(token)
        request.user_id = decoded_token['uid']

        g.current_user = {
            "uid": decoded_token['uid'],
            "email": decoded_token.get('email'),
            "role": decoded_token.get('role', 'user')  # default to 'user' if not present
        }
    except Exception as e:
        print("Token verification failed:", str(e))
        return jsonify({"error": "Invalid token"}), 401  # Unauthorized if token is 
    
    print("Authorization header:", request.headers.get('Authorization'))

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    try:
        user = auth.create_user(
            email=email,
            password=password,
            name=name
        )
        return jsonify({"message": f"User {user.uid} created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400