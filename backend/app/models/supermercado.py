from sqlalchemy import Column, Integer, String
from app.database import Base

class Supermercado(Base):
    __tablename__ = "SUPERMERCADOS"
    
    ID_SUPERMERCADO = Column(Integer, primary_key=True, index=True)
    NOMBRE = Column(String(100))
    DIRECCION = Column(String(200))
    IMAGEN_URL = Column(String(500), nullable=True)