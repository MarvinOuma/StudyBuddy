import pytest
import sys
import os
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from app.models import User, StudyGroup, Message

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = 'test-secret-key'

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

@pytest.fixture
def auth_headers(client):
    # Register and login a user to get auth token
    client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'testpass'
    })
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    token = json.loads(response.data)['token']
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def group(client, auth_headers):
    # Create a study group for messages
    response = client.post('/groups', json={
        'title': 'Chemistry Group',
        'subject': 'Chemistry',
        'description': 'Chemistry enthusiasts'
    }, headers=auth_headers)
    return json.loads(response.data)

def test_create_message(client, auth_headers, group):
    # Test creating a message
    response = client.post('/messages', json={
        'user_id': 1,
        'group_id': group['id'],
        'content': 'Hello, this is a test message'
    }, headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['content'] == 'Hello, this is a test message'

def test_create_message_missing_fields(client, auth_headers):
    # Test creating message with missing fields
    response = client.post('/messages', json={
        'user_id': 1
    }, headers=auth_headers)
    assert response.status_code == 400

def test_get_messages(client, auth_headers, group):
    # Create a message first
    client.post('/messages', json={
        'user_id': 1,
        'group_id': group['id'],
        'content': 'Another test message'
    }, headers=auth_headers)
    # Test getting list of messages
    response = client.get('/messages', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert any(message['content'] == 'Another test message' for message in data)

def test_unauthorized_access(client):
    # Test accessing messages without auth
    response = client.get('/messages')
    assert response.status_code == 401
