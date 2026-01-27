import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// Inicialización de Gemini con la API Key de las variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `Eres un analista financiero algorítmico. Analiza la noticia y responde ÚNICAMENTE con un objeto JSON válido (sin markdown) con esta estructura: { "summary": "Resumen conciso en español", "sentiment_score": Entero de -10 a +10, "ticker": "Símbolo principal o null" }`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newsText = body.newsText || body.news_text;

        if (!newsText) {
            return NextResponse.json({ error: "No news text provided (use 'newsText' or 'news_text')" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                error: "GEMINI_API_KEY no configurada en el servidor"
            }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `${SYSTEM_PROMPT}\n\nNoticia:\n${newsText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Limpieza de bloques de código markdown
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);

            // Persistencia en la tabla 'news' según instrucciones estrictas
            const { error: dbError } = await supabaseServer
                .from('news')
                .insert([{
                    ticker: jsonResponse.ticker,
                    sentiment_score: jsonResponse.sentiment_score,
                    summary: jsonResponse.summary,
                    news_text: newsText
                }]);

            if (dbError) {
                console.error("Error inserting into news table:", dbError);
            }

            // 1. Lógica de disparo para n8n: Si sentiment_score >= 7 o <= -7
            const sentiment = jsonResponse.sentiment_score;
            if (sentiment >= 7 || sentiment <= -7) {
                const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
                if (webhookUrl) {
                    // LLamada fetch envuelta en try/catch silencioso
                    // No usamos await aquí para no detener el flujo principal si el webhook tarda
                    fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ticker: jsonResponse.ticker,
                            score: sentiment,
                            summary: jsonResponse.summary,
                            url: body.url || body.newsUrl || "N/A",
                            timestamp: new Date().toISOString()
                        })
                    }).catch(err => {
                        console.error("Error silencioso en Webhook n8n:", err);
                    });
                } else {
                    console.warn("NEXT_PUBLIC_N8N_WEBHOOK_URL no está configurada, saltando disparo.");
                }
            }

            return NextResponse.json({
                ...jsonResponse,
                persisted: !dbError
            });
        } catch (parseError) {
            console.error("Error parsing AI response:", text);
            return NextResponse.json({
                error: "Error al procesar la respuesta de la IA",
                rawResponse: text
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Error in analyze-news API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
