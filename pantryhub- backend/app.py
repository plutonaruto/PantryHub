import os
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
from models import Item # Ensure the Item model is imported
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sqlalchemy.sql import func
from flask_migrate import Migrate
from flask import send_from_directory
from auth.auth_helper import login_required


os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099"
firebase_app = firebase_admin.initialize_app(options={
    "projectId": "pantryhub-login-and-flow"
}) 

load_dotenv()

os.environ["GOOGLE_CLOUD_PROJECT"] = "pantryhub-login-and-flow"

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.before_request
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
    

UPLOADED_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOADED_FOLDER'] = UPLOADED_FOLDER
app.config['MAX_PHOTO_SIZE'] = 16 * 1024 * 1024

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}"
    f"@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app) #interact with ur database
migrate = Migrate(app, db) #for any future changes

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#expose uploads/ as static route
@app.route('/uploads/<filename>')
@login_required
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOADED_FOLDER'], filename)

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

    def __repr__(self): # for debugging
        return f'<MarketplaceItem {self.id}>'
    
# Equipment table 
class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(150), nullable=False)
    pantry_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    usage_instructions = db.Column(db.Text, nullable=True)

    def __repr__(self): # for debugging
        return f'<Equipment {self.id}>'

with app.app_context():
    db.create_all()

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
    image_path = None

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        image_path = os.path.join(app.config['UPLOADED_FOLDER'], filename)
        file.save(image_path)
        image_path = f"/uploads/{filename}" #create url
    
    image_url = f"/uploads/{filename}" if file and allowed_file(file.filename) else None

    required_fields = ['name', 'quantity', 'room_no', 'owner_id', 'pantry_id', 'expiry_date']
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        item = Item(
            name=data['name'],
            quantity=data.get('quantity', 1),
            image_url = image_path,
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
#@check_role("edit")
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
#create new post
@app.route('/marketplace', methods=['POST'])
@login_required
def create_marketitem():
    data = request.form.to_dict()
    file = request.files.get('image')

    #optional image handling
    image_path = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        image_path = os.path.join(app.config['UPLOADED_FOLDER'], filename)
        file.save(image_path)
        image_path = f"/uploads/{filename}" #create url

    image_url = f"/uploads/{filename}" if file and allowed_file(file.filename) else None

    required_fields = ['name', 'quantity', 'room_no', 'owner_id', 'pantry_id', 'expiry_date']
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        market_item = MarketplaceItem(
            name=data['name'],
            quantity=int(data.get('quantity', 1)),
            room_no=data['room_no'],
            owner_id=data['owner_id'],
            pantry_id=int(data['pantry_id']),
            image_url = image_path, 
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date(),
            created_at=datetime.utcnow(),
            description=data.get('description', ''), #use .get in case its missing
            claimed=False
            
        )
        db.session.add(market_item)
        db.session.commit()

        return jsonify({
            "message": "Item created successfully", 
            "id": market_item.id}), 201

    except Exception as e:
        print("Exception while creating item:", str(e)) #debugging purposes
        return jsonify({"error": f"Error creating item: {str(e)}"}), 400

#patch an item
@app.route('/marketplace/<int:market_item_id>', methods=['PATCH'])
@login_required
def patch(market_item_id):
    market_item = MarketplaceItem.query.get(market_item_id)
    if not market_item:
        return jsonify({"error": f"Item not found"}), 404

    data = request.get_json()
    print("PATCH DATA:", data)  # Debug

    if not market_item:
        return jsonify({"error": "Item not found"}), 404

    if 'quantity' in data:
        if data['quantity'] is None:
            return jsonify({"error": "Quantity cannot be null"}), 400
        try:
            market_item.quantity = int(data['quantity'])
        except ValueError:
            return jsonify({"error": "Quantity must be a number"}), 400

    if 'claimed' in data:
        market_item.claimed = bool(data['claimed'])

    if 'name' in data:
        market_item.name = data['name']
    if 'quantity' in data:
        market_item.quantity = int(data['quantity'])
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
    if 'claimed' in data:
        market_item.claimed = data['claimed']
    if market_item.quantity == 0:
        db.session.delete(market_item)

    db.session.commit()
    
    return jsonify({"message": f"Item {market_item.id} updated"}, 200)

#fetch all items
@app.route('/marketplace', methods=['GET'])
@login_required
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
            "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None,
            "description": item.description,
            "imageUrl": item.image_url,
            "claimed": item.claimed
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
            usage_instructions=data.get('usage_instructions', '')
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
            "usage_instructions": equipment.usage_instructions

        })
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True, port=3000)


