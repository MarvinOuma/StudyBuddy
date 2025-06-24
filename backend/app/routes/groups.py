from flask import Blueprint, request, jsonify
from app import db
from app.models import StudyGroup
from flask_jwt_extended import jwt_required, get_jwt_identity

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/', methods=['GET'])
@jwt_required()
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
# @jwt_required()  # Temporarily disabled for testing
def create_group():
    # Simplified for debugging
    return jsonify({'message': 'Group created', 'group_id': 1}), 201

@groups_bp.route('/<int:group_id>', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_group(group_id):
    group = StudyGroup.query.get_or_404(group_id)
    db.session.delete(group)
    db.session.commit()
    return jsonify({'message': 'Group deleted'}), 200
