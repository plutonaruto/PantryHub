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
