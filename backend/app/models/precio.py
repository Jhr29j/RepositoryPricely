from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class PrecioProducto(Base):
    __tablename__ = "PRECIOS_PRODUCTOS"
    
    ID_PRECIO = Column(Integer, primary_key=True, index=True)
    ID_PRODUCTO = Column(Integer, ForeignKey("PRODUCTOS.ID_PRODUCTO"))
    ID_SUPERMERCADO = Column(Integer, ForeignKey("SUPERMERCADOS.ID_SUPERMERCADO"))
    PRECIO = Column(Numeric(10, 2))
    FECHA_ACTUALIZACION = Column(DateTime, server_default=func.now())
    
    # Relaciones
    producto = relationship("Producto", backref="precios")
    supermercado = relationship("Supermercado", backref="precios")