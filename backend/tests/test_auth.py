import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from app.models import User
import json

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

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
