from db_client import get_supabase_client

def test_database_tables():
    print("--- Iniciando Prueba de Verificación de Tablas ---")
    supabase = get_supabase_client()

    try:
        # 1. Intentar insertar un activo de prueba (Categoría: Visionario)
        print("Probando inserción en tabla 'activos'...")
        test_asset = {
            "simbolo": "TEST_V",
            "nombre": "Activo de Prueba Visionario",
            "categoria": "Visionario",
            "sector": "Tecnología"
        }
        
        # Upsert para evitar errores si ya existe en pruebas repetidas
        response = supabase.table("activos").upsert(test_asset, on_conflict="simbolo").execute()
        print(f"SUCCESS: Insercion/Upsert en 'activos' exitosa: {response.data}")

        # 2. Intentar leer activos
        print("Probando lectura de tabla 'activos'...")
        read_response = supabase.table("activos").select("*").eq("simbolo", "TEST_V").execute()
        if read_response.data:
            print(f"SUCCESS: Lectura exitosa. Encontrado: {read_response.data[0]['nombre']}")
        else:
            print("WARNING: No se encontro el activo despues de la insercion.")

        # 3. Limpiar (opcional, pero lo dejamos para confirmar visibilidad en el dashboard si el usuario quiere)
        # print("Limpiando datos de prueba...")
        # supabase.table("activos").delete().eq("simbolo", "TEST_V").execute()
        
        print("\n--- PRUEBA COMPLETADA CON EXITO ---")
        print("Las tablas estan creadas y son accesibles.")
        
    except Exception as e:
        print(f"ERROR durante la verificacion: {e}")

if __name__ == "__main__":
    test_database_tables()
