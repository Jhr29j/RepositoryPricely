from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    id_usuario: Optional[int] = None
    correo: Optional[str] = None
    rol: Optional[str] = None