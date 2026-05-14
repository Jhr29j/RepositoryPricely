from app.database import Base, engine
from app.models import *

def test_models():
    print("✅ Modelos importados correctamente")
    print("\nTablas disponibles:")
    for table in Base.metadata.tables.keys():
        print(f"  - {table}")

if __name__ == "__main__":
    test_models()