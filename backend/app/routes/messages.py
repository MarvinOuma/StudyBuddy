from flask import Blueprint, request, jsonify
from app import db
from app.models import Message, StudyGroup
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group_messages(group_id):
    from app.models import User
    messages = Message.query.filter_by(group_id=group_id).order_by(Message.timestamp.asc()).all()
    result = []
    for msg in messages:
        user = User.query.get(msg.user_id)
        result.append({
            'id': msg.id,
            'user_id': msg.user_id,
            'username': user.username if user else 'Unknown User',
            'content': msg.content,
            'timestamp': msg.timestamp.isoformat()
        })
    return jsonify(result), 200

@messages_bp.route('/group/<int:group_id>', methods=['POST'])
@jwt_required()
def post_message(group_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'message': 'Content is required'}), 400

    group = StudyGroup.query.get(group_id)
    if not group:
        return jsonify({'message': 'Group not found'}), 404

    new_message = Message(user_id=user_id, group_id=group_id, content=content, timestamp=datetime.utcnow())
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'message': 'Message sent', 'message_id': new_message.id}), 201
