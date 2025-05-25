import os
from flask import Flask, render_template, request, url_for, redirect, jsonify
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
        return f'<MarketplaceItem {self.id}>'

class MarketplaceItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    room_no = db.Column(db.String(50), nullable=False )
    owner_id = db.Column(db.Integer,  nullable=False)
    pantry_id = db.Column(db.Integer, nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    claimed = db.Column(db.Boolean, default=False)

    def __repr__(self): # for debugging
        return f'<MarketplaceItem {self.id}>'

with app.app_context():
    db.create_all()
    


#create new post
@app.route('/item', methods=['POST']) 
def create():
    data = request.get_json()

    required_fields = ['name', 'quantity', 'room_no', 'owner_id', 'pantry_id', 'expiry_date']
    if not all(field in data for field in required_fields):
        return jsonify({"Error: Missing required fields (name, quantity, room_no, owner_id, pantry_id, expiry_date)" }), 400
    
    try:
        item = Item(
            name = data['name'],
            quantity = data.get('quantity', 1),
            room_no = data['room_no'],
            owner_id =  data['owner_id'],
            pantry_id =  data['pantry_id'],
            expiry_date= datetime.strptime(data['expiry_date'], '%Y-%m-%d').date() if 'expiry_date' in data else None,
            created_at = datetime.utcnow()
            
        )
        
        db.session.add(item)  
        db.session.commit()  

        return jsonify({
            "message": "Item created successfully",
            "id": item.id
        }), 201
    
    except Exception as e:
        return jsonify({
            "error": f"Error creating item: {str(e)}"
        }), 400
    

#get a post
@app.route('/item/<str:item_name>', methods=['GET'])
def get(item_name):
    item = Item.query.get(item_name)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
     return jsonify({
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "room_no": item.room_no,
        "owner_id": item.owner_id,
        "pantry_id": item.pantry_id,
        "expiry_date": item.expiry_date.strftime('%Y-%m-%d') if item.expiry_date else None
    })


#delete an item
@app.route('/item/<int:item_id>', methods=['PATCH'])
def delete(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error" : f"Item not found"}), 404
    
    db.session.delete(item) #remove from db
    db.session.commit()

    return jsonify({"message": f"Item {item.id} deleted."})

    
#marketplace stuff
#create new post
@app.route('/marketplace', methods=['POST']) 
def create_marketitem():
    data = request.get_json()

    required_fields = ['name', 'quantity', 'room_no', 'owner_id', 'pantry_id', 'expiry_date', 'description']
    if not all(field in data for field in required_fields):
        return jsonify({"Error: Missing required fields (name, quantity, room_no, owner_id, pantry_id, expiry_date, description)" }), 400
    
    try:
         market_item = MarketplaceItem(
            name = data['name'],
            quantity = data.get('quantity', 1),
            room_no = data['room_no'],
            owner_id =  data['owner_id'],
            pantry_id =  data['pantry_id'],
            expiry_date= datetime.strptime(data['expiry_date'], '%Y-%m-%d').date() if 'expiry_date' in data else None,
            created_at = datetime.utcnow(),
            description = data['description'], #db for item has no descr how to add it here
            claimed = False

        )
        
        db.session.add(market_item)  
        db.session.commit()  

        return jsonify({
            "message": "Item created successfully",
            "id":  market_item.id}), 201

    except Exception as e:
        return jsonify({"error": f"Error creating item: {str(e)}"}), 400


#patch an item
@app.route('/marketplace/<int:item_id>', methods=['PATCH'])
def patch(market_item_id):
    market_item = MarketplaceItem.query.get(market_item_id)
    if not market_item:
        return jsonify({"error" : f"Item not found"}), 404
    
    data = request.get_json()

    if 'name' in data:
        market_item.name = data['name']
    if 'quantity' in data:
        market_item.quantity = data['quantity']
    if 'room_no' in data:
        market_item.room_no = data['room_no']
    if 'owner_id' in data:
        market_item.owner_id = data['owner_id']
    if 'pantry_id' in data:
        market_item.pantry_id = data['pantry_id']
    if 'expiry_date' in data:
        market_item.expiry_date = data['expiry_date']
    if 'description' in data:
        market_item.description = data['description']
    
    
    db.session.commit()


    return jsonify({"message": f"Item { market_item.id} deleted"})



if __name__ == '__main__':
    app.run(debug=True)  
