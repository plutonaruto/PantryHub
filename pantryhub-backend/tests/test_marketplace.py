def test_create_marketplace_item(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2",
        "instructions": "Test Instructions"
    }
    response = client.post("/marketplace", data=data, headers=auth_headers)
    assert response.status_code == 201
    assert b"created successfully" in response.data

def test_update_marketplace_item(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2",
        "instructions": "Test Instructions"
    }
    response = client.post("/marketplace", data=data, headers=auth_headers)
    marketplace_item_id = response.json['id']

    update_data = {"quantity" : 10}
    patch_response = client.patch(f"/marketplace/{marketplace_item_id}", json=update_data, headers=auth_headers)
    assert patch_response.status_code == 200
    assert "updated" in patch_response.json['message']

def test_get_marketplace_item(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2",
        "instructions": "Test Instructions"
    }
    response = client.post("/marketplace", data=data, headers=auth_headers)
    marketplace_item_id = response.json['id']

    get_response = client.get(f"/marketplace/{marketplace_item_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert b"Test Item" in get_response.data

def test_get_marketplace_items(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 5,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2",
        "instructions": "Test Instructions"
    }
    client.post("/marketplace", data=data, headers=auth_headers)
    get_response = client.get("/marketplace", headers=auth_headers)
    assert get_response.status_code == 200
    assert b"Test Item" in get_response.data