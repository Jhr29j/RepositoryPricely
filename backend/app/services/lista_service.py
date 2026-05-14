from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.lista import Lista
from app.models.detalle_lista import DetalleLista
from app.models.producto import Producto
from app.schemas.lista_schema import ListaCreate, DetalleListaCreate

class ListaService:
    
    @staticmethod
    def get_listas_by_usuario(db: Session, id_usuario: int):
        listas = db.query(Lista).filter(Lista.ID_USUARIO == id_usuario).all()
        return [
            {
                "id_lista": l.ID_LISTA,
                "id_usuario": l.ID_USUARIO,
                "nombre": l.NOMBRE,
                "fecha_creacion": l.FECHA_CREACION,
                "total": ListaService.get_lista_total(db, l.ID_LISTA)
            } for l in listas
        ]
    
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
            NOMBRE=lista_data.nombre
        )
        db.add(new_lista)
        db.commit()
        db.refresh(new_lista)
        return {
            "id_lista": new_lista.ID_LISTA,
            "id_usuario": new_lista.ID_USUARIO,
            "nombre": new_lista.NOMBRE,
            "fecha_creacion": new_lista.FECHA_CREACION,
            "items": [],
            "total": 0.0
        }
    
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
        subtotal = detalle_data.cantidad * detalle_data.precio_unitario
        new_detalle = DetalleLista(
            ID_LISTA=id_lista,
            ID_PRODUCTO=detalle_data.id_producto,
            CANTIDAD=detalle_data.cantidad,
            PRECIO_UNITARIO=detalle_data.precio_unitario,
            SUBTOTAL=subtotal
        )
        db.add(new_detalle)
        db.commit()
        db.refresh(new_detalle)
        return {
            "id_detalle": new_detalle.ID_DETALLE,
            "id_producto": new_detalle.ID_PRODUCTO,
            "cantidad": new_detalle.CANTIDAD,
            "precio_unitario": float(new_detalle.PRECIO_UNITARIO),
            "subtotal": float(new_detalle.SUBTOTAL)
        }
    
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
        return result.TOTAL if result else 0.0
    
    @staticmethod
    def get_lista_with_details(db: Session, id_lista: int):
        lista = ListaService.get_lista_by_id(db, id_lista)
        if not lista:
            return None
        
        # Obtener detalles con nombre de producto
        detalles_db = db.query(DetalleLista, Producto.NOMBRE)\
            .join(Producto, DetalleLista.ID_PRODUCTO == Producto.ID_PRODUCTO)\
            .filter(DetalleLista.ID_LISTA == id_lista).all()
            
        items = []
        for det, nombre in detalles_db:
            items.append({
                "id_detalle": det.ID_DETALLE,
                "id_producto": det.ID_PRODUCTO,
                "cantidad": det.CANTIDAD,
                "precio_unitario": float(det.PRECIO_UNITARIO),
                "subtotal": float(det.SUBTOTAL),
                "nombre_producto": nombre
            })
            
        total = ListaService.get_lista_total(db, id_lista)
        
        return {
            "id_lista": lista.ID_LISTA,
            "id_usuario": lista.ID_USUARIO,
            "nombre": lista.NOMBRE,
            "fecha_creacion": lista.FECHA_CREACION,
            "items": items,
            "total": float(total)
        }