import sys
import os
import subprocess

def run_in_venv():
    # Obtener la ruta del directorio actual (donde está run.py)
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Ruta al ejecutable de python dentro del venv
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    
    # Comprobar si ya estamos ejecutando desde el venv
    # Si el ejecutable actual NO es el del venv, intentamos relanzar.
    current_exe = os.path.abspath(sys.executable).lower()
    venv_exe_abs = os.path.abspath(venv_python).lower()
    
    if os.path.exists(venv_python) and current_exe != venv_exe_abs:
        print(f"--- INFO: Sistema detectado: {current_exe}")
        print(f"--- INFO: Reiniciando en entorno virtual: {venv_exe_abs} ---")
        try:
            # Reemplazar el proceso actual con el del venv
            # Nota: Usamos subprocess.run y sys.exit para asegurar que el proceso padre espere
            result = subprocess.run([venv_python] + sys.argv, cwd=backend_dir)
            sys.exit(result.returncode)
        except Exception as e:
            print(f"--- ERROR: Fallo al iniciar venv: {e} ---")

if __name__ == "__main__":
    # Intentar forzar el uso del venv antes de importar nada más
    run_in_venv()

    # Si llegamos aquí, es que ya estamos en el venv o el venv no existe
    import uvicorn
    print("--- INFO: Servidor Pricely iniciado correctamente ---")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )