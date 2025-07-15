def test_create_equipment(client, db_session):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }

    response = client.post("/equipment", json=data)
    assert response.status_code == 201
    assert b"Equipment created successfully" in response.data

def test_get_equipment(client, db_session):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }

    post_response = client.post("/equipment", json=data)
    equipment_id = post_response.json['id']

    get_response = client.get(f"/equipment/{equipment_id}")
    assert get_response.status_code == 200
    assert f"Test Equipment" in get_response.text

def test_get_all_equipment(client, db_session):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }

    response = client.post("/equipment", json=data)
  

    get_response = client.get("/equipment")
    assert get_response.status_code == 200
    assert f"Test Equipment" in get_response.text


def test_check_in(client, db_session):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }
    post_response = client.post("/equipment", json=data)
    equipment_id = post_response.json['id']

    check_in_response = client.post(f"/equipment/{equipment_id}/checkin")
    assert check_in_response.status_code == 200
    assert b"Equipment checked in successfully" in check_in_response.data


def test_check_out(client, db_session):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }

    post_response = client.post("/equipment", json=data)
    equipment_id = post_response.json['id']

    check_in_response = client.post(f"/equipment/{equipment_id}/checkout")
    assert check_in_response.status_code == 200
    assert b"Equipment checked out successfully" in check_in_response.data
    



