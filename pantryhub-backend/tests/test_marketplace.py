def test_create_marketplace_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/marketplace", data=data)
    assert response.status_code == 201
    assert b"Item created successfully" in response.data


def test_update_marketplace_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/marketplace", data=data)
    marketplace_item_id = response.json['id']

    update_data = {"quantity" : 10}
    patch_response = client.patch(f"/marketplace/{marketplace_item_id}", json=update_data)
    assert patch_response.status_code == 200
    assert b"Item updated successfully" in patch_response.data

def test_delete_marketplace_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/marketplace", data=data)
    marketplace_item_id = response.json['id']

    delete_response = client.delete(f"/marketplace/{marketplace_item_id}")
    assert delete_response.status_code == 204
    assert b"Item deleted" in delete_response.data

def test_get_marketplace_item(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/marketplace", data=data)
    marketplace_item_id = response.json['id']

    get_response = client.get(f"/marketplace/{marketplace_item_id}")
    assert get_response.status_code == 200
    assert b"Test Item" in get_response.data

def test_get_marketplace_items(client, db_session):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }

    response = client.post("/marketplace", data=data)
    get_response = client.get(f"/marketplace")
    assert get_response.status_code == 200
    assert b"Test Items" in get_response.data


    
                                  
