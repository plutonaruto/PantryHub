from functools import wraps
from flask import request, jsonify, g
from auth.roles import can_perform
from auth.jwt_utils import get_user_from_jwt 

def check_role(action):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authroization", "")
            token = auth_header.replace("Bearer ", "")

            user = get_user_from_jwt(token)
            if not user:
                return jsonify({"message" : "Unauthenticated"}), 401
            
            g.current_user = user

            if not can_perform(user["role"], action):
               return jsonify({"message": "Access Denied"}), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator
