from app.routes.auth_routes import router as auth_router
from app.routes.producto_routes import router as producto_router
from app.routes.supermercado_routes import router as supermercado_router
from app.routes.precios_routes import router as precios_router
from app.routes.lista_routes import router as lista_router
from app.routes.admin_routes import router as admin_router

__all__ = [
    "auth_router",
    "producto_router",
    "supermercado_router",
    "precios_router",
    "lista_router",
    "admin_router",
]