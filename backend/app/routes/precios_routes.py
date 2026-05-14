from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.precio_service import PrecioService
from app.schemas.precio_schema import PrecioCreate, PrecioOut

router = APIRouter(prefix="/precios", tags=["Precios"])

@router.get("/producto/{id_producto}", response_model=List[PrecioOut])
def get_precios_by_producto(id_producto: int, db: Session = Depends(get_db)):
    """Obtener todos los precios de un producto por supermercado"""
    precios = PrecioService.get_precios_by_producto(db, id_producto)
    if not precios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron precios para este producto")
    return precios

@router.post("/", response_model=PrecioOut, status_code=status.HTTP_201_CREATED)
def create_or_update_precio(precio_data: PrecioCreate, db: Session = Depends(get_db)):
    """Crear o actualizar un precio de producto en un supermercado (requiere admin)"""
    precio, message = PrecioService.create_or_update_precio(db, precio_data)
    return precio

@router.get("/barato/{id_producto}")
def get_producto_mas_barato(id_producto: int, db: Session = Depends(get_db)):
    """Obtener el precio más barato de un producto usando la vista"""
    result = PrecioService.get_producto_mas_barato(db, id_producto)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return {"producto": result.NOMBRE, "precio_minimo": float(result.PRECIO_MINIMO)}