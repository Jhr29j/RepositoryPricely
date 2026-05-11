from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.producto import Producto
from app.models.marca import Marca
from app.models.categoria import Categoria
from app.schemas.producto_schema import ProductoCreate, ProductoUpdate

class ProductoService:
    
    @staticmethod
    def get_all_productos(db: Session, skip: int = 0, limit: int = 100):
        # Agregamos order_by para SQL Server
        return db.query(Producto).order_by(Producto.ID_PRODUCTO).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_producto_by_id(db: Session, id_producto: int):
        return db.query(Producto).filter(Producto.ID_PRODUCTO == id_producto).first()
    
    @staticmethod
    def get_productos_by_categoria(db: Session, id_categoria: int):
        return db.query(Producto).filter(Producto.ID_CATEGORIA == id_categoria).order_by(Producto.ID_PRODUCTO).all()
    
    @staticmethod
    def get_productos_by_marca(db: Session, id_marca: int):
        return db.query(Producto).filter(Producto.ID_MARCA == id_marca).order_by(Producto.ID_PRODUCTO).all()
    
    @staticmethod
    def search_productos(db: Session, search_term: str):
        return db.query(Producto).filter(
            Producto.NOMBRE.contains(search_term)
        ).order_by(Producto.ID_PRODUCTO).all()
    
    @staticmethod
    def create_producto(db: Session, producto_data: ProductoCreate):
        new_producto = Producto(
            NOMBRE=producto_data.NOMBRE,
            ID_MARCA=producto_data.ID_MARCA,
            ID_CATEGORIA=producto_data.ID_CATEGORIA,
            IMAGEN_URL=producto_data.IMAGEN_URL
        )
        db.add(new_producto)
        db.commit()
        db.refresh(new_producto)
        return new_producto
    
    @staticmethod
    def update_producto(db: Session, id_producto: int, producto_data: ProductoUpdate):
        producto = ProductoService.get_producto_by_id(db, id_producto)
        if not producto:
            return None
        
        if producto_data.NOMBRE is not None:
            producto.NOMBRE = producto_data.NOMBRE
        if producto_data.ID_MARCA is not None:
            producto.ID_MARCA = producto_data.ID_MARCA
        if producto_data.ID_CATEGORIA is not None:
            producto.ID_CATEGORIA = producto_data.ID_CATEGORIA
        if producto_data.IMAGEN_URL is not None:
            producto.IMAGEN_URL = producto_data.IMAGEN_URL
        
        db.commit()
        db.refresh(producto)
        return producto
    
    @staticmethod
    def delete_producto(db: Session, id_producto: int):
        producto = ProductoService.get_producto_by_id(db, id_producto)
        if not producto:
            return False
        db.delete(producto)
        db.commit()
        return True
    
    @staticmethod
    def get_producto_with_details(db: Session, id_producto: int):
        resultado = db.query(
            Producto.ID_PRODUCTO,
            Producto.NOMBRE,
            Marca.NOMBRE.label("MARCA"),
            Categoria.NOMBRE.label("CATEGORIA"),
            Producto.IMAGEN_URL
        ).join(
            Marca, Producto.ID_MARCA == Marca.ID_MARCA
        ).join(
            Categoria, Producto.ID_CATEGORIA == Categoria.ID_CATEGORIA
        ).filter(
            Producto.ID_PRODUCTO == id_producto
        ).first()
        
        return resultado