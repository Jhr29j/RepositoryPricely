from sqlalchemy import Column, Integer, String
from app.database import Base

class Categoria(Base):
    __tablename__ = "CATEGORIAS"
    
    ID_CATEGORIA = Column(Integer, primary_key=True, index=True)
    NOMBRE = Column(String(100))