from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    id_rol: int = 1  # Por defecto rol de usuario normal

class UsuarioCreate(UsuarioBase):
    contrasena: str  # Contraseña en texto plano para el registro

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str

class UsuarioOut(UsuarioBase):
    id_usuario: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True  # Para SQLAlchemy

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    contrasena: Optional[str] = None
    id_rol: Optional[int] = None