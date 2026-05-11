from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class DetalleLista(Base):
    __tablename__ = "DETALLE_LISTA"
    
    ID_DETALLE = Column(Integer, primary_key=True, index=True)
    ID_LISTA = Column(Integer, ForeignKey("LISTAS.ID_LISTA"))
    ID_PRODUCTO = Column(Integer, ForeignKey("PRODUCTOS.ID_PRODUCTO"))
    CANTIDAD = Column(Integer)
    PRECIO_UNITARIO = Column(Numeric(10, 2))
    SUBTOTAL = Column(Numeric(10, 2))
    
    # Relaciones
    lista = relationship("Lista", backref="detalles")
    producto = relationship("Producto", backref="detalles")