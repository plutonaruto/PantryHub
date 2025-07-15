def test_create_inventory_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/items", data=data)
    assert response.status_code == 201
    assert b"Item created successfully" in response.data

def test_update_inventory_item(client, db_session):
    data = {
         "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-20",
        "pickup_location": "Level 2"
    }

    response  = client.post("/items", data=data)
    item_id = response.json['id']

    update_data = {"quantity" : 5}
    patch_response = client.patch(f"/items/{item_id}", data=update_data)
    assert response.status_code == 201
    assert b"Item updated successfully" in patch_response.data

def test_delete_inventory_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/items", data=data)
    item_id = response.json['id']

    delete_response = client.delete(f"/items/{item_id}")
    assert delete_response.status_code == 204
    assert b"Item removed successfully" in delete_response.data

def test_get_inventory_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/items", data=data)
    item_id = response.json['id']

    get_response = client.get(f"/items/{item_id}")
    assert get_response.status_code == 200
    assert b"Test Item" in get_response.data

def test_get_all_inventory_items(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/items", data=data)
    assert response.status_code == 201

    all_items_response = client.get("/items")
    assert all_items_response.status_code == 200
    assert b"Test Items" in all_items_response.data


