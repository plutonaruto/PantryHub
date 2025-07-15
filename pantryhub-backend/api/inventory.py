from flask import Blueprint, request, jsonify, g
from datetime import datetime
from werkzeug.utils import secure_filename

from models import Item, db
from auth.auth_helper import login_required

from supabase_storage import upload_file_to_supabase

inventory_bp = Blueprint("inventory", __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@inventory_bp.route('/items', methods=['POST'])
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

    required_fields = ['name', 'quantity', 'room_no', 'pantry_id', 'expiry_date']
    if not all(data.get(field) for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        item = Item(
            name=data['name'],
            quantity=data.get('quantity', 1),
            image_url = image_url,
            room_no=data['room_no'],
            owner_id=g.current_user["uid"],
            pantry_id=data['pantry_id'],
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date(),
            created_at=datetime.utcnow()
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({"message": "Item created successfully", "id": item.id}), 201

    except Exception as e:
        return jsonify({"error": f"Error creating item: {str(e)}"}), 400


@inventory_bp.route('/items/<int:item_id>', methods=['GET'])
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

@inventory_bp.route('/items/<int:item_id>', methods=['PATCH'])
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
@inventory_bp.route('/items/<int:item_id>', methods=['DELETE'])
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
@inventory_bp.route('/items/<int:item_id>', methods=['PUT'])
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
@inventory_bp.route('/items/<string:owner_id>', methods=['GET'])
@login_required
#@check_role("view_own_items")
def get_all_items(owner_id):
    try:
        print("Fetching items for owner_id:", owner_id) #debug
        items = Item.query.filter_by(owner_id= owner_id).all()
        result = []
        for item in items:
            result.inventory_bpend({
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
@inventory_bp.route('/items', methods=['GET'])
@login_required
def get_all_items_admin():
    items = Item.query.all()
    result = []
    for item in items:
        result.inventory_bpend({
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
