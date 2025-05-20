import os
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime
from base import Base
from sqlalchemy import Column, Integer, String, DateTime
from models import Item  # Ensure the Item model is imported


from sqlalchemy.sql import func

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}"
    f"@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app) #interact with ur database


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    room_no = db.Column(db.String(50), nullable=False )
    owner_id = db.Column(db.Integer,  nullable=False)
    pantry_id = db.Column(db.Integer, nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    #bio = db.Column(db.Text) #need this for selling items?

    def __repr__(self): # for debugging
        return f'<Item {self.id}>'
    


#create new post
@app.route('/items', methods=['POST']) 
def create():
    data = request.form

    required_fields = ['name', 'quantity', 'room_no', 'owner_id', 'pantry_id', 'expiry_date']
    if not all(field in data for field in required_fields):
        return "Error: Missing required fields (name, quantity, room_no, owner_id, pantry_id, expiry_date)", 400
    
    try:
        item = Item(
            name = data['name'],
            quantity = data.get('quantity', 1),
            room_no = data['room_no'],
            owner_id =  data['owner_no'],
            pantry_id =  data['pantry_no'],
            expiry_date= datetime.strptime(data['expiry_date'], '%Y-%m-%d').date() if 'expiry_date' in data else None,
            created_at = datetime.utcnow()
        )
        
        db.session.add(item)  
        db.session.commit()  
        return f"Item created! ID: {item.id}", 201
    
    except Exception as e:
        return f"Error creating item: {e}", 400
    

#get a post
@app.route('/items/<int:item_id>', methods=['GET'])
def get(item.id):
    item = Item.query.get(item.id)
    if not item:
        return "Item not found!", 404
    
    return (f"Item Details: \n"
    f"ID: {item.id} \n"
    f"Name: {item.name}\n"
    f"Quantity: {item.quantity}\n"
    f"Room: {item.room_no}\n"
    f"Owner: {item.owner_id}\n"
    f"Pantry: {item.pantry_id}\n"
    f"Expiry Date: {item.expiry_date}"
    )
    

#delete an item
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete(item.id):
    item = Item.query.get(item.id)
    if not item:
        return "Item not found!", 404
    
    db.session.delete(item) #remove from db
    db.session.commit()

    return f"Item {item.id} deleted"

if __name__ == '__main__':
    app.run(debug=True)
