from pydantic import BaseModel
from typing import Optional

class CategoriaBase(BaseModel):
    NOMBRE: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaOut(CategoriaBase):
    ID_CATEGORIA: int
    
    class Config:
        from_attributes = True

class CategoriaUpdate(BaseModel):
    NOMBRE: Optional[str] = None