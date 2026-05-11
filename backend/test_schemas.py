from app.schemas import *
from app.schemas.supermercado_schema import SupermercadoOut
from app.schemas.precio_schema import PrecioOut
from app.schemas.marca_schema import MarcaOut
from app.schemas.categoria_schema import CategoriaOut
from datetime import datetime

def test_schemas():
    print("✅ Todos los schemas importados correctamente")
    
    # Probar creación de objetos
    usuario = UsuarioOut(ID_USUARIO=1, NOMBRE="Test", CORREO="test@test.com", ID_ROL=1, FECHA_CREACION=datetime.now())
    print(f"✅ UsuarioOut: {usuario.NOMBRE}")
    
    producto = ProductoOut(ID_PRODUCTO=1, NOMBRE="Producto Test", ID_MARCA=1, ID_CATEGORIA=1)
    print(f"✅ ProductoOut: {producto.NOMBRE}")

if __name__ == "__main__":
    test_schemas()