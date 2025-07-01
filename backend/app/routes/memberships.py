from flask import Blueprint, request, jsonify
from app import db
from app.models import Membership, StudyGroup
from flask_jwt_extended import jwt_required, get_jwt_identity

memberships_bp = Blueprint('memberships', __name__)

@memberships_bp.route('/join', methods=['POST'])
@jwt_required()
def join_group():
    user_id = get_jwt_identity()
    data = request.get_json()
    group_id = data.get('group_id')

    if not group_id:
        return jsonify({'message': 'group_id is required'}), 400

    existing_membership = Membership.query.filter_by(user_id=user_id, group_id=group_id).first()
    if existing_membership:
        return jsonify({'message': 'Already a member of this group'}), 409

    membership = Membership(user_id=user_id, group_id=group_id)
    db.session.add(membership)
    db.session.commit()

    return jsonify({'message': 'Joined group successfully'}), 201

@memberships_bp.route('/leave', methods=['POST'])
def leave_group():
    user_id = get_jwt_identity()
    data = request.get_json()
    group_id = data.get('group_id')

    if not group_id:
        return jsonify({'message': 'group_id is required'}), 400

    membership = Membership.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not membership:
        return jsonify({'message': 'Not a member of this group'}), 404

    db.session.delete(membership)
    db.session.commit()

    return jsonify({'message': 'Left group successfully'}), 200

@memberships_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_memberships():
    user_id = get_jwt_identity()
    memberships = Membership.query.filter_by(user_id=user_id).all()
    result = []
    for membership in memberships:
        group = StudyGroup.query.get(membership.group_id)
        if group:
            result.append({
                'group_id': group.id,
                'title': group.title,
                'subject': group.subject,
                'description': group.description
            })
    return jsonify(result), 200

@memberships_bp.route('/<int:membership_id>/role', methods=['PUT'])
@jwt_required()
def update_member_role(membership_id):
    data = request.get_json()
    new_role = data.get('role')
    
    if not new_role:
        return jsonify({'message': 'Role is required'}), 400
    
    return jsonify({'message': 'Role updated successfully'}), 200
