from flask import Blueprint, request, jsonify, g
from models import MarketplaceItem, Notification, db
from datetime import datetime
from werkzeug.utils import secure_filename
from supabase_storage import upload_file_to_supabase  # keep this import here
from user_auth.auth_helper import login_required

marketplace_bp = Blueprint('marketplace', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#create new post
@marketplace_bp.route('/marketplace', methods=['POST'])
@login_required
def create_marketitem():
    data = request.form.to_dict()
    file = request.files.get('image')

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
        'name', 'quantity', 'room_no',
        'pantry_id', 'expiry_date', 'pickup_location', 'instructions'
    ]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        market_item = MarketplaceItem(
            name=data['name'],
            quantity=int(data.get('quantity', 1)),
            room_no=data['room_no'],
            owner_id=g.current_user["uid"],
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

@marketplace_bp.route('/marketplace/<int:market_item_id>', methods=['PATCH'])
@login_required
def update_marketplace_item(market_item_id):
    market_item = MarketplaceItem.query.get(market_item_id)
    if not market_item:
        return jsonify({"error": "Item not found"}), 404

    data = request.get_json()
    print("PATCH data:", data)

    claimer_id = g.current_user["uid"]
    claimed = data.get('claimed')

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

    print("Claimed?", claimed)
    print("Claimer ID?", claimer_id)

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

    #delete the item
    if market_item.quantity == 0:
        db.session.delete(market_item)

    try:
        db.session.commit()
        print("Changes committed.")
    except Exception as e:
        db.session.rollback()
        print("Error committing changes:", str(e))
        return jsonify({"error": "Failed to update item or create notifications"}), 500

    return jsonify({"message": f"Item {market_item.id} updated"}), 200



# get an item
@marketplace_bp.route('/marketplace/<int:item_id>', methods=['GET'])
@login_required
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
@marketplace_bp.route('/marketplace', methods=['GET'])
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
            "pickup_location": item.pickup_location,
            "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None,
            "description": item.description,
            "image_url": item.image_url or "/placeholder.jpg",
            "claimed": item.claimed,
            "instructions": item.instructions
        })
    return jsonify(result), 200