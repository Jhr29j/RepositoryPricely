from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "USUARIOS"
    
    ID_USUARIO = Column(Integer, primary_key=True, index=True)
    NOMBRE = Column(String(100))
    CORREO = Column(String(100), unique=True)
    PASSWORD_HASH = Column(String(255))
    ID_ROL = Column(Integer, ForeignKey("ROLES.ID_ROL"))
    FECHA_CREACION = Column(DateTime, server_default=func.now())
    
    # Relaciones
    rol = relationship("Rol", backref="usuarios")