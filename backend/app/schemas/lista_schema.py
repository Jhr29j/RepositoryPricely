from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class DetalleListaBase(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario: float

class DetalleListaCreate(DetalleListaBase):
    pass

class DetalleListaOut(DetalleListaBase):
    id_detalle: int
    subtotal: float
    nombre_producto: Optional[str] = None
    
    class Config:
        from_attributes = True

class ListaBase(BaseModel):
    nombre: str

class ListaCreate(ListaBase):
    pass

class ListaOut(ListaBase):
    id_lista: int
    id_usuario: int
    fecha_creacion: datetime
    items: List[DetalleListaOut] = []
    total: Optional[float] = None
    
    class Config:
        from_attributes = True