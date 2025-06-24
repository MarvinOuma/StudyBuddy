import pytest
import sys
import os
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from app.models import User, StudyGroup, StudySession

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
    # Create a study group for sessions
    response = client.post('/groups', json={
        'title': 'History Group',
        'subject': 'History',
        'description': 'History enthusiasts'
    }, headers=auth_headers)
    return json.loads(response.data)

def test_create_session(client, auth_headers, group):
    # Test creating a study session
    response = client.post('/sessions', json={
        'group_id': group['id'],
        'date': '2024-07-01',
        'time': '15:00:00',
        'location': 'Library Room 1'
    }, headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['group_id'] == group['id']
    assert data['location'] == 'Library Room 1'

def test_create_session_missing_fields(client, auth_headers):
    # Test creating session with missing fields
    response = client.post('/sessions', json={
        'date': '2024-07-01'
    }, headers=auth_headers)
    assert response.status_code == 400

def test_get_sessions(client, auth_headers, group):
    # Create a session first
    client.post('/sessions', json={
        'group_id': group['id'],
        'date': '2024-07-02',
        'time': '10:00:00',
        'location': 'Room 2'
    }, headers=auth_headers)
    # Test getting list of sessions
    response = client.get('/sessions', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert any(session['group_id'] == group['id'] for session in data)

def test_unauthorized_access(client):
    # Test accessing sessions without auth
    response = client.get('/sessions')
    assert response.status_code == 401
