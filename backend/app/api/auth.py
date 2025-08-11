from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 401
    
    # TODO: Generate JWT token
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': 'temporary-token'  # Replace with actual JWT
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration"""
    data = request.get_json()
    
    required_fields = ['username', 'email', 'name', 'password']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    try:
        user = User()
        user.username = data['username']
        user.email = data['email']
        user.name = data['name']
        user.phone = data.get('phone')
        user.company_name = data.get('company_name')
        user.company_address = data.get('company_address')
        user.set_password(data['password'])
        
        user.save()
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    # TODO: Add authentication middleware
    user_id = request.args.get('user_id', 1)  # Temporary
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    # TODO: Add authentication middleware
    user_id = request.args.get('user_id', 1)  # Temporary
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    try:
        # Update allowed fields
        allowed_fields = ['name', 'phone', 'company_name', 'company_address', 'avatar', 'company_logo']
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        user.save()
        return jsonify(user.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500