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
    def get_all_productos_paginated(
        db: Session, 
        skip: int = 0, 
        limit: int = 100, 
        search: str = None, 
        categoria: int = None, 
        marca: int = None,
        supermercado: str = None,
        solo_ofertas: bool = False
    ):
        from app.models.precio import PrecioProducto
        from app.models.supermercado import Supermercado
        from sqlalchemy import func

        query = db.query(Producto)
        
        # Filtros básicos
        if search:
            query = query.filter(Producto.NOMBRE.contains(search))
        if categoria:
            query = query.filter(Producto.ID_CATEGORIA == categoria)
        if marca:
            query = query.filter(Producto.ID_MARCA == marca)
            
        # Filtro por supermercado (requiere join)
        if supermercado:
            query = query.join(PrecioProducto).join(Supermercado).filter(Supermercado.NOMBRE == supermercado)
            
        # Filtro por ofertas (si existiera columna, por ahora lo dejamos como stub)
        if solo_ofertas:
            # query = query.filter(PrecioProducto.EN_OFERTA == True)
            pass

        productos = query.order_by(Producto.ID_PRODUCTO).offset(skip).limit(limit).all()
        
        # Enriquecer productos con precios y metadatos
        result = []
        for p in productos:
            # Obtener precios para este producto
            precios_db = db.query(PrecioProducto, Supermercado.NOMBRE.label("SUPERMERCADO_NOMBRE"))\
                .join(Supermercado, PrecioProducto.ID_SUPERMERCADO == Supermercado.ID_SUPERMERCADO)\
                .filter(PrecioProducto.ID_PRODUCTO == p.ID_PRODUCTO).all()
            
            precios_list = []
            min_p = float('inf')
            has_offer = False
            
            for pr, super_nombre in precios_db:
                val = float(pr.PRECIO)
                if val < min_p: min_p = val
                
                # Mock de oferta (si precio < 500 por ejemplo, o simplemente False)
                # has_offer = has_offer or getattr(pr, 'EN_OFERTA', False)
                
                precios_list.append({
                    "id_precio": pr.ID_PRECIO,
                    "precio": val,
                    "precio_oferta": None, #getattr(pr, 'PRECIO_OFERTA', None),
                    "en_oferta": False, #getattr(pr, 'EN_OFERTA', False),
                    "supermercado": super_nombre
                })
            
            if min_p == float('inf'): min_p = 0.0
            
            # Crear objeto compatible con ProductoOut
            p_out = {
                "ID_PRODUCTO": p.ID_PRODUCTO,
                "NOMBRE": p.NOMBRE,
                "ID_MARCA": p.ID_MARCA,
                "ID_CATEGORIA": p.ID_CATEGORIA,
                "IMAGEN_URL": p.IMAGEN_URL,
                "marca": p.marca.NOMBRE if p.marca else "General",
                "categoria": p.categoria.NOMBRE if p.categoria else "General",
                "precios": precios_list,
                "en_oferta": has_offer,
                "precio_minimo": min_p
            }
            result.append(p_out)
            
        return result
    
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