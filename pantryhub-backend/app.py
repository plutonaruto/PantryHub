import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from models import db
from flask_apscheduler import APScheduler
from datetime import datetime
from flask_socketio import SocketIO
from firebase_admin_init import *

load_dotenv()


import firebase_admin
from firebase_admin import credentials

#cred = credentials.Certificate("serviceAccountKey.json")
#firebase_admin.initialize_app(cred)

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAX_PHOTO_SIZE'] = 16 * 1024 * 1024


    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:3000",
                "https://pantry-hub.netlify.app",
                "https://pantryhub.onrender.com"
            ],
            "methods": ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    db.init_app(app)

    # register bps
    from api.inventory import inventory_bp
    from api.marketplace import marketplace_bp
    from api.notifications import notifications_bp
    from api.equipment import equipment_bp
    from api.auth_roles import auth_bp
    from api.recipes import recipes_bp

    app.register_blueprint(inventory_bp)
    app.register_blueprint(marketplace_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(equipment_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(recipes_bp)

    @app.route('/placeholder.jpg')
    def placeholder_image():
        return send_from_directory('static', 'placeholder.jpg')

    @app.route('/')
    def index():
        return "Backend is up"

    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()

    from api.notifications import scan_and_notify_expired_items

    @scheduler.task('interval', id='expiry_scan', hours=24)
    def scan_for_expired_items():
        with app.app_context():
            from models import Item
            today = datetime.utcnow().date()
            expired_items = Item.query.filter(Item.expiry_date < today).all()
            scan_and_notify_expired_items(expired_items)

    return app

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=3000)
