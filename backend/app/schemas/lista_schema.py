from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class DetalleListaBase(BaseModel):
    ID_PRODUCTO: int
    CANTIDAD: int
    PRECIO_UNITARIO: float

class DetalleListaCreate(DetalleListaBase):
    pass

class DetalleListaOut(DetalleListaBase):
    ID_DETALLE: int
    SUBTOTAL: float
    
    class Config:
        from_attributes = True

class ListaBase(BaseModel):
    NOMBRE: str

class ListaCreate(ListaBase):
    pass

class ListaOut(ListaBase):
    ID_LISTA: int
    ID_USUARIO: int
    FECHA_CREACION: datetime
    detalles: List[DetalleListaOut] = []
    TOTAL: Optional[float] = None
    
    class Config:
        from_attributes = True