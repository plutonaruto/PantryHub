from flask import Blueprint, request, jsonify, g
from datetime import datetime
from models import Equipment, EquipmentLog, Notification,db
from user_auth.auth_helper import login_required

equipment_bp = Blueprint("equipment", __name__)

@equipment_bp.route('/equipment', methods=['POST'])
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
    

   
@equipment_bp.route('/equipment', methods=['GET'])
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

@equipment_bp.route('/equipment/<int:equipment_id>', methods=['GET'])
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

@equipment_bp.route('/equipment/<int:equipment_id>/checkin', methods=['PATCH', 'OPTIONS'])
@login_required
def check_in(equipment_id):
    if request.method == 'OPTIONS':
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
    
    from app import socketio
    socketio.emit('notification', {
        "equipment_id": equipment.id,
        "action": "check_in",
        "user_id": g.current_user.get('uid'),
        "timestamp": datetime.utcnow().isoformat(),
        "read": False
    })

    notif = Notification(
        user_id = g.current_user.get('uid'),
        type = "EQUIPMENT_CHECK_IN",
        message = f"{equipment.label} was checked in by { g.current_user.get('uid')}.",
        timestamp = datetime.utcnow(),
        read = False
    )

    db.session.add(notif)
    db.session.commit()

    return jsonify({
        "message": f"Equipment {equipment.label} checked in successfully",
        "id": equipment.id,
        "owner": g.current_user.get('uid') # set user who checked it in
    }), 200

@equipment_bp.route('/equipment/<int:equipment_id>/checkout', methods=['PATCH', 'OPTIONS'])
@login_required
def check_out(equipment_id):
    if request.method == 'OPTIONS':
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

    from app import socketio
    socketio.emit('notification', {
        "equipment_id": equipment.id,
        "action": "check_out",
        "user_id": g.current_user.get('uid'),
        "timestamp": datetime.utcnow().isoformat(),
        "read": False
    })

    notif = Notification(
        user_id = g.current_user.get('uid'),
        type = "EQUIPMENT_CHECK_OUT",
        message = f"{equipment.label} was checked out by { g.current_user.get('uid')}.",
        timestamp = datetime.utcnow(),
        read = False
    )
    
    db.session.add(notif)
    db.session.commit()

    return jsonify({
        "message": f"Equipment {equipment.label} checked out successfully",
        "id": equipment.id,
        "owner": g.current_user.get('uid') # set user who checked it out
    }), 200

@equipment_bp.route('/equipment/log', methods = ['GET'])
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