def test_read_notification(client, db_session):
    data = {
        "user_id" : "test_user",
        "type": "test",
       "message" : "This is a test notification",
    }

    response = client.post("/notifications", json=data)
    assert response.status_code == 201
    assert b"Notification created successfully" in response.data

def test_get_notifications(client, db_session):
    data = {
        "user_id" : "test_user",
        "type": "test",
       "message" : "This is a test notification",
    }

    response = client.post("/notifications", json=data)

    id = response.json['id']
    get_response = client.get(f"/notification/{id}")
    assert get_response.status_code == 200
    assert b"test_user" in get_response.data

def test_mark_notification_read(client, db_session):
    data = {
        "user_id" : "test_user",
        "type": "test",
       "message" : "This is a test notification",
    }
    
    response = client.post("/notifications", json=data)
    id = response.json['id']

    read_response = client.patch(f"/notifications/{id}/mark-read")
    assert read_response.status_code == 200
    assert b"Notification marked as read" in read_response.data


