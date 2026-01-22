import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno si existe un archivo .env
load_dotenv()

# Credenciales de Supabase
# Se recomienda usar variables de entorno en producción. 
# Por ahora usamos las proporcionadas para asegurar continuidad inmediata.
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ldxssygtrwkcyehhorye.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeHNzeWd0cndrY3llaGhvcnllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODkyODY2MywiZXhwIjoyMDg0NTA0NjYzfQ.uW9eqIB38_dUXUu7V9Vsq_g9a0hGbVh1nfavJYfheno")

def get_supabase_client() -> Client:
    """
    Retorna una instancia del cliente de Supabase.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configuradas.")
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)

if __name__ == "__main__":
    # Prueba rápida de conexión
    try:
        client = get_supabase_client()
        print("[OK] Cliente de Supabase inicializado correctamente.")
    except Exception as e:
        print(f"[ERROR] Error al inicializar el cliente: {e}")
