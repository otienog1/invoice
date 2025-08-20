from app import db
from .base import BaseModel

class Tenant(BaseModel):
    __tablename__ = 'tenants'
    
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    domain = db.Column(db.String(100), unique=True)
    logo = db.Column(db.String(200))
    settings = db.Column(db.JSON, default={})
    is_active = db.Column(db.Boolean, default=True)
    
    # Subscription/billing info
    plan = db.Column(db.String(50), default='free')
    max_users = db.Column(db.Integer, default=5)
    max_invoices = db.Column(db.Integer, default=100)
    
    # Relationships
    users = db.relationship('User', backref='tenant', lazy=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'domain': self.domain,
            'logo': self.logo,
            'settings': self.settings,
            'is_active': self.is_active,
            'plan': self.plan,
            'max_users': self.max_users,
            'max_invoices': self.max_invoices,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }