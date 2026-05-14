from sqlalchemy import Column, Integer, String
from app.database import Base

class Rol(Base):
    __tablename__ = "ROLES"
    
    ID_ROL = Column(Integer, primary_key=True, index=True)
    NOMBRE = Column(String(50))