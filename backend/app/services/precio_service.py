from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.precio import PrecioProducto
from app.models.producto import Producto
from app.models.supermercado import Supermercado
from app.schemas.precio_schema import PrecioCreate

class PrecioService:
    
    @staticmethod
    def get_precios_by_producto(db: Session, id_producto: int):
        resultados = db.query(
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
        
        return resultados
    
    @staticmethod
    def get_precio_especifico(db: Session, id_producto: int, id_supermercado: int):
        return db.query(PrecioProducto).filter(
            PrecioProducto.ID_PRODUCTO == id_producto,
            PrecioProducto.ID_SUPERMERCADO == id_supermercado
        ).first()
    
    @staticmethod
    def create_or_update_precio(db: Session, precio_data: PrecioCreate):
        existing = PrecioService.get_precio_especifico(
            db, precio_data.ID_PRODUCTO, precio_data.ID_SUPERMERCADO
        )
        
        if existing:
            existing.PRECIO = precio_data.PRECIO
            db.commit()
            db.refresh(existing)
            return existing, "Precio actualizado"
        else:
            new_precio = PrecioProducto(
                ID_PRODUCTO=precio_data.ID_PRODUCTO,
                ID_SUPERMERCADO=precio_data.ID_SUPERMERCADO,
                PRECIO=precio_data.PRECIO
            )
            db.add(new_precio)
            db.commit()
            db.refresh(new_precio)
            return new_precio, "Precio creado"
    
    @staticmethod
    def get_producto_mas_barato(db: Session, id_producto: int):
        # Usar la vista vw_producto_mas_barato
        result = db.execute(
            text("SELECT NOMBRE, PRECIO_MINIMO FROM vw_producto_mas_barato WHERE NOMBRE = (SELECT NOMBRE FROM PRODUCTOS WHERE ID_PRODUCTO = :id)"),
            {"id": id_producto}
        ).first()
        return result
    
    @staticmethod
    def get_all_prices_with_details(db: Session):
        # Usar la vista vw_productos_precios
        result = db.execute(text("SELECT * FROM vw_productos_precios")).all()
        return result