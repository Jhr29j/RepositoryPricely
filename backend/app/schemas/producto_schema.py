from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    NOMBRE: str
    ID_MARCA: int
    ID_CATEGORIA: int
    IMAGEN_URL: Optional[str] = None

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
    ID_PRODUCTO: int
    precios: List[PrecioSimpleOut] = []
    en_oferta: bool = False
    precio_minimo: float = 0.0
    marca: Optional[str] = None
    categoria: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProductoUpdate(BaseModel):
    NOMBRE: Optional[str] = None
    ID_MARCA: Optional[int] = None
    ID_CATEGORIA: Optional[int] = None
    IMAGEN_URL: Optional[str] = None