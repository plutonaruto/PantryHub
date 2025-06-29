from sqlalchemy import (
    Column, Integer, String, DateTime, Date, ForeignKey,
    CheckConstraint
)
from sqlalchemy.orm import relationship, validates
from datetime import datetime
from base import Base  

class Item(Base):
    __tablename__ = 'items'
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_quantity'),
    )

    
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    room_no = Column(String(50), nullable=False )
    owner_id = Column(String(64),  nullable=False)
    pantry_id = Column(Integer, nullable=False)
    expiry_date = Column(Date, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
 
