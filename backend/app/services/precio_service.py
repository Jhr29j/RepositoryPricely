from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.precio import PrecioProducto
from app.models.producto import Producto
from app.models.supermercado import Supermercado
from app.schemas.precio_schema import PrecioCreate

class PrecioService:
    
    @staticmethod
    def get_precios_by_producto(db: Session, id_producto: int):
        resultados_db = db.query(
            PrecioProducto.ID_PRECIO,
            PrecioProducto.ID_PRODUCTO,
            Producto.NOMBRE.label("NOMBRE_PRODUCTO"),
            PrecioProducto.ID_SUPERMERCADO,
            Supermercado.NOMBRE.label("NOMBRE_SUPERMERCADO"),
            PrecioProducto.PRECIO,
            PrecioProducto.FECHA_ACTUALIZACION
        ).join(
            Producto, PrecioProducto.ID_PRODUCTO == Producto.ID_PRODUCTO
        ).join(
            Supermercado, PrecioProducto.ID_SUPERMERCADO == Supermercado.ID_SUPERMERCADO
        ).filter(
            PrecioProducto.ID_PRODUCTO == id_producto
        ).all()
        
        return [
            {
                "id_precio": r.ID_PRECIO,
                "id_producto": r.ID_PRODUCTO,
                "nombre_producto": r.NOMBRE_PRODUCTO,
                "id_supermercado": r.ID_SUPERMERCADO,
                "nombre_supermercado": r.NOMBRE_SUPERMERCADO,
                "precio": float(r.PRECIO),
                "fecha_actualizacion": r.FECHA_ACTUALIZACION
            } for r in resultados_db
        ]
    
    @staticmethod
    def get_precio_especifico(db: Session, id_producto: int, id_supermercado: int):
        return db.query(PrecioProducto).filter(
            PrecioProducto.ID_PRODUCTO == id_producto,
            PrecioProducto.ID_SUPERMERCADO == id_supermercado
        ).first()
    
    @staticmethod
    def create_or_update_precio(db: Session, precio_data: PrecioCreate):
        existing = PrecioService.get_precio_especifico(
            db, precio_data.id_producto, precio_data.id_supermercado
        )
        
        if existing:
            existing.PRECIO = precio_data.precio
            db.commit()
            db.refresh(existing)
            return {
                "id_precio": existing.ID_PRECIO,
                "id_producto": existing.ID_PRODUCTO,
                "id_supermercado": existing.ID_SUPERMERCADO,
                "precio": float(existing.PRECIO),
                "fecha_actualizacion": existing.FECHA_ACTUALIZACION
            }, "Precio actualizado"
        else:
            new_precio = PrecioProducto(
                ID_PRODUCTO=precio_data.id_producto,
                ID_SUPERMERCADO=precio_data.id_supermercado,
                PRECIO=precio_data.precio
            )
            db.add(new_precio)
            db.commit()
            db.refresh(new_precio)
            return {
                "id_precio": new_precio.ID_PRECIO,
                "id_producto": new_precio.ID_PRODUCTO,
                "id_supermercado": new_precio.ID_SUPERMERCADO,
                "precio": float(new_precio.PRECIO),
                "fecha_actualizacion": new_precio.FECHA_ACTUALIZACION
            }, "Precio creado"
    
    @staticmethod
    def get_producto_mas_barato(db: Session, id_producto: int):
        # Usar la vista vw_producto_mas_barato
        result = db.execute(
            text("SELECT NOMBRE, PRECIO_MINIMO FROM vw_producto_mas_barato WHERE NOMBRE = (SELECT NOMBRE FROM PRODUCTOS WHERE ID_PRODUCTO = :id)"),
            {"id": id_producto}
        ).first()
        if not result: return None
        return {
            "nombre": result.NOMBRE,
            "precio_minimo": float(result.PRECIO_MINIMO)
        }
    
    @staticmethod
    def get_all_prices_with_details(db: Session):
        # Usar la vista vw_productos_precios
        resultados_db = db.execute(text("SELECT * FROM vw_productos_precios")).all()
        return [dict(r._mapping) for r in resultados_db]