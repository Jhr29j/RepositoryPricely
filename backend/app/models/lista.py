from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Lista(Base):
    __tablename__ = "LISTAS"
    
    ID_LISTA = Column(Integer, primary_key=True, index=True)
    ID_USUARIO = Column(Integer, ForeignKey("USUARIOS.ID_USUARIO"))
    NOMBRE = Column(String(100))
    FECHA_CREACION = Column(DateTime, server_default=func.now())
    
    # Relaciones
    usuario = relationship("Usuario", backref="listas")