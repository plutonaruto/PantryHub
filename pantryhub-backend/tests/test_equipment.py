def test_create_equipment(client, db_session, auth_headers):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }

    response = client.post("/equipment", data=data, headers=auth_headers)
    assert response.status_code == 201
    assert b"Equipment created successfully" in response.data


def test_get_equipment(client, db_session, auth_headers):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }
    post_response = client.post("/equipment", data=data, headers=auth_headers)
    equipment_id = post_response.json['id']

    get_response = client.get(f"/equipment/{equipment_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert b"Test Equipment" in get_response.data

def test_get_all_equipment(client, db_session, auth_headers):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }
    client.post("/equipment", data=data, headers=auth_headers)
    get_response = client.get("/equipment", headers=auth_headers)
    assert get_response.status_code == 200
    assert b"Test Equipment" in get_response.data


def test_check_in(client, db_session, auth_headers):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }
    post_response = client.post("/equipment", data=data, headers=auth_headers)
    equipment_id = post_response.json['id']

    check_in_response = client.patch(f"/equipment/{equipment_id}/checkin", headers=auth_headers)
    assert check_in_response.status_code == 200
    assert b"checked in successfully" in check_in_response.data

def test_check_out(client, db_session, auth_headers):
    data = {
        "label": "Test Equipment",
        "pantry_id": 1,
        "description": "Testing equipment creation",
        "usage_instructions": "Use with care",
    }
    post_response = client.post("/equipment", data=data, headers=auth_headers)
    equipment_id = post_response.json['id']

    client.patch(f"/equipment/{equipment_id}/checkin", headers=auth_headers)

    check_out_response = client.patch(f"/equipment/{equipment_id}/checkout", headers=auth_headers)
    assert check_out_response.status_code == 200
    assert b"checked out successfully" in check_out_response.data