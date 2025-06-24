import pytest
import sys
import os
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from app.models import User, StudyGroup, Membership

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
    # Create a study group for memberships
    response = client.post('/groups', json={
        'title': 'Physics Group',
        'subject': 'Physics',
        'description': 'Physics enthusiasts'
    }, headers=auth_headers)
    return json.loads(response.data)

def test_add_membership(client, auth_headers, group):
    # Test adding a membership
    response = client.post('/memberships', json={
        'user_id': 1,
        'group_id': group['id']
    }, headers=auth_headers)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['user_id'] == 1
    assert data['group_id'] == group['id']

def test_add_membership_missing_fields(client, auth_headers):
    # Test adding membership with missing fields
    response = client.post('/memberships', json={
        'user_id': 1
    }, headers=auth_headers)
    assert response.status_code == 400

def test_get_memberships(client, auth_headers):
    # Test getting memberships list
    response = client.get('/memberships', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

def test_unauthorized_access(client):
    # Test accessing memberships without auth
    response = client.get('/memberships')
    assert response.status_code == 401
