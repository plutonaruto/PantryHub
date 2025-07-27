def test_create_inventory_item(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }
    response = client.post("/items", data=data, headers=auth_headers)
    assert response.status_code == 201
    assert b"Item created successfully" in response.data

def test_update_inventory_item(client, db_session, auth_headers):
    data = {
         "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-20",
        "pickup_location": "Level 2"
    }
    response = client.post("/items", data=data, headers=auth_headers)
    item_id = response.json['id']

    update_data = {"quantity" : 5}
    patch_response = client.patch(f"/items/{item_id}", data=update_data, headers=auth_headers)
    assert patch_response.status_code == 200
    assert patch_response.json['message'] == f"Item {item_id} updated"

def test_delete_inventory_item(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }
    response = client.post("/items", data=data, headers=auth_headers)
    item_id = response.json['id']

    delete_response = client.delete(f"/items/{item_id}", headers=auth_headers)
    assert delete_response.status_code == 200
    assert "deleted" in delete_response.json['message']

def test_get_inventory_item(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }
    response = client.post("/items", data=data, headers=auth_headers)
    item_id = response.json['id']

    get_response = client.get(f"/items/{item_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert b"Test Item" in get_response.data

def test_get_all_inventory_items(client, db_session, auth_headers):
    data = {
        "name": "Test Item",
        "quantity": 3,
        "room_no": "101",
        "owner_id": 1,
        "pantry_id": 1,
        "expiry_date": "2025-7-31",
        "pickup_location": "Level 2"
    }
    client.post("/items", data=data, headers=auth_headers)
    all_items_response = client.get("/items", headers=auth_headers)
    assert all_items_response.status_code == 200
    assert b"Test Item" in all_items_response.data


