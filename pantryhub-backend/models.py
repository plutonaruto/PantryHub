from sqlalchemy import (
    Column, Integer, String, DateTime, Date, ForeignKey,
    CheckConstraint, func, Boolean
)
from sqlalchemy.orm import relationship, validates
from datetime import datetime
from base import Base  
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Item(db.Model):
    __tablename__ = 'items'
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_quantity'),
    )
    
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(150), nullable=False)
    quantity = db.Column(Integer, nullable=False, default=1)
    room_no = db.Column(String(50), nullable=False )
    owner_id = db.Column(String(64),  nullable=False)
    pantry_id = db.Column(Integer, nullable=False)
    image_url = db.Column(db.String, nullable=True)
    expiry_date = db.Column(Date, nullable=True)
    created_at  = db.Column(DateTime, default=datetime.utcnow)




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

    def __repr__(self):
        return f'<MarketplaceItem {self.id}>'


class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(150), nullable=False)
    pantry_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    usage_instructions = db.Column(db.Text, nullable=True)
    available = db.Column(db.Boolean, nullable=False, default=True)
    used_by = db.Column(db.String, nullable=True)
    check_in_date = db.Column(db.DateTime, nullable=True)
    check_out_date = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Equipment {self.id}>'


class EquipmentLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipment.id'), nullable=False)
    user_id = db.Column(db.String, nullable=False)
    action = db.Column(db.String, nullable=False)  # "check_in" or "check_out"
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<EquipmentLog {self.id} {self.action}>'


class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    read = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Notification {self.id}>'
