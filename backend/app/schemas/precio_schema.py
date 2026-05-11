from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrecioBase(BaseModel):
    ID_PRODUCTO: int
    ID_SUPERMERCADO: int
    PRECIO: float

class PrecioCreate(PrecioBase):
    pass

class PrecioOut(PrecioBase):
    ID_PRECIO: int
    FECHA_ACTUALIZACION: datetime
    NOMBRE_PRODUCTO: Optional[str] = None
    NOMBRE_SUPERMERCADO: Optional[str] = None
    
    class Config:
        from_attributes = True

class PrecioUpdate(BaseModel):
    PRECIO: float