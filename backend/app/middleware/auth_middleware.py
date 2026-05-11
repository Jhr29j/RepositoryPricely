from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError
from app.database import get_db
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.security import decode_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Obtener el usuario actual a partir del token JWT"""
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    correo = payload.get("sub")
    if correo is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    usuario = db.query(Usuario).filter(Usuario.CORREO == correo).first()
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return usuario

def get_current_active_user(current_user: Usuario = Depends(get_current_user)):
    """Verificar que el usuario está activo"""
    # Por ahora solo verificamos que existe
    # Se puede agregar lógica de usuario activo/inactivo
    return current_user

def role_required(required_roles: list):
    """Verificar que el usuario tiene uno de los roles requeridos"""
    def role_checker(current_user: Usuario = Depends(get_current_user)):
        # Obtener el nombre del rol del usuario
        rol_nombre = current_user.rol.NOMBRE if current_user.rol else None
        
        if rol_nombre not in required_roles and "SuperAdmin" not in required_roles:
            # Si el usuario es SuperAdmin, permitir todo
            if rol_nombre != "SuperAdmin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permiso denegado. Se requiere uno de estos roles: {required_roles}"
                )
        return current_user
    return role_checker