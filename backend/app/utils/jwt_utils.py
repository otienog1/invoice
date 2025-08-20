import jwt
from datetime import datetime, timedelta
from flask import current_app
from functools import wraps
from flask import request, jsonify
from app.models.user import User

def generate_token(user_id, tenant_id=None):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'tenant_id': tenant_id,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    
    secret = current_app.config.get('JWT_SECRET_KEY', 'your-secret-key')
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

def decode_token(token):
    """Decode JWT token"""
    try:
        secret = current_app.config.get('JWT_SECRET_KEY', 'your-secret-key')
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        # Get user
        user = User.query.get(payload['user_id'])
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # Add user and tenant info to request context
        request.current_user = user
        request.current_tenant_id = payload.get('tenant_id')
        
        return f(user, *args, **kwargs)
    
    return decorated

def tenant_required(f):
    """Decorator to require tenant context"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'current_tenant_id') or not request.current_tenant_id:
            return jsonify({'error': 'Tenant context required'}), 403
        return f(*args, **kwargs)
    
    return decorated