from fastapi import FastAPI
from routes import productos

app = FastAPI()

app.include_router(productos.router)