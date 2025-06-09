import os
import firebase_admin
from firebase_admin import credentials
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("FIREBASE_CRED_PATH", "firebase-admin-key.json"))
    firebase_admin.initialize_app(cred)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = None

        # grab token from auth header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            id_token = auth_header.split(" ").pop()  # remove "Bearer " if included

        if not id_token:
            return jsonify({'error': 'Missing or invalid token'}), 401

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # user info to request
        except Exception as e:
            return jsonify({'error': f'Invalid token: {str(e)}'}), 401

        return f(*args, **kwargs)

    return decorated_function
