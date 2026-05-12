from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.services.producto_service import ProductoService
from app.schemas.producto_schema import ProductoCreate, ProductoOut, ProductoUpdate

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=List[ProductoOut])
def get_all_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(1000, ge=1, le=2000),
    busqueda: Optional[str] = Query(None, alias="q"),
    search: Optional[str] = None,
    categoria: Optional[int] = None,
    marca: Optional[int] = None,
    supermercado: Optional[str] = None,
    solo_ofertas: bool = False,
    db: Session = Depends(get_db)
):
    """Obtener todos los productos con filtros opcionales"""
    # Usamos busqueda o search indistintamente
    search_term = busqueda or search
    
    return ProductoService.get_all_productos_paginated(
        db, 
        skip=skip, 
        limit=limit, 
        search=search_term, 
        categoria=categoria, 
        marca=marca,
        supermercado=supermercado,
        solo_ofertas=solo_ofertas
    )

@router.post("/", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def create_producto(producto_data: ProductoCreate, db: Session = Depends(get_db)):
    """Crear un nuevo producto (requiere autenticación de admin)"""
    # TODO: Agregar verificación de rol admin
    return ProductoService.create_producto(db, producto_data)

@router.put("/{id_producto}", response_model=ProductoOut)
def update_producto(id_producto: int, producto_data: ProductoUpdate, db: Session = Depends(get_db)):
    """Actualizar un producto (requiere autenticación de admin)"""
    producto = ProductoService.update_producto(db, id_producto, producto_data)
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto

@router.delete("/{id_producto}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(id_producto: int, db: Session = Depends(get_db)):
    """Eliminar un producto (requiere autenticación de admin)"""
    success = ProductoService.delete_producto(db, id_producto)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return None