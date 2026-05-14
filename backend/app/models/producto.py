from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Producto(Base):
    __tablename__ = "PRODUCTOS"
    
    ID_PRODUCTO = Column(Integer, primary_key=True, index=True)
    NOMBRE = Column(String(100))
    ID_MARCA = Column(Integer, ForeignKey("MARCAS.ID_MARCA"))
    ID_CATEGORIA = Column(Integer, ForeignKey("CATEGORIAS.ID_CATEGORIA"))
    IMAGEN_URL = Column(String(500), nullable=True)
    
    # Relaciones
    marca = relationship("Marca", backref="productos")
    categoria = relationship("Categoria", backref="productos")