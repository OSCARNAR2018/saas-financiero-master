import yfinance as yf
import pandas as pd
import numpy as np
import os
from supabase import create_client, Client
from datetime import datetime, timedelta

# Configuración de Supabase (SaaS_Financiero_Master)
SUPABASE_URL = "https://nwtayxatcsvtlmpqmshm.supabase.co"
# Nota: Usamos la anon key por simplicidad en este script de ejemplo
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dGF5eGF0Y3N2dGxtcHFtc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTUyNTQsImV4cCI6MjA4NTAzMTI1NH0.RtQ1-DPI7W-gFxed3LrbhzOsb3dmtiFMLiHub9rzR5Q"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def detect_breakout(ticker: str):
    print(f"[{datetime.now()}] Analizando {ticker}...")
    
    # Obtener datos (1 año para tener contexto de 52 semanas)
    data = yf.download(ticker, period="1y", interval="1d")
    
    if data.empty or len(data) < 50:
        print(f"Datos insuficientes para {ticker}")
        return

    # 1. Fase de Acumulación (Baja volatilidad / Rango estrecho)
    # Buscamos las últimas 4-8 semanas (20-40 días de trading)
    consolidation_period = 30
    recent_data = data.iloc[-consolidation_period:-1] # Excluimos el último día (posible ruptura)
    
    high_range = recent_data['High'].max()
    low_range = recent_data['Low'].min()
    range_pct = (high_range - low_range) / low_range * 100
    
    # 2. Ruptura
    current_day = data.iloc[-1]
    prev_day = data.iloc[-2]
    
    is_breakout = (current_day['Close'].item() > high_range.item())
    
    # 3. Volumen (Surge > 50% media 20 días)
    avg_volume = data['Volume'].iloc[-21:-1].mean()
    volume_surge = (current_day['Volume'].item() > (avg_volume.item() * 1.5))
    
    print(f"  - Rango Consolidación: {range_pct.item():.2f}%")
    print(f"  - Cierre: {current_day['Close'].item():.2f} | Máximo Rango: {high_range.item():.2f}")
    print(f"  - Volumen: {current_day['Volume'].item():.0f} | Media: {avg_volume.item():.0f}")

    if is_breakout and volume_surge:
        print(f"¡SEÑAL DETECTADA en {ticker}!")
        
        signal_data = {
            "ticker": ticker,
            "pattern_detected": "Rotura tras Acumulación (Visionarios)",
            "confidence_level": "Alta" if range_pct.item() < 10 else "Media",
            "analysis_summary": f"Ruptura de rango de {range_pct.item():.1f}% con volumen {current_day['Volume'].item()/avg_volume.item():.1f}x superior a la media.",
            "signal_date": datetime.now().isoformat()
        }
        
        try:
            response = supabase.table("technical_signals").insert(signal_data).execute()
            print(f"Señal guardada en Supabase para {ticker}")
        except Exception as e:
            print(f"Error al guardar en Supabase: {e}")
    else:
        print(f"No hay señales claras para {ticker} hoy.")

if __name__ == "__main__":
    # Tickers de ejemplo para probar (Small & Mid Caps con potencial)
    test_tickers = ["PLTR", "CELH", "SYM", "RKLB", "NVDA"]
    for t in test_tickers:
        detect_breakout(t)
