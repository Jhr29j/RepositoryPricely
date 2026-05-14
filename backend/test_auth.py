from app.middleware.auth_middleware import role_required
from app.database import get_db
from app.security import create_access_token

# Probar creación de token
token_data = {
    "sub": "admin@gmail.com",
    "id_usuario": 2,
    "rol": "Administrador"
}

token = create_access_token(token_data)
print(f"Token de prueba: {token}")
print("\nUsa este token en Swagger:")
print("1. Ve a http://localhost:8000/docs")
print("2. Haz clic en 'Authorize'")
print("3. Ingresa: Bearer " + token)