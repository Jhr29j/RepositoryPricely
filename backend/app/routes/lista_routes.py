from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.lista_service import ListaService
from app.schemas.lista_schema import ListaCreate, ListaOut, DetalleListaCreate, DetalleListaOut

router = APIRouter(prefix="/listas", tags=["Listas"])

# Por ahora usamos un ID de usuario fijo para pruebas
# TODO: Implementar autenticación para obtener el usuario actual
FIXED_USER_ID = 1

@router.get("/", response_model=List[ListaOut])
def get_user_listas(db: Session = Depends(get_db)):
    """Obtener todas las listas del usuario autenticado"""
    listas = ListaService.get_listas_by_usuario(db, FIXED_USER_ID)
    return listas

@router.get("/{id_lista}", response_model=ListaOut)
def get_lista_details(id_lista: int, db: Session = Depends(get_db)):
    """Obtener detalles de una lista con productos y total"""
    result = ListaService.get_lista_with_details(db, id_lista)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lista no encontrada")
    return result

@router.post("/", response_model=ListaOut, status_code=status.HTTP_201_CREATED)
def create_lista(lista_data: ListaCreate, db: Session = Depends(get_db)):
    """Crear una nueva lista de compras"""
    new_lista = ListaService.create_lista(db, FIXED_USER_ID, lista_data)
    return new_lista

@router.post("/{id_lista}/agregar", response_model=DetalleListaOut)
def add_producto_to_lista(id_lista: int, detalle_data: DetalleListaCreate, db: Session = Depends(get_db)):
    """Agregar un producto a una lista"""
    # Verificar que la lista existe y pertenece al usuario
    lista = ListaService.get_lista_by_id(db, id_lista, FIXED_USER_ID)
    if not lista:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lista no encontrada")
    
    new_detalle = ListaService.add_producto_to_lista(db, id_lista, detalle_data)
    return new_detalle

@router.delete("/detalle/{id_detalle}", status_code=status.HTTP_204_NO_CONTENT)
def remove_producto_from_lista(id_detalle: int, db: Session = Depends(get_db)):
    """Eliminar un producto de una lista"""
    # Obtener el id_lista desde el detalle
    from app.models.detalle_lista import DetalleLista
    detalle = db.query(DetalleLista).filter(DetalleLista.ID_DETALLE == id_detalle).first()
    if not detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detalle no encontrado")
    
    success = ListaService.remove_producto_from_lista(db, id_detalle, detalle.ID_LISTA)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se pudo eliminar el producto")
    return None

@router.delete("/{id_lista}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lista(id_lista: int, db: Session = Depends(get_db)):
    """Eliminar una lista completa"""
    success = ListaService.delete_lista(db, id_lista, FIXED_USER_ID)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lista no encontrada")
    return None