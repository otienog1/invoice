from datetime import datetime
from app import db

class TimestampMixin:
    """Mixin for timestamp fields"""
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )

class BaseModel(db.Model, TimestampMixin):
    """Base model with common fields"""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }
    
    def save(self):
        """Save model to database"""
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        """Delete model from database"""
        db.session.delete(self)
        db.session.commit()