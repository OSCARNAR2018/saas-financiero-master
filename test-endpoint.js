// Usando fetch global de Node.js (v18+)

async function testEndpoint() {
    const url = 'http://localhost:3000/api/analyze-news';
    const payload = {
        news_text: "Tesla reports massive failure in battery production, postponing Cybertruck deliveries indefinitely."
    };

    console.log('--- Enviando petición a:', url);
    console.log('--- Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log('--- Status:', response.status);
        if (response.ok) {
            console.log('--- Respuesta Exitosa:', JSON.stringify(data, null, 2));
        } else {
            console.error('--- Error en la Respuesta:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('--- Error de Conexión/Fetch:', error.message);
    }
}

testEndpoint();
