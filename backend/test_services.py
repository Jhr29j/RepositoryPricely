import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.services import AuthService, ProductoService, PrecioService, ListaService

print("✅ Todos los services importados correctamente")
print("Services disponibles:")
print("  - AuthService")
print("  - ProductoService")
print("  - PrecioService")
print("  - ListaService")