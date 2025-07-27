def test_read_notification(client, db_session, auth_headers):
    data = {
        "user_id" : "test_user",
        "type": "test",
        "message" : "This is a test notification",
    }
    response = client.post("/notifications", json=data, headers=auth_headers)
    assert response.status_code == 201
    assert b"Notification created" in response.data

def test_get_notifications(client, db_session, auth_headers):
    data = {
        "user_id" : "test_user",
        "type": "test",
        "message" : "This is a test notification",
    }
    response = client.post("/notifications", json=data, headers=auth_headers)
    user_id = data["user_id"]

    get_response = client.get(f"/notifications/{user_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert b"test_user" in get_response.data

def test_mark_notification_read(client, db_session, auth_headers):
    data = {
        "user_id" : "test_user",
        "type": "test",
        "message" : "This is a test notification",
    }
    response = client.post("/notifications", json=data, headers=auth_headers)
    notif_id = response.json['id']

    read_response = client.patch(f"/notifications/{notif_id}/mark-read", headers=auth_headers)
    assert read_response.status_code == 200
    assert b"marked as read" in read_response.data

