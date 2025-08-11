from flask import Blueprint, request, jsonify
from app import db
from app.models.invoice import Invoice, InvoiceItem
from app.models.customer import Customer
from app.services.invoice_service import InvoiceService
from app.utils.validators import validate_invoice_data

invoices_bp = Blueprint('invoices', __name__)

@invoices_bp.route('/', methods=['GET'])
def get_invoices():
    """Get all invoices for authenticated user"""
    # TODO: Add authentication
    user_id = request.args.get('user_id', 1)  # Temporary
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    
    query = Invoice.query.filter_by(user_id=user_id)
    
    if status:
        query = query.filter_by(status=status)
    
    invoices = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'invoices': [invoice.to_dict() for invoice in invoices.items],
        'total': invoices.total,
        'pages': invoices.pages,
        'current_page': page
    })

@invoices_bp.route('/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    """Get specific invoice"""
    invoice = Invoice.query.get_or_404(invoice_id)
    
    # Include related data
    invoice_data = invoice.to_dict()
    invoice_data['customer'] = invoice.customer.to_dict() if invoice.customer else None
    invoice_data['items'] = [item.to_dict() for item in invoice.items]
    
    return jsonify(invoice_data)

@invoices_bp.route('/', methods=['POST'])
def create_invoice():
    """Create new invoice"""
    data = request.get_json()
    
    # Validate data
    errors = validate_invoice_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        # Create invoice
        invoice = Invoice()
        invoice.user_id = data.get('user_id', 1)  # TODO: Get from auth
        invoice.customer_id = data['customer_id']
        invoice.title = data.get('title')
        invoice.description = data.get('description')
        invoice.due_date = data.get('due_date')
        invoice.tax_rate = data.get('tax_rate', 0)
        invoice.discount_rate = data.get('discount_rate', 0)
        invoice.notes = data.get('notes')
        invoice.terms = data.get('terms')
        
        # Generate invoice number
        invoice.generate_invoice_number()
        
        # Add items
        for item_data in data.get('items', []):
            item = InvoiceItem()
            item.description = item_data['description']
            item.quantity = item_data['quantity']
            item.rate = item_data['rate']
            item.calculate_total()
            invoice.items.append(item)
        
        # Calculate totals
        invoice.calculate_totals()
        
        # Save to database
        invoice.save()
        
        return jsonify(invoice.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@invoices_bp.route('/<int:invoice_id>', methods=['PUT'])
def update_invoice(invoice_id):
    """Update invoice"""
    invoice = Invoice.query.get_or_404(invoice_id)
    data = request.get_json()
    
    try:
        # Update fields
        for field in ['title', 'description', 'due_date', 'tax_rate', 'discount_rate', 'notes', 'terms']:
            if field in data:
                setattr(invoice, field, data[field])
        
        # Update items if provided
        if 'items' in data:
            # Remove existing items
            for item in invoice.items:
                db.session.delete(item)
            
            # Add new items
            for item_data in data['items']:
                item = InvoiceItem()
                item.description = item_data['description']
                item.quantity = item_data['quantity']
                item.rate = item_data['rate']
                item.calculate_total()
                invoice.items.append(item)
        
        # Recalculate totals
        invoice.calculate_totals()
        
        # Save changes
        db.session.commit()
        
        return jsonify(invoice.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@invoices_bp.route('/<int:invoice_id>/send', methods=['POST'])
def send_invoice(invoice_id):
    """Send invoice via email"""
    invoice = Invoice.query.get_or_404(invoice_id)
    
    try:
        invoice_service = InvoiceService()
        result = invoice_service.send_invoice_email(invoice)
        
        if result['success']:
            invoice.status = 'sent'
            invoice.save()
            return jsonify({'message': 'Invoice sent successfully'})
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@invoices_bp.route('/<int:invoice_id>/pdf', methods=['GET'])
def generate_pdf(invoice_id):
    """Generate PDF for invoice"""
    invoice = Invoice.query.get_or_404(invoice_id)
    
    try:
        invoice_service = InvoiceService()
        pdf_data = invoice_service.generate_pdf(invoice)
        
        return pdf_data, 200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': f'attachment; filename=invoice_{invoice.invoice_number}.pdf'
        }
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500