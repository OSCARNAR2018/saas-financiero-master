import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

BASE_URL = os.getenv("N8N_BASE_URL", "http://localhost:5678/api/v1")
API_KEY = os.getenv("N8N_API_KEY")

headers = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

workflow_data = {
    "name": "Análisis Diario Visionarios",
    "nodes": [
        {
            "parameters": {
                "rule": {
                    "interval": [
                        {
                            "field": "days"
                        }
                    ]
                }
            },
            "id": "e7b0af4a-f597-48f8-8422-77764d85698b",
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.scheduleTrigger",
            "typeVersion": 1,
            "position": [400, 300]
        },
        {
            "parameters": {
                "operation": "getMany",
                "table": "configuracion",
                "returnAll": True
            },
            "id": "d8c2e1f4-a1b2-4c3d-bd5e-6f7g8h9i0j1k",
            "name": "Supabase",
            "type": "n8n-nodes-base.supabase",
            "typeVersion": 1,
            "position": [620, 300],
            "credentials": {
                "supabaseApi": {
                    "id": "YOUR_CREDENTIAL_ID" # This usually needs to be created first in n8n
                }
            }
        },
        {
            "parameters": {
                "conditions": {
                    "boolean": [
                        {
                            "value1": "={{ $node[\"Supabase\"].json[\"modo_automatico\"] }}",
                            "value2": True
                        }
                    ]
                }
            },
            "id": "a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p",
            "name": "If Modo Automático",
            "type": "n8n-nodes-base.if",
            "typeVersion": 1,
            "position": [840, 300]
        }
    ],
    "connections": {
        "Schedule Trigger": {
            "main": [
                [
                    {
                        "node": "Supabase",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Supabase": {
            "main": [
                [
                    {
                        "node": "If Modo Automático",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    },
    "active": True
}

def create_workflow():
    try:
        response = requests.post(f"{BASE_URL}/workflows", headers=headers, json=workflow_data)
        if response.status_code == 200:
            print(f"Workflow creado exitosamente: {response.json().get('id')}")
        else:
            print(f"Error al crear workflow: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Excepción: {e}")

if __name__ == "__main__":
    create_workflow()
