from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.models.marca import Marca
from app.models.categoria import Categoria
from app.schemas.usuario_schema import UsuarioOut
from app.schemas.marca_schema import MarcaCreate, MarcaOut
from app.schemas.categoria_schema import CategoriaCreate, CategoriaOut

router = APIRouter(prefix="/admin", tags=["Administración"])

# ========== GESTIÓN DE USUARIOS ==========

@router.get("/usuarios", response_model=List[UsuarioOut])
def get_all_usuarios(db: Session = Depends(get_db)):
    """Obtener todos los usuarios (requiere SuperAdmin)"""
    usuarios = db.query(Usuario).all()
    return usuarios

@router.put("/usuarios/{id_usuario}/rol/{id_rol}")
def change_user_role(id_usuario: int, id_rol: int, db: Session = Depends(get_db)):
    """Cambiar el rol de un usuario (requiere SuperAdmin)"""
    usuario = db.query(Usuario).filter(Usuario.ID_USUARIO == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    rol = db.query(Rol).filter(Rol.ID_ROL == id_rol).first()
    if not rol:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")
    
    usuario.ID_ROL = id_rol
    db.commit()
    return {"message": f"Rol actualizado a {rol.NOMBRE}"}

# ========== GESTIÓN DE MARCAS ==========

@router.get("/marcas", response_model=List[MarcaOut])
def get_all_marcas(db: Session = Depends(get_db)):
    """Obtener todas las marcas"""
    marcas = db.query(Marca).all()
    return marcas

@router.post("/marcas", response_model=MarcaOut, status_code=status.HTTP_201_CREATED)
def create_marca(marca_data: MarcaCreate, db: Session = Depends(get_db)):
    """Crear una nueva marca"""
    new_marca = Marca(NOMBRE=marca_data.NOMBRE)
    db.add(new_marca)
    db.commit()
    db.refresh(new_marca)
    return new_marca

@router.delete("/marcas/{id_marca}", status_code=status.HTTP_204_NO_CONTENT)
def delete_marca(id_marca: int, db: Session = Depends(get_db)):
    """Eliminar una marca"""
    marca = db.query(Marca).filter(Marca.ID_MARCA == id_marca).first()
    if not marca:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Marca no encontrada")
    db.delete(marca)
    db.commit()
    return None

# ========== GESTIÓN DE CATEGORÍAS ==========

@router.get("/categorias", response_model=List[CategoriaOut])
def get_all_categorias(db: Session = Depends(get_db)):
    """Obtener todas las categorías"""
    categorias = db.query(Categoria).all()
    return categorias

@router.post("/categorias", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def create_categoria(categoria_data: CategoriaCreate, db: Session = Depends(get_db)):
    """Crear una nueva categoría"""
    new_categoria = Categoria(NOMBRE=categoria_data.NOMBRE)
    db.add(new_categoria)
    db.commit()
    db.refresh(new_categoria)
    return new_categoria

@router.delete("/categorias/{id_categoria}", status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria(id_categoria: int, db: Session = Depends(get_db)):
    """Eliminar una categoría"""
    categoria = db.query(Categoria).filter(Categoria.ID_CATEGORIA == id_categoria).first()
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    db.delete(categoria)
    db.commit()
    return None