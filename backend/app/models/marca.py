from sqlalchemy import Column, Integer, String
from app.database import Base

class Marca(Base):
    __tablename__ = "MARCAS"
    
    ID_MARCA = Column(Integer, primary_key=True, index=True)
    NOMBRE = Column(String(100))