from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.lista import Lista
from app.models.detalle_lista import DetalleLista
from app.schemas.lista_schema import ListaCreate, DetalleListaCreate

class ListaService:
    
    @staticmethod
    def get_listas_by_usuario(db: Session, id_usuario: int):
        return db.query(Lista).filter(Lista.ID_USUARIO == id_usuario).all()
    
    @staticmethod
    def get_lista_by_id(db: Session, id_lista: int, id_usuario: int = None):
        query = db.query(Lista).filter(Lista.ID_LISTA == id_lista)
        if id_usuario:
            query = query.filter(Lista.ID_USUARIO == id_usuario)
        return query.first()
    
    @staticmethod
    def create_lista(db: Session, id_usuario: int, lista_data: ListaCreate):
        new_lista = Lista(
            ID_USUARIO=id_usuario,
            NOMBRE=lista_data.NOMBRE
        )
        db.add(new_lista)
        db.commit()
        db.refresh(new_lista)
        return new_lista
    
    @staticmethod
    def delete_lista(db: Session, id_lista: int, id_usuario: int):
        lista = ListaService.get_lista_by_id(db, id_lista, id_usuario)
        if not lista:
            return False
        db.delete(lista)
        db.commit()
        return True
    
    @staticmethod
    def add_producto_to_lista(db: Session, id_lista: int, detalle_data: DetalleListaCreate):
        subtotal = detalle_data.CANTIDAD * detalle_data.PRECIO_UNITARIO
        new_detalle = DetalleLista(
            ID_LISTA=id_lista,
            ID_PRODUCTO=detalle_data.ID_PRODUCTO,
            CANTIDAD=detalle_data.CANTIDAD,
            PRECIO_UNITARIO=detalle_data.PRECIO_UNITARIO,
            SUBTOTAL=subtotal
        )
        db.add(new_detalle)
        db.commit()
        db.refresh(new_detalle)
        return new_detalle
    
    @staticmethod
    def remove_producto_from_lista(db: Session, id_detalle: int, id_lista: int):
        detalle = db.query(DetalleLista).filter(
            DetalleLista.ID_DETALLE == id_detalle,
            DetalleLista.ID_LISTA == id_lista
        ).first()
        if not detalle:
            return False
        db.delete(detalle)
        db.commit()
        return True
    
    @staticmethod
    def update_cantidad(db: Session, id_detalle: int, cantidad: int):
        detalle = db.query(DetalleLista).filter(DetalleLista.ID_DETALLE == id_detalle).first()
        if not detalle:
            return None
        detalle.CANTIDAD = cantidad
        detalle.SUBTOTAL = cantidad * detalle.PRECIO_UNITARIO
        db.commit()
        db.refresh(detalle)
        return detalle
    
    @staticmethod
    def get_lista_total(db: Session, id_lista: int):
        # Usar la vista vw_total_lista
        result = db.execute(
            text("SELECT TOTAL FROM vw_total_lista WHERE ID_LISTA = :id"),
            {"id": id_lista}
        ).first()
        return result.TOTAL if result else 0
    
    @staticmethod
    def get_lista_with_details(db: Session, id_lista: int):
        lista = ListaService.get_lista_by_id(db, id_lista)
        if not lista:
            return None
        
        detalles = db.query(DetalleLista).filter(DetalleLista.ID_LISTA == id_lista).all()
        total = ListaService.get_lista_total(db, id_lista)
        
        return {
            "lista": lista,
            "detalles": detalles,
            "total": total
        }