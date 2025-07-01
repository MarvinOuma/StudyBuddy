from flask import Blueprint, request, jsonify
from app import db
from app.models import StudySession, StudyGroup
from flask_jwt_extended import jwt_required

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('/', methods=['GET'])
def get_sessions():
    sessions = StudySession.query.all()
    result = []
    for session in sessions:
        result.append({
            'id': session.id,
            'group_id': session.group_id,
            'date': session.date.isoformat(),
            'time': session.time.isoformat(),
            'location': session.location
        })
    return jsonify(result), 200

@sessions_bp.route('/', methods=['POST'])
def create_session():
    data = request.get_json()
    group_id = data.get('group_id')
    date = data.get('date')
    time = data.get('time')
    location = data.get('location')

    if not group_id or not date or not time:
        return jsonify({'message': 'group_id, date, and time are required'}), 400

    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({'message': 'Group not found'}), 404

    new_session = StudySession(group_id=group_id, date=date, time=time, location=location)
    db.session.add(new_session)
    db.session.commit()

    return jsonify({'message': 'Session created', 'session_id': new_session.id}), 201

@sessions_bp.route('/<int:session_id>', methods=['GET'])
def get_session(session_id):
    session = StudySession.query.get_or_404(session_id)
    return jsonify({
        'id': session.id,
        'group_id': session.group_id,
        'date': session.date.isoformat(),
        'time': session.time.isoformat(),
        'location': session.location
    }), 200

@sessions_bp.route('/<int:session_id>', methods=['PUT'])
def update_session(session_id):
    session = StudySession.query.get_or_404(session_id)
    data = request.get_json()
    date = data.get('date')
    time = data.get('time')
    location = data.get('location')

    if date:
        session.date = date
    if time:
        session.time = time
    if location:
        session.location = location

    db.session.commit()
    return jsonify({'message': 'Session updated'}), 200

@sessions_bp.route('/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    session = StudySession.query.get_or_404(session_id)
    db.session.delete(session)
    db.session.commit()
    return jsonify({'message': 'Session deleted'}), 200
