import sys
import os
import json
import requests
import time
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

import firebase_admin
from firebase_admin import credentials, auth, app_check
import flask
import jwt
from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime
from base import Base
from sqlalchemy import Column, Integer, String, DateTime 
from models import Item
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sqlalchemy.sql import func
from flask_migrate import Migrate
from flask import send_from_directory
from auth.auth_helper import login_required
from flask_apscheduler import APScheduler

load_dotenv()

SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")

if not firebase_admin._apps:
    if os.getenv("USE_FIREBASE_EMULATOR") == "1":
        os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099"
        firebase_admin.initialize_app(options={"projectId": "pantryhub-login-and-flow"})
    else:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)


os.environ["GOOGLE_CLOUD_PROJECT"] = "pantryhub-login-and-flow"

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
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

# Scheduler for expiry scan
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

@scheduler.task('interval', id='expiry_scan', hours=24)
def scan_for_expired_items():
    with app.app_context():
        today = date.today()
        expired_items = Item.query.filter(Item.expiry_date < today).all()
        for item in expired_items:
            print(f"{item.name} (ID: {item.id}) has expired.")

@app.route("/")
def index():
    return "Backend is up"

# ----------------------
# Login & Register
# ----------------------

@app.route('/verify', methods = ['POST'])
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

@app.route('/register', methods=['POST'])
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

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['MAX_PHOTO_SIZE'] = 16 * 1024 * 1024

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print("DB URL:", app.config['SQLALCHEMY_DATABASE_URI'])

db = SQLAlchemy(app) #interact with ur database
migrate = Migrate(app, db) #for any future changes

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ----------------------
# Tables
# ----------------------

