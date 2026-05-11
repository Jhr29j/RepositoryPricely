from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.schemas.usuario_schema import UsuarioCreate
from app.security import get_password_hash, verify_password, create_access_token

class AuthService:
    
    @staticmethod
    def get_usuario_by_correo(db: Session, correo: str):
        return db.query(Usuario).filter(Usuario.CORREO == correo).first()
    
    @staticmethod
    def get_usuario_by_id(db: Session, id_usuario: int):
        return db.query(Usuario).filter(Usuario.ID_USUARIO == id_usuario).first()
    
    @staticmethod
    def register_user(db: Session, user_data: UsuarioCreate):
        # Verificar si el usuario ya existe
        existing_user = AuthService.get_usuario_by_correo(db, user_data.CORREO)
        if existing_user:
            return None, "El correo ya está registrado"
        
        # Crear nuevo usuario
        hashed_password = get_password_hash(user_data.CONTRASENA)
        new_user = Usuario(
            NOMBRE=user_data.NOMBRE,
            CORREO=user_data.CORREO,
            PASSWORD_HASH=hashed_password,
            ID_ROL=user_data.ID_ROL
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user, "Usuario registrado exitosamente"
    
    @staticmethod
    def login_user(db: Session, correo: str, contrasena: str):
        usuario = AuthService.get_usuario_by_correo(db, correo)
        if not usuario:
            return None, "Correo o contraseña incorrectos"
        
        if not verify_password(contrasena, usuario.PASSWORD_HASH):
            return None, "Correo o contraseña incorrectos"
        
        # Obtener el nombre del rol
        rol_nombre = db.query(Rol.NOMBRE).filter(Rol.ID_ROL == usuario.ID_ROL).scalar()
        
        # Crear token
        token_data = {
            "sub": usuario.CORREO,
            "id_usuario": usuario.ID_USUARIO,
            "rol": rol_nombre
        }
        access_token = create_access_token(data=token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "usuario": {
                "ID_USUARIO": usuario.ID_USUARIO,
                "NOMBRE": usuario.NOMBRE,
                "CORREO": usuario.CORREO,
                "ROL": rol_nombre
            }
        }, "Login exitoso"