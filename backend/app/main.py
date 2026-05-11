from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import time
from app.config import config
from app.routes import (
    auth_router,
    producto_router,
    supermercado_router,
    precios_router,
    lista_router,
    admin_router,
)

# Crear la aplicación FastAPI
app = FastAPI(
    title=config.APP_NAME,
    description="API para comparar precios de productos en supermercados de República Dominicana",
    version=config.API_VERSION,
    debug=config.DEBUG,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para logging de peticiones
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    return response

# Incluir routers
app.include_router(auth_router)
app.include_router(producto_router)
app.include_router(supermercado_router)
app.include_router(precios_router)
app.include_router(lista_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "message": f"Bienvenido a {config.APP_NAME} API",
        "version": config.API_VERSION,
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "API funcionando correctamente"
    }