# Inventory table
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True) #item id
    name = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    room_no = db.Column(db.String(50), nullable=False)
    owner_id = db.Column(db.String, nullable=False) # user/owner id
    pantry_id = db.Column(db.Integer, nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    image_url = db.Column(db.String, nullable=True)

    def __repr__(self): # for debugging
        return f'<MarketplaceItem {self.id}>'

# Marketplace table
class MarketplaceItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    room_no = db.Column(db.String(50), nullable=False)
    owner_id = db.Column(db.String, nullable=False)
    pantry_id = db.Column(db.Integer, nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    image_url = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    claimed = db.Column(db.Boolean, default=False)
    instructions = db.Column(db.Text, nullable=False)
    pickup_location = db.Column(db.String(100), nullable=True)

    def __repr__(self): # for debugging
        return f'<MarketplaceItem {self.id}>'
    
# Equipment table 
class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(150), nullable=False)
    pantry_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    usage_instructions = db.Column(db.Text, nullable=True)
    available = db.Column(db.Boolean, nullable=False, default=True)
    used_by = db.Column(db.String, nullable=True) # user id of who checked it out
    check_in_date = db.Column(db.DateTime, nullable=True) # when it was checked in
    check_out_date = db.Column(db.DateTime, nullable=True) # when it was checked out

    def __repr__(self): # for debugging
        return f'<Equipment {self.id}>'

#Equipment Log table 
class EquipmentLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.id'), nullable=False)
    user_id = db.Column(db.String, nullable=False)
    action = db.Column(db.String, nullable=False)  # "check_in" or "check_out"
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<EquipmentLog {self.id} {self.action} {self.equipment_id} {self.user_id}>'

# Notification table 
class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    read = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

#mark notif as read
@app.route('/notifications/<int:notification_id>/mark-read', methods=['PATCH'])
@login_required
def mark_notification_read(notification_id):
    try:
        notif = Notification.query.get(notification_id)

        if not notif:
            return jsonify({"error": "Notification not found"}), 404

        #check ownership?
        current_user_id = g.current_user.get('uid')
        if notif.user_id != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403

        notif.read = True
        db.session.commit()
        return jsonify({"message": "Notification marked as read"}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error marking notification as read: {str(e)}"}), 500



# ----------------------
# Inventory Endpoints
# ----------------------
#create new post

@app.route('/items', methods=['POST'])
@login_required
#@check_role("create")
def create():
    data = request.form.to_dict()
    print("Received FORM:", data)
    file = request.files.get('image')

    #optional image handling
    from supabase_storage import upload_file_to_supabase

    image_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        content_type = file.mimetype
        file_bytes = file.read()
        if not file_bytes:
            return jsonify({"error": "Empty file"}), 400

        print("Uploading inventory image to Supabase...")
        image_url = upload_file_to_supabase(file_bytes, filename, content_type)
        print("Supabase URL:", image_url)

    required_fields = ['name', 'quantity', 'room_no', 'owner_id', 'pantry_id', 'expiry_date']
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        item = Item(
            name=data['name'],
            quantity=data.get('quantity', 1),
            image_url = image_url,
            room_no=data['room_no'],
            owner_id=data['owner_id'],
            pantry_id=data['pantry_id'],
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date(),
            created_at=datetime.utcnow()
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({"message": "Item created successfully", "id": item.id}), 201

    except Exception as e:
        return jsonify({"error": f"Error creating item: {str(e)}"}), 400


@app.route('/items/<int:item_id>', methods=['GET'])
@login_required
def get(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    return jsonify({
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "room_no": item.room_no,
        "owner_id": item.owner_id,
        "pantry_id": item.pantry_id,
        "image_url": item.image_url,
        "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None
    })

@app.route('/items/<int:item_id>', methods=['PATCH'])
@login_required
def edit(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": f"Item not found"}), 404

    name = request.form.get('name')
    description = request.form.get('description')
    expiry_date = request.form.get('expiry_date')
    quantity = request.form.get('quantity')
    image = request.files.get('image')

    if not item:
        return jsonify({"error": "Item not found"}), 404

    if name:
        item.name = name
    if quantity:
        item.quantity = quantity

    if image and allowed_file(image.filename):
        from supabase_storage import upload_file_to_supabase
        filename = secure_filename(image.filename)
        content_type = image.mimetype
        file_bytes = image.read()
        if not file_bytes:
            return jsonify({"error": "Empty file"}), 400

        image_url = upload_file_to_supabase(file_bytes, filename, content_type)
        item.image_url = image_url


    if expiry_date:
        item.expiry_date = expiry_date

    if item.quantity == 0:
        db.session.delete(item)

    db.session.commit()
    
    return jsonify({"message": f"Item {item.id} updated"}, 200)


#delete an item
@app.route('/items/<int:item_id>', methods=['DELETE'])
@login_required
#@check_role("delete")
def delete(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": f"Item not found"}), 404

    db.session.delete(item) #remove from db
    db.session.commit()

    return jsonify({"message": f"Item {item.id} deleted."})

#update qty of item
@app.route('/items/<int:item_id>', methods=['PUT'])
@login_required
def update_quantity(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    data = request.get_json()
    new_qty = data.get('quantity')

    if new_qty is None or not isinstance(new_qty, int) or new_qty < 0:
        return jsonify({"error": "Invalid quantity"}), 400

    item.quantity = new_qty
    db.session.commit()

    return jsonify({"message": "Quantity updated", "quantity": item.quantity}), 200


#fetch all items for user 
@app.route('/items/<string:owner_id>', methods=['GET'])
@login_required
#@check_role("view_own_items")
def get_all_items(owner_id):
    try:
        print("Fetching items for owner_id:", owner_id) #debug
        items = Item.query.filter_by(owner_id= owner_id).all()
        result = []
        for item in items:
            result.append({
                "id": item.id,
                "name": item.name,
                "quantity": item.quantity,
                "image_url": item.image_url,
                "room_no": item.room_no,
                "owner_id": item.owner_id,
                "pantry_id": item.pantry_id,
                "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None,
            })
        return jsonify(result), 200
    except Exception as e:
        print("Error in GET /items/<owner_id>:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500

#fetch all items for admin
@app.route('/items', methods=['GET'])
@login_required
def get_all_items_admin():
    items = Item.query.all()
    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "quantity": item.quantity,
            "image_url": item.image_url,
            "room_no": item.room_no,
            "owner_id": item.owner_id,
            "pantry_id": item.pantry_id,
            "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None,
        })
    return jsonify(result), 200

# ----------------------
# Marketplace Endpoints
# ----------------------

# for items with no image input
@app.route('/placeholder.jpg')
def placeholder_image():
    return send_from_directory('static', 'placeholder.jpg')

#create new post
@app.route('/marketplace', methods=['POST'])
@login_required
def create_marketitem():
    data = request.form.to_dict()
    file = request.files.get('image')

    # Import here to avoid circular imports
    from supabase_storage import upload_file_to_supabase

    public_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        content_type = file.mimetype
        file_bytes = file.read()
        if not file_bytes:
            return jsonify({"error": "Empty file"}), 400

        print("Uploading to Supabase...")
        public_url = upload_file_to_supabase(file_bytes, filename, content_type)
        print("Supabase URL:", public_url)

    required_fields = [
        'name', 'quantity', 'room_no', 'owner_id',
        'pantry_id', 'expiry_date', 'pickup_location', 'instructions'
    ]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        market_item = MarketplaceItem(
            name=data['name'],
            quantity=int(data.get('quantity', 1)),
            room_no=data['room_no'],
            owner_id=data['owner_id'],
            pantry_id=int(data['pantry_id']),
            image_url=public_url,
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date(),
            created_at=datetime.utcnow(),
            description=data.get('description', ''),
            claimed=False,
            instructions=data['instructions'],
            pickup_location=data['pickup_location']
        )
        db.session.add(market_item)
        db.session.commit()

        return jsonify({"message": "Item created successfully", "id": market_item.id}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error creating item: {str(e)}"}), 500

@app.route('/marketplace/<int:market_item_id>', methods=['PATCH'])
def update_marketplace_item(market_item_id):
    market_item = MarketplaceItem.query.get(market_item_id)
    if not market_item:
        return jsonify({"error": "Item not found"}), 404

    data = request.get_json()
    print("PATCH data:", data)

    claimer_id = data.get('claimer_id')
    claimed = data.get('claimed')

    # Update fields
    if 'quantity' in data:
        if data['quantity'] is None:
            return jsonify({"error": "Quantity cannot be null"}), 400
        try:
            market_item.quantity = int(data['quantity'])
        except ValueError:
            return jsonify({"error": "Quantity must be a number"}), 400

    if 'claimed' in data:
        market_item.claimed = bool(claimed)

    if 'name' in data:
        market_item.name = data['name']
    if 'room_no' in data:
        market_item.room_no = data['room_no']
    if 'owner_id' in data:
        market_item.owner_id = data['owner_id']
    if 'pantry_id' in data:
        market_item.pantry_id = data['pantry_id']
    if 'image_url' in data:
        market_item.image_url = data['image_url']
    if 'expiry_date' in data:
        market_item.expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
    if 'description' in data:
        market_item.description = data['description']
    if 'instructions' in data:
        market_item.instructions = data['instructions']
    if 'pickup_location' in data:
        market_item.pickup_location = data['pickup_location']

    # If quantity hits 0, delete item and return immediately
    if market_item.quantity == 0:
        db.session.delete(market_item)
        db.session.commit()
        return jsonify({"message": f"Item {market_item.id} deleted"}), 200

    db.session.commit()

    # If just claimed, create notifications
    if claimed and claimer_id:
        claimer_notif = Notification(
            user_id=claimer_id,
            type="CLAIM_CONFIRMED",
            message=f"You claimed '{market_item.name}'. Pickup instructions: {market_item.instructions}",
            timestamp=datetime.utcnow(),
            read=False
        )
        owner_notif = Notification(
            user_id=market_item.owner_id,
            type="ITEM_CLAIMED",
            message=f"Your item '{market_item.name}' was claimed by another resident.",
            timestamp=datetime.utcnow(),
            read=False
        )
        db.session.add(claimer_notif)
        db.session.add(owner_notif)
        db.session.commit()

    # Always return something
    return jsonify({"message": f"Item {market_item.id} updated"}), 200



# get an item
@app.route('/marketplace/<int:item_id>', methods=['GET'])
def get_marketplace_item(item_id):
    item = MarketplaceItem.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    return jsonify({
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "room_no": item.room_no,
        "owner_id": item.owner_id,
        "pantry_id": item.pantry_id,
        "pickup_location": item.pickup_location,
        "expiry_date": item.expiry_date.strftime('%Y-%m-%d'),
        "description": item.description,
        "image_url": item.image_url or "/placeholder.jpg",
        "claimed": item.claimed,
        "instructions": item.instructions

    }), 200


#fetch all items
@app.route('/marketplace', methods=['GET'])
# @login_required
def get_marketplace_items():
    items = MarketplaceItem.query.filter_by(claimed=False).all() #fetch unclaimed only
    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "quantity": item.quantity,
            "room_no": item.room_no,
            "owner_id": item.owner_id,
            "pantry_id": item.pantry_id,
            "pickup_location": item.pickup_location,
            "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None,
            "description": item.description,
            "image_url": item.image_url or "/placeholder.jpg",
            "claimed": item.claimed,
            "instructions": item.instructions
        })
    return jsonify(result), 200

# ----------------------
# Equipment Endpoints
# ----------------------

@app.route('/equipment', methods=['POST'])
@login_required
def create_equipment():
    role = g.current_user.get('role') # check if it is admin
    if role != 'admin':
        return jsonify({"error": "Unauthorized. Admin access required"}), 403
    
    data = request.form.to_dict()
    print("Received FORM:", data)
    required_fields = ['label', 'pantry_id']

    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        equipment = Equipment(
            label=data['label'],
            pantry_id=data['pantry_id'],
            description=data.get('description', ''),
            usage_instructions=data.get('usage_instructions', ''),
            available = True,
            used_by = None, 
            check_in_date = None, 
            check_out_date = None
        
        )

        db.session.add(equipment)
        db.session.commit()
        return jsonify({"message": "Equipment created successfully", "id": equipment.id}), 201
    except Exception as e:
        return jsonify({"error": f"Error creating equipment: {str(e)}"}), 400
    

   
@app.route('/equipment', methods=['GET'])
@login_required
def get_all_equipment():
    equipments = Equipment.query.all()
    result = []
    for equipment in equipments :
        result.append({
            "id": equipment.id,
            "label": equipment.label,
            "pantry_id": equipment.pantry_id,
            "description": equipment.description,
            "usage_instructions": equipment.usage_instructions,
            "available": equipment.available,
            "used_by": equipment.used_by,
            "check_in_date": equipment.check_in_date,
            "check_out_date": equipment.check_out_date

        })
    return jsonify(result), 200

@app.route('/equipment/<int:equipment_id>', methods=['GET'])
@login_required
def get_equipment(equipment_id):
    equipment = Equipment.query.get(equipment_id)
    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404
    return jsonify({
        "id": equipment.id,
        "label": equipment.label,
        "pantry_id": equipment.pantry_id,
        "description": equipment.description,
        "usage_instructions": equipment.usage_instructions,
        "available": equipment.available,
        "used_by": equipment.used_by,
        "check_in_date": equipment.check_in_date,
        "check_out_date": equipment.check_out_date

        }), 200

@app.route('/equipment/<int:equipment_id>/checkin', methods=['PATCH', 'OPTIONS'])
@login_required
def check_in(equipment_id):
    if flask.request.method == 'OPTIONS':
        return '', 200
    
    equipment = Equipment.query.get(equipment_id)

    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404
    
    if not equipment.available: # equipment alr in use
        return jsonify({"error": "Equipment is currently in use"}), 400
    
    equipment.available = False
    equipment.used_by = g.current_user.get('uid') # set user using it 
    equipment.check_in_date = datetime.utcnow()
    equipment.check_out_date = None # reset check out date
    db.session.commit()

    log = EquipmentLog(
        equipment_id = equipment.id,
        user_id = g.current_user.get('uid'),
        action = "check_in",
        timestamp = datetime.utcnow()
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "message": f"Equipment {equipment.label} checked in successfully",
        "id": equipment.id,
        "owner": g.current_user.get('uid') # set user who checked it in
    }), 200

@app.route('/equipment/<int:equipment_id>/checkout', methods=['PATCH', 'OPTIONS'])
@login_required
def check_out(equipment_id):
    if flask.request.method == 'OPTIONS':
        return '', 200
    
    equipment = Equipment.query.get(equipment_id)

    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404
    
    if equipment.available: # equipment not in use
        return jsonify({"error": "Equipment is available"}), 400
    
    equipment.available = True
    equipment.used_by = None #reset user 
    equipment.check_in_date = None #reset check in date
    equipment.check_out_date = datetime.utcnow()
    db.session.commit()

    log = EquipmentLog(
        equipment_id = equipment.id,
        user_id = g.current_user.get('uid'),
        action = "check_out",
        timestamp = datetime.utcnow()
    )
    db.session.add(log)
    db.session.commit()
    

    return jsonify({
        "message": f"Equipment {equipment.label} checked out successfully",
        "id": equipment.id,
        "owner": g.current_user.get('uid') # set user who checked it out
    }), 200

@app.route('/equipment/log', methods = ['GET'])
@login_required
def get_equipment_log():
    if g.current_user.get('role') != "admin":
        return jsonify({"error": "Unauthorized. Admin access required"}), 403
    
    # only for admins
    logs = EquipmentLog.query.order_by(EquipmentLog.timestamp.desc()).all()
    result = []
    for log in logs:
        equipment = Equipment.query.get(log.equipment_id)
        if equipment:
            result.append({
                "id": log.id,
                "equipment_id": log.equipment_id,
                "user_id": log.user_id,
                "action": log.action,
                "timestamp": log.timestamp.isoformat(),
                "equipment_label": equipment.label,
                "pantry_id": equipment.pantry_id
            })

    return jsonify(result), 200


# ----------------------
# Notifications Endpoints
# ----------------------

@app.route('/notifications/<string:user_id>', methods=['GET'])
@login_required
def get_notifications(user_id):
    try:
        print(f"Fetching notifications for {user_id}")
        notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.timestamp.desc()).all()
        return jsonify([
            {
                'id': n.id,
                'type': n.type,
                'message': n.message,
                'timestamp': n.timestamp.isoformat(),
                'read': n.read
            }
            for n in notifications
        ]), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error fetching notifications: {str(e)}"}), 500

@app.route('/notifications', methods=['POST'])
@login_required
def create_notification():
    data = request.get_json()
    required_fields = ['user_id', 'type', 'message']

    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        notif = Notification(
            user_id=data['user_id'],
            type=data['type'],
            message=data['message'],
            timestamp=datetime.utcnow(),
            read=False
        )
        db.session.add(notif)
        db.session.commit()
        return jsonify({"message": "Notification created", "id": notif.id}), 201
    except Exception as e:
        return jsonify({"error": f"Error creating notification: {str(e)}"}), 400

# ----------------------
# Generator Endpoints
# ----------------------
@app.route('/api/generate-recipes', methods=['POST'])
def generate_recipes():
    data = request.get_json()
    ingredients = data.get('ingredients')

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    recipes = None

    recipes = recipes = try_together_ai_with_retry(ingredients, max_retries=3)
    if recipes:
        return jsonify({"recipes": recipes, "source": "together"})
    
    # fallback, use template recipes
    recipes = create_fallback_recipes(ingredients)
    return jsonify({"recipes": recipes, "source": "fallback"})

def try_together_ai_with_retry(ingredients, max_retries=3, base_delay=1):
    for attempt in range(max_retries):
        print(f"Together AI attempt {attempt + 1}/{max_retries}")
        
        recipes = try_together_ai(ingredients)
        if recipes:
            return recipes
        
        #wait before retrying
        if attempt < max_retries - 1:
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"Retrying in {delay:.2f} seconds...")
            time.sleep(delay)
    
    print(f"All {max_retries} attempts failed")
    return None

def try_together_ai(ingredients):
    api_key = os.environ.get('TOGETHER_API_KEY')
    if not api_key:
        return None
    
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a recipe generator. Respond only with valid JSON array format. Include measurements for the ingredients"
                },
                {
                    "role": "user",
                    "content": f"Generate 5 simple recipes using: {', '.join(ingredients)}. Format: [{{\"name\": \"Recipe Name\", \"ingredients\": [\"ingredient1\", \"ingredient2\"]}}]"
                }
            ],
            "max_tokens": 400,
            "temperature": 0.7
        }
        
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"Together AI Response Status: {response.status_code}")
        print(f"Together AI Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # extract JSON 
            start_idx = content.find('[')
            end_idx = content.rfind(']') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = content[start_idx:end_idx]
                return json.loads(json_str)
                
    except Exception as e:
        print(f"Together AI error: {e}")
        return None

def create_fallback_recipes(ingredients):
    if not ingredients:
        return []
    
    primary_ingredient = ingredients[0].title()
    
    # Recipe templates 
    recipe_templates = [
        {
            "name": f"Simple {primary_ingredient} Stir-fry",
            "ingredients": ingredients[:3] + ["vegetable oil", "salt", "black pepper", "garlic"]
        },
        {
            "name": f"Fresh {primary_ingredient} Salad", 
            "ingredients": ingredients[:2] + ["mixed greens", "olive oil", "lemon juice"]
        },
        {
            "name": f"Grilled {primary_ingredient}",
            "ingredients": ingredients[:2] + ["olive oil", "herbs", "salt", "pepper"]
        },
        {
            "name": f"Hearty {primary_ingredient} Soup",
            "ingredients": ingredients[:3] + ["vegetable broth", "onion", "carrots"]
        },
        {
            "name": f"Baked {primary_ingredient} Delight",
            "ingredients": ingredients[:2] + ["butter", "seasoning blend", "breadcrumbs"]
        }
    ]
    
    return recipe_templates

# Test endpoint
@app.route('/api/test-apis', methods=['GET'])
def test_apis():
    results = {}
    
    if os.environ.get('TOGETHER_API_KEY'):
        results['together'] = 'API key present'
    else:
        results['together'] = 'No API key'
    
    return jsonify(results)

# Quick recipe generation endpoint (no AI)
@app.route('/api/generate-recipes', methods=['POST', 'OPTIONS'])
def generate_recipes_simple():
    """Generate recipes using templates only - always works"""
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json(force=True)  
    ingredients = data.get('ingredients', []) if data else []
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
    
    recipes = create_fallback_recipes(ingredients)
    return jsonify({"recipes": recipes, "source": "template"})

if __name__ == '__main__':
    app.run()