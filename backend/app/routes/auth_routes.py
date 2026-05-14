from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.usuario_schema import UsuarioCreate, UsuarioLogin, UsuarioOut
from app.schemas.auth_schema import Token

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register(user_data: UsuarioCreate, db: Session = Depends(get_db)):
    """Registrar un nuevo usuario"""
    user, message = AuthService.register_user(db, user_data)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)
    return {"message": message, "user_id": user.ID_USUARIO}

@router.post("/login", response_model=dict)
def login(user_data: UsuarioLogin, db: Session = Depends(get_db)):
    """Iniciar sesión y obtener token JWT"""
    result, message = AuthService.login_user(db, user_data.CORREO, user_data.CONTRASENA)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=message)
    return result

@router.get("/me", response_model=dict)
def get_current_user():
    """Obtener información del usuario autenticado (requiere token)"""
    # TODO: Implementar dependencia de autenticación
    return {"message": "Endpoint protegido - implementar token validation"}