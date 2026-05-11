from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.supermercado import Supermercado
from app.schemas.supermercado_schema import SupermercadoCreate, SupermercadoOut, SupermercadoUpdate

router = APIRouter(prefix="/supermercados", tags=["Supermercados"])

@router.get("/", response_model=List[SupermercadoOut])
def get_all_supermercados(db: Session = Depends(get_db)):
    """Obtener todos los supermercados"""
    supermercados = db.query(Supermercado).all()
    return supermercados

@router.get("/{id_supermercado}", response_model=SupermercadoOut)
def get_supermercado(id_supermercado: int, db: Session = Depends(get_db)):
    """Obtener un supermercado por ID"""
    supermercado = db.query(Supermercado).filter(Supermercado.ID_SUPERMERCADO == id_supermercado).first()
    if not supermercado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supermercado no encontrado")
    return supermercado

@router.post("/", response_model=SupermercadoOut, status_code=status.HTTP_201_CREATED)
def create_supermercado(supermercado_data: SupermercadoCreate, db: Session = Depends(get_db)):
    """Crear un nuevo supermercado (requiere autenticación de admin)"""
    new_supermercado = Supermercado(
        NOMBRE=supermercado_data.NOMBRE,
        DIRECCION=supermercado_data.DIRECCION,
        IMAGEN_URL=supermercado_data.IMAGEN_URL
    )
    db.add(new_supermercado)
    db.commit()
    db.refresh(new_supermercado)
    return new_supermercado

@router.put("/{id_supermercado}", response_model=SupermercadoOut)
def update_supermercado(id_supermercado: int, supermercado_data: SupermercadoUpdate, db: Session = Depends(get_db)):
    """Actualizar un supermercado (requiere autenticación de admin)"""
    supermercado = db.query(Supermercado).filter(Supermercado.ID_SUPERMERCADO == id_supermercado).first()
    if not supermercado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supermercado no encontrado")
    
    if supermercado_data.NOMBRE is not None:
        supermercado.NOMBRE = supermercado_data.NOMBRE
    if supermercado_data.DIRECCION is not None:
        supermercado.DIRECCION = supermercado_data.DIRECCION
    if supermercado_data.IMAGEN_URL is not None:
        supermercado.IMAGEN_URL = supermercado_data.IMAGEN_URL
    
    db.commit()
    db.refresh(supermercado)
    return supermercado

@router.delete("/{id_supermercado}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supermercado(id_supermercado: int, db: Session = Depends(get_db)):
    """Eliminar un supermercado (requiere autenticación de admin)"""
    supermercado = db.query(Supermercado).filter(Supermercado.ID_SUPERMERCADO == id_supermercado).first()
    if not supermercado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supermercado no encontrado")
    db.delete(supermercado)
    db.commit()
    return None