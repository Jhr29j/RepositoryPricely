from pydantic import BaseModel
from typing import Optional, List

class ProductoBase(BaseModel):
    nombre: str
    id_marca: int
    id_categoria: int
    imagen_url: Optional[str] = None

class ProductoCreate(ProductoBase):
    pass

class PrecioSimpleOut(BaseModel):
    id_precio: int
    precio: float
    precio_oferta: Optional[float] = None
    en_oferta: bool
    supermercado: Optional[str] = None

    class Config:
        from_attributes = True

class ProductoOut(ProductoBase):
    id_producto: int
    precios: List[PrecioSimpleOut] = []
    en_oferta: bool = False
    precio_minimo: float = 0.0
    marca: Optional[str] = None
    categoria: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    id_marca: Optional[int] = None
    id_categoria: Optional[int] = None
    imagen_url: Optional[str] = None