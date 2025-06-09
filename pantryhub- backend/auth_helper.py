import firebase_admin
from functools import wraps       
from flask import request, jsonify, g  
from firebase_admin import auth    

def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        #take token out of http header
        header = request.headers.get("Authorization", "")
        parts  = header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        id_token = parts[1]

        try:
            decoded = auth.verify_id_token(id_token)
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        g.user_id = decoded["uid"]
        return f(*args, **kwargs)
    return wrapper
    



