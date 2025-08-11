from flask import Blueprint, request, jsonify
from app import db
from app.models.customer import Customer

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('/', methods=['GET'])
def get_customers():
    """Get all customers for authenticated user"""
    # TODO: Add authentication
    user_id = request.args.get('user_id', 1)  # Temporary
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    
    query = Customer.query.filter_by(user_id=user_id)
    
    if search:
        query = query.filter(
            db.or_(
                Customer.name.ilike(f'%{search}%'),
                Customer.email.ilike(f'%{search}%'),
                Customer.company.ilike(f'%{search}%')
            )
        )
    
    customers = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'customers': [customer.to_dict() for customer in customers.items],
        'total': customers.total,
        'pages': customers.pages,
        'current_page': page
    })

@customers_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get specific customer"""
    customer = Customer.query.get_or_404(customer_id)
    return jsonify(customer.to_dict())

@customers_bp.route('/', methods=['POST'])
def create_customer():
    """Create new customer"""
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Customer name is required'}), 400
    
    try:
        customer = Customer()
        customer.user_id = data.get('user_id', 1)  # TODO: Get from auth
        customer.name = data['name']
        customer.email = data.get('email')
        customer.phone = data.get('phone')
        customer.address = data.get('address')
        customer.tax_pin = data.get('tax_pin')
        customer.company = data.get('company')
        
        customer.save()
        
        return jsonify(customer.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@customers_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update customer"""
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json()
    
    try:
        # Update fields
        for field in ['name', 'email', 'phone', 'address', 'tax_pin', 'company']:
            if field in data:
                setattr(customer, field, data[field])
        
        customer.save()
        return jsonify(customer.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete customer"""
    customer = Customer.query.get_or_404(customer_id)
    
    # Check if customer has invoices
    if customer.invoices:
        return jsonify({'error': 'Cannot delete customer with existing invoices'}), 400
    
    try:
        customer.delete()
        return jsonify({'message': 'Customer deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500