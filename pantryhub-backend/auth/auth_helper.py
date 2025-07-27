from functools import wraps
from flask import request, jsonify, g, current_app
from firebase_admin import auth as firebase_auth

def verify_token():
    if current_app.debug:
        print(">>> verify_token called")

    auth_header = request.headers.get("Authorization", "")
    parts = auth_header.split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None, jsonify({"error": "Missing or invalid Authorization header"}), 401

    id_token = parts[1]
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        g.user_id = decoded["uid"]
        g.current_user = {
            "uid": decoded["uid"],
            "email": decoded.get("email"),
            "role": decoded.get("role", "user")
        }
        return decoded, None, None
    except Exception as e:
        if current_app.debug:
            print("Token verification error:", repr(e))
        return None, jsonify({"error": f"Invalid or expired token: {str(e)}"}), 401


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if request.method == "OPTIONS":
            return '', 200

        _, error_response, status_code = verify_token()
        if error_response:
            return error_response, status_code

        return f(*args, **kwargs)

    return wrapper
