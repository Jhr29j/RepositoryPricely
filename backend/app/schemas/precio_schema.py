from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrecioBase(BaseModel):
    id_producto: int
    id_supermercado: int
    precio: float

class PrecioCreate(PrecioBase):
    pass

class PrecioOut(PrecioBase):
    id_precio: int
    fecha_actualizacion: datetime
    nombre_producto: Optional[str] = None
    nombre_supermercado: Optional[str] = None
    
    class Config:
        from_attributes = True

class PrecioUpdate(BaseModel):
    precio: float