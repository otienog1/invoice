from app import db
from .base import BaseModel

class Customer(BaseModel):
    __tablename__ = 'customers'
    
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(15))
    address = db.Column(db.Text)
    tax_pin = db.Column(db.String(50))
    company = db.Column(db.String(200))
    
    # Foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    invoices = db.relationship('Invoice', backref='customer', lazy=True)
    
    def __repr__(self):
        return f'<Customer {self.name}>'