import pytest
from app import app, db
from sqlalchemy import event
from sqlalchemy_utils import create_database, database_exists, drop_database
from unittest.mock import patch

TEST_DATABASE_URI = "sqlite:///:memory:"  # in-memory db


@pytest.fixture()
def auth_headers():
    return {"Authorization": "Bearer test_token"}

@pytest.fixture(scope='session')
def test_app():
    # override config for testing
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": TEST_DATABASE_URI,
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    })

    # create tables in memory
    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture()
def client(test_app):
    return test_app.test_client()

@pytest.fixture()
def db_session(test_app):
    with test_app.app_context():
        yield db.session

@pytest.fixture(autouse=True)
def mock_firebase(monkeypatch):
    def fake_verify_id_token(token):
        return {"uid": "test_user", "role": "admin"}
    monkeypatch.setattr("firebase_admin.auth.verify_id_token", fake_verify_id_token)