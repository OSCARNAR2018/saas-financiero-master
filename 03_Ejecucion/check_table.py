from db_client import get_supabase_client
import sys

def check():
    try:
        client = get_supabase_client()
        res = client.table('configuracion').select('*').limit(1).execute()
        print(f"Table exists. Rows: {len(res.data)}")
    except Exception as e:
        print(f"Error or table missing: {e}")

if __name__ == "__main__":
    check()
