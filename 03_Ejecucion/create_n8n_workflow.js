const axios = require('axios');
require('dotenv').config();

const BASE_URL = "http://127.0.0.1:5678/api/v1";
const API_KEY = process.env.N8N_API_KEY;

if (!API_KEY) {
    console.error("N8N_API_KEY no encontrada en .env");
    process.exit(1);
}

const workflowData = {
    "name": "SaaS Financiero - Cron",
    "nodes": [
        {
            "parameters": {
                "rule": {
                    "interval": [
                        {
                            "field": "days",
                            "value": 1
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
                "method": "GET",
                "url": `${process.env.SUPABASE_URL}/rest/v1/configuracion?select=modo_automatico`,
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "headerParameters": {
                    "parameters": [
                        {
                            "name": "apikey",
                            "value": process.env.SUPABASE_SERVICE_ROLE_KEY
                        },
                        {
                            "name": "Authorization",
                            "value": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
                        }
                    ]
                }
            },
            "id": "d8c2e1f4-a1b2-4c3d-bd5e-6f7g8h9i0j1k",
            "name": "Consultar Supabase",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4,
            "position": [650, 300]
        },
        {
            "parameters": {
                "conditions": {
                    "boolean": [
                        {
                            "value1": "={{ $json[0]?.modo_automatico }}",
                            "value2": true
                        }
                    ]
                }
            },
            "id": "a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p",
            "name": "If Modo Automático",
            "type": "n8n-nodes-base.if",
            "typeVersion": 1,
            "position": [900, 300]
        }
    ],
    "connections": {
        "Schedule Trigger": {
            "main": [
                [
                    {
                        "node": "Consultar Supabase",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Consultar Supabase": {
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
    "settings": {}
};

async function createWorkflow() {
    try {
        console.log(`Intentando conectar a n8n en ${BASE_URL}...`);
        const response = await axios.post(`${BASE_URL}/workflows`, workflowData, {
            headers: {
                "X-N8N-API-KEY": API_KEY,
                "Content-Type": "application/json"
            }
        });
        console.log(`✅ Workflow creado exitosamente ID: ${response.data.id}`);
        console.log(`Nombre: ${response.data.name}`);
    } catch (error) {
        if (error.response) {
            console.error("❌ Error de la API de n8n:", error.response.data);
        } else {
            console.error("❌ Error de red/configuración:", error.message);
        }
    }
}

createWorkflow();
