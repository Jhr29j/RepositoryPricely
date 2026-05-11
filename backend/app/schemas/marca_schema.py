from pydantic import BaseModel
from typing import Optional

class MarcaBase(BaseModel):
    NOMBRE: str

class MarcaCreate(MarcaBase):
    pass

class MarcaOut(MarcaBase):
    ID_MARCA: int
    
    class Config:
        from_attributes = True

class MarcaUpdate(BaseModel):
    NOMBRE: Optional[str] = None