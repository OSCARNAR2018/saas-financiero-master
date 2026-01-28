# REGLAS TÉCNICAS: VISIONARIOS BOLSA

## Introducción
Este documento define la lógica operativa para el sistema "Visionarios Bolsa", enfocado en la detección de activos con potencial de crecimiento explosivo mediante la identificación de rupturas de máximos tras periodos de acumulación.

## Lógica de Inversión (Core Strategy)

### 1. Fase de Acumulación (Preparación)
- **Rango Lateral (Box)**: El activo debe haber cotizado en un rango estrecho (consolidación) durante al menos 4-12 semanas.
- **Disminución de Volumen**: Durante la consolidación, el volumen debe ser inferior a la media, indicando que el "papel" está en manos fuertes y no hay presión vendedora.
- **Ubicación**: Preferiblemente cerca de máximos históricos o máximos de 52 semanas.

### 2. Disparador de Entrada (Trigger)
- **Ruptura de Resistencia**: Cierre diario/semanal por encima del límite superior del rango de acumulación o ATH (All-Time High).
- **Explosión de Volumen**: El volumen en el día de la ruptura debe ser al menos un **50% superior** a la media de los últimos 20 periodos.
- **Fuerza Relativa (RS)**: El activo debe mostrar un desempeño superior al índice de referencia (S&P 500 o Nasdaq) durante la fase previa.

### 3. Gestión de Riesgos (Exit & Sizing)
- **Stop Loss Inicial**: Situado un 1% por debajo del punto de ruptura o bajo la media móvil simple de 21 sesiones (SMA 21).
- **Trailing Stop**: Elevar el stop a medida que el precio avanza, utilizando la SMA 10 o SMA 21 como guía.
- **Toma de Beneficios**: Salida parcial en objetivos de +20-25% si el impulso se agota, o salida total si se rompe la línea de tendencia alcista con volumen.

## Parámetros Algorítmicos (Para Scripts de Ejecución)
- `LOOKBACK_PERIOD = 252` (Días para máximos de 52 semanas)
- `MIN_CONSOLIDATION_WEEKS = 4`
- `VOLUME_SURGE_THRESHOLD = 1.5` (150% del volumen medio)
- `MAX_ADJUSTED_RS = 80` (Métrica de score de fuerza relativa)
