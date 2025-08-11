def validate_invoice_data(data):
    """Validate invoice creation data"""
    errors = []
    
    if not data:
        errors.append('No data provided')
        return errors
    
    # Required fields
    if not data.get('customer_id'):
        errors.append('customer_id is required')
    
    # Validate items
    items = data.get('items', [])
    if not items:
        errors.append('At least one invoice item is required')
    else:
        for i, item in enumerate(items):
            if not item.get('description'):
                errors.append(f'Item {i+1}: description is required')
            if not item.get('quantity') or float(item['quantity']) <= 0:
                errors.append(f'Item {i+1}: quantity must be greater than 0')
            if not item.get('rate') or float(item['rate']) <= 0:
                errors.append(f'Item {i+1}: rate must be greater than 0')
    
    # Validate rates
    if 'tax_rate' in data and (float(data['tax_rate']) < 0 or float(data['tax_rate']) > 100):
        errors.append('Tax rate must be between 0 and 100')
    
    if 'discount_rate' in data and (float(data['discount_rate']) < 0 or float(data['discount_rate']) > 100):
        errors.append('Discount rate must be between 0 and 100')
    
    return errors