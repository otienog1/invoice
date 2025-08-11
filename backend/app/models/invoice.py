from datetime import datetime, timedelta
from app import db
from .base import BaseModel

class Invoice(BaseModel):
    __tablename__ = 'invoices'
    
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    issue_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='draft')  # draft, sent, paid, overdue
    
    # Financial fields
    subtotal = db.Column(db.Numeric(10, 2), default=0)
    tax_rate = db.Column(db.Numeric(5, 2), default=0)
    tax_amount = db.Column(db.Numeric(10, 2), default=0)
    discount_rate = db.Column(db.Numeric(5, 2), default=0)
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    total_amount = db.Column(db.Numeric(10, 2), default=0)
    
    # Payment tracking
    paid_amount = db.Column(db.Numeric(10, 2), default=0)
    payment_date = db.Column(db.DateTime)
    
    # Additional fields
    notes = db.Column(db.Text)
    terms = db.Column(db.Text)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    # Relationships
    items = db.relationship('InvoiceItem', backref='invoice', lazy=True, cascade='all, delete-orphan')
    
    def generate_invoice_number(self):
        """Generate unique invoice number"""
        import uuid
        prefix = f"INV-{datetime.now().year}-"
        suffix = str(uuid.uuid4())[:8].upper()
        self.invoice_number = f"{prefix}{suffix}"
    
    def calculate_totals(self):
        """Calculate invoice totals"""
        self.subtotal = sum(item.total for item in self.items)
        self.discount_amount = self.subtotal * (self.discount_rate / 100)
        subtotal_after_discount = self.subtotal - self.discount_amount
        self.tax_amount = subtotal_after_discount * (self.tax_rate / 100)
        self.total_amount = subtotal_after_discount + self.tax_amount
    
    def is_overdue(self):
        """Check if invoice is overdue"""
        return self.due_date and datetime.utcnow() > self.due_date and self.status != 'paid'
    
    def __repr__(self):
        return f'<Invoice {self.invoice_number}>'

class InvoiceItem(BaseModel):
    __tablename__ = 'invoice_items'
    
    description = db.Column(db.String(500), nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False, default=1)
    rate = db.Column(db.Numeric(10, 2), nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Foreign key
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'), nullable=False)
    
    def calculate_total(self):
        """Calculate item total"""
        self.total = self.quantity * self.rate
    
    def __repr__(self):
        return f'<InvoiceItem {self.description}>'