from flask import Blueprint, request, jsonify, g
from datetime import datetime, date
from models import Notification, Item, db
from user_auth.auth_helper import login_required

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route('/notifications/<int:notification_id>/mark-read', methods=['PATCH'])
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
    
@notifications_bp.route('/notifications/<string:user_id>', methods=['GET'])
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

@notifications_bp.route('/notifications', methods=['POST'])
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

def scan_and_notify_expired_items(expired_items):
    from app import socketio 
    for item in expired_items:
        existing = Notification.query.filter_by(
            user_id = item.owner_id,
            type =  "ITEM_EXPIRED",
            message = f"Your item {item.name} has expired. Please remove it from the pantry."
        ).first()

        if not existing:
            notif = Notification (
                user_id = item.owner_id,
                type = "ITEM_EXPIRED",
                message = f"Your item {item.name} has expired. Please remove it from the pantry.",
                timestamp = datetime.utcnow(),
                read = False
            )
       
            db.session.add(notif)
            socketio.emit("notification", {
                "user_id": item.owner_id,
                "type": "ITEM_EXPIRED",
                "message": f"Your item {item.name} has expired. Please remove it from the pantry.",
                "timestamp": datetime.utcnow().isoformat(),
                "read": False
            })
            print(f"Notification created for expired item: {item.name}")
    db.session.commit()
        

# test 
@notifications_bp.route('/test-expiry-scan', methods=['POST'])
def test_expiry_scan():
    today = date.today()
    expired_items = Item.query.filter(Item.expiry_date < today).all()
    scan_and_notify_expired_items(expired_items)
    return jsonify({"message": "Expiry scan triggered"})