from flask import Blueprint, request, jsonify
from app import db
from app.models import StudyGroup
from flask_jwt_extended import jwt_required, get_jwt_identity

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/test', methods=['GET'])
def test_groups():
    return jsonify({'message': 'Groups endpoint working'}), 200

@groups_bp.route('/', methods=['GET'])
def get_groups():
    groups = StudyGroup.query.all()
    result = []
    for group in groups:
        result.append({
            'id': group.id,
            'title': group.title,
            'subject': group.subject,
            'description': group.description,
            'created_by': group.created_by
        })
    return jsonify(result), 200

@groups_bp.route('/', methods=['POST'])
@jwt_required()
def create_group():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('subject'):
        return jsonify({'message': 'Missing required fields'}), 400

    user_id = get_jwt_identity()
    new_group = StudyGroup(
        title=data['title'],
        subject=data['subject'],
        description=data.get('description', ''),
        created_by=user_id
    )
    
    db.session.add(new_group)
    db.session.commit()

    return jsonify({
        'id': new_group.id,
        'title': new_group.title,
        'subject': new_group.subject,
        'description': new_group.description,
        'created_by': new_group.created_by
    }), 201

@groups_bp.route('/<int:group_id>', methods=['GET'])
def get_group(group_id):
    group = StudyGroup.query.get_or_404(group_id)
    return jsonify({
        'id': group.id,
        'title': group.title,
        'subject': group.subject,
        'description': group.description,
        'created_by': group.created_by
    }), 200

@groups_bp.route('/<int:group_id>', methods=['PUT'])
def update_group(group_id):
    group = StudyGroup.query.get_or_404(group_id)
    data = request.get_json()
    title = data.get('title')
    subject = data.get('subject')
    description = data.get('description')

    if title:
        group.title = title
    if subject:
        group.subject = subject
    if description:
        group.description = description

    db.session.commit()
    return jsonify({'message': 'Group updated'}), 200

@groups_bp.route('/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    group = StudyGroup.query.get_or_404(group_id)
    db.session.delete(group)
    db.session.commit()
    return jsonify({'message': 'Group deleted'}), 200

@groups_bp.route('/<int:group_id>/members', methods=['GET'])
def get_group_members(group_id):
    from app.models import User, Membership
    members = db.session.query(User).join(Membership).filter(Membership.group_id == group_id).all()
    result = []
    for member in members:
        result.append({
            'id': member.id,
            'username': member.username,
            'role': 'Member'  # Default role, can be enhanced later
        })
    return jsonify(result), 200
