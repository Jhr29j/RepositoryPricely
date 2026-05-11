from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    NOMBRE: str
    ID_MARCA: int
    ID_CATEGORIA: int
    IMAGEN_URL: Optional[str] = None

class ProductoCreate(ProductoBase):
    pass

class ProductoOut(ProductoBase):
    ID_PRODUCTO: int
    
    class Config:
        from_attributes = True

class ProductoUpdate(BaseModel):
    NOMBRE: Optional[str] = None
    ID_MARCA: Optional[int] = None
    ID_CATEGORIA: Optional[int] = None
    IMAGEN_URL: Optional[str] = None