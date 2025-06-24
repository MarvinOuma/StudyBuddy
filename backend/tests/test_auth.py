import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ['FLASK_APP'] = 'run.py'
os.environ['FLASK_ENV'] = 'development'
from app import create_app, db
from app.models import User
import json

@pytest.fixture
def client():
    print("Setting up app and test client")
    app = create_app()
    app.config['TESTING'] = True
    # Use a temporary file-based SQLite DB to avoid in-memory connection issues
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_temp.db'
    app.config['SECRET_KEY'] = 'test-secret-key'

    with app.app_context():
        print("Creating all tables")
        db.create_all()
        with app.test_client() as client:
            print("Yielding test client")
            yield client
        print("Dropping all tables")

def test_register_login(client):
    # Test registration
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'testpass'
    })
    assert response.status_code == 201
    assert b'User registered successfully' in response.data

    # Test duplicate registration
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'testpass'
    })
    assert response.status_code == 400

    # Test login with correct credentials
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data

    # Test login with wrong password
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'wrongpass'
    })
    assert response.status_code == 401

    # Test login with missing fields
    response = client.post('/auth/login', json={})
    assert response.status_code == 400
