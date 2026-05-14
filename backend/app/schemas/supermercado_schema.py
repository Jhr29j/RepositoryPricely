from pydantic import BaseModel
from typing import Optional

class SupermercadoBase(BaseModel):
    NOMBRE: str
    DIRECCION: str
    IMAGEN_URL: Optional[str] = None

class SupermercadoCreate(SupermercadoBase):
    pass

class SupermercadoOut(SupermercadoBase):
    ID_SUPERMERCADO: int
    
    class Config:
        from_attributes = True

class SupermercadoUpdate(BaseModel):
    NOMBRE: Optional[str] = None
    DIRECCION: Optional[str] = None
    IMAGEN_URL: Optional[str] = None