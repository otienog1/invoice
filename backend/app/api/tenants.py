from flask import Blueprint, request, jsonify
from app.models.tenant import Tenant
from app.models.user import User
from app.models.base import db
from app.utils.jwt_utils import token_required
from app.utils.validators import validate_required_fields
from datetime import datetime

tenants_bp = Blueprint('tenants', __name__)

@tenants_bp.route('/tenants', methods=['POST'])
@token_required
def create_tenant(current_user):
    """Create a new tenant/organization"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name']
        if not validate_required_fields(data, required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if tenant name already exists
        existing_tenant = Tenant.query.filter_by(name=data['name']).first()
        if existing_tenant:
            return jsonify({'error': 'Organization name already exists'}), 400
        
        # Generate slug from name
        slug = data['name'].lower().replace(' ', '-').replace('_', '-')
        # Ensure slug is unique
        base_slug = slug
        counter = 1
        while Tenant.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Create new tenant
        tenant = Tenant(
            name=data['name'],
            slug=slug,
            domain=data.get('domain'),
            settings={
                'company_name': data['name'],
                'company_address': '',
                'company_phone': '',
                'company_email': '',
                'company_logo': '',
                'tax_rate': 0.0,
                'currency': 'USD',
                'date_format': 'MM/DD/YYYY',
                'time_zone': 'UTC',
                'invoice_prefix': 'INV',
                'invoice_counter': 1,
                'payment_terms': 'Net 30',
                'late_fee_enabled': False,
                'late_fee_percentage': 0.0,
                'branding_enabled': False
            },
            plan='basic'
        )
        
        db.session.add(tenant)
        db.session.flush()  # To get the tenant ID
        
        # Add the current user to this tenant as admin
        current_user.tenant_id = tenant.id
        current_user.role = 'admin'
        current_user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'id': tenant.id,
            'name': tenant.name,
            'slug': tenant.slug,
            'domain': tenant.domain,
            'settings': tenant.settings,
            'plan': tenant.plan,
            'max_users': tenant.max_users,
            'max_invoices': tenant.max_invoices,
            'is_active': tenant.is_active,
            'created_at': tenant.created_at.isoformat(),
            'updated_at': tenant.updated_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tenants_bp.route('/tenants/settings', methods=['GET'])
@token_required
def get_tenant_settings(current_user):
    """Get current tenant settings"""
    try:
        if not current_user.tenant_id:
            return jsonify({'error': 'User not associated with any organization'}), 400
        
        tenant = Tenant.query.get(current_user.tenant_id)
        if not tenant:
            return jsonify({'error': 'Organization not found'}), 404
        
        return jsonify({
            'id': tenant.id,
            'name': tenant.name,
            'slug': tenant.slug,
            'domain': tenant.domain,
            'settings': tenant.settings,
            'plan': tenant.plan,
            'max_users': tenant.max_users,
            'max_invoices': tenant.max_invoices,
            'is_active': tenant.is_active,
            'created_at': tenant.created_at.isoformat(),
            'updated_at': tenant.updated_at.isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenants_bp.route('/tenants/settings', methods=['PUT'])
@token_required
def update_tenant_settings(current_user):
    """Update tenant settings"""
    try:
        if not current_user.tenant_id:
            return jsonify({'error': 'User not associated with any organization'}), 400
        
        # Check if user has admin role
        if current_user.role not in ['admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        tenant = Tenant.query.get(current_user.tenant_id)
        if not tenant:
            return jsonify({'error': 'Organization not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            # Check if new name conflicts with existing tenant
            existing = Tenant.query.filter(
                Tenant.name == data['name'],
                Tenant.id != tenant.id
            ).first()
            if existing:
                return jsonify({'error': 'Organization name already exists'}), 400
            tenant.name = data['name']
        
        if 'domain' in data:
            tenant.domain = data['domain']
        
        if 'settings' in data:
            # Merge settings
            current_settings = tenant.settings or {}
            current_settings.update(data['settings'])
            tenant.settings = current_settings
        
        tenant.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'id': tenant.id,
            'name': tenant.name,
            'slug': tenant.slug,
            'domain': tenant.domain,
            'settings': tenant.settings,
            'plan': tenant.plan,
            'max_users': tenant.max_users,
            'max_invoices': tenant.max_invoices,
            'is_active': tenant.is_active,
            'created_at': tenant.created_at.isoformat(),
            'updated_at': tenant.updated_at.isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500