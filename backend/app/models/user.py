from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from .base import BaseModel

class User(BaseModel):
    __tablename__ = 'users'
    
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True)
    name = db.Column(db.String(200), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    avatar = db.Column(db.String(200))
    company_name = db.Column(db.String(200))
    company_address = db.Column(db.Text)
    company_logo = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    invoices = db.relationship('Invoice', backref='user', lazy=True, cascade='all, delete-orphan')
    customers = db.relationship('Customer', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary (exclude sensitive data)"""
        data = super().to_dict()
        data.pop('password_hash', None)
        return data