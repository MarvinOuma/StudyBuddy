import sys
import os
import pytest
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from app.models import User, StudyGroup

@pytest.fixture
def client():
    print("Starting client fixture")
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = 'test-secret-key'

    with app.app_context():
        print("Creating all tables")
        db.create_all()
        yield app.test_client()
        print("Dropping all tables")
        db.drop_all()

@pytest.fixture
def auth_headers(client):
    print("Starting auth_headers fixture")
    # Register and login a user to get auth token
    client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'testpass'
    })
    print("Registered user")
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    print("Logged in user")
    token = json.loads(response.data)['token']
    print(f"Token: {token}")
    return {'Authorization': f'Bearer {token}'}

def test_create_group(client, auth_headers):
    print("Starting test_create_group")
    # Test creating a study group
    response = client.post('/groups', json={
        'title': 'Math Study Group',
        'subject': 'Mathematics',
        'description': 'Group for math enthusiasts'
    }, headers=auth_headers)
    print(f"Response status code: {response.status_code}")
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['title'] == 'Math Study Group'
    assert data['subject'] == 'Mathematics'
