from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UsuarioBase(BaseModel):
    NOMBRE: str
    CORREO: EmailStr
    ID_ROL: int = 1  # Por defecto rol de usuario normal

class UsuarioCreate(UsuarioBase):
    CONTRASENA: str  # Contraseña en texto plano para el registro

class UsuarioLogin(BaseModel):
    CORREO: EmailStr
    CONTRASENA: str

class UsuarioOut(UsuarioBase):
    ID_USUARIO: int
    FECHA_CREACION: datetime
    
    class Config:
        from_attributes = True  # Para SQLAlchemy

class UsuarioUpdate(BaseModel):
    NOMBRE: Optional[str] = None
    CORREO: Optional[EmailStr] = None
    CONTRASENA: Optional[str] = None
    ID_ROL: Optional[int] = None