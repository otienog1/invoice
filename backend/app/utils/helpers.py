import uuid
from datetime import datetime

def format_currency(amount, currency='USD'):
    """Format currency amount"""
    symbol = '$' if currency == 'USD' else currency
    return f"{symbol}{amount:,.2f}"

def generate_invoice_number():
    """Generate unique invoice number"""
    prefix = f"INV-{datetime.now().year}-"
    suffix = str(uuid.uuid4())[:8].upper()
    return f"{prefix}{suffix}"