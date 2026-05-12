# Prueba técnica PALVI

## 1. Iniciar localmente

- **Requisitos**
  - Node (v24.13.x +)
  - Npm (v11.8.x +)

### 1.1. Clonar Reposotorio

**Por Https**

```bash
git clone https://github.com/jrge-dev/prueba-tecnica-palvi.git
```

### 1.2. Acceder al proyecto

```bash
cd prueba-tecnica-palvi
```

### 1.3. Instalar dependencias

```bash
npm install
```

### 1.4. Iniciar modo desarrollo

```bash
npm run dev
```

## Decisiones técnicas

### 1. Representación del Embudo de Ventas (Funnel)

El objetivo principal fue identificar métricas clave que permitan al Jefe de Ventas tomar decisiones estratégicas de forma ágil. Se optó por un modelo de embudo para visualizar la conversión semanal, desde la captación de usuarios hasta la venta final, permitiendo identificar cuellos de botella en el proceso comercial.

### 2. Análisis de Rendimiento Semanal

Se implementó una visualización del flujo de "Deals" para monitorizar la capacidad de cierre, el volumen de ventas exitosas y el estado del backlog. Esto permite registrar la evolución histórica del equipo y su eficiencia operativa.

### 3. Framework CSS (Tailwind)

Dado el carácter de prueba técnica y la importancia de la velocidad de desarrollo, utilicé Tailwind CSS. Esto facilitó una estilización rápida, responsiva y consistente sin comprometer la escalabilidad del diseño.

### 4. Visualización de Datos (Recharts)

Seleccioné Recharts por su excelente integración con React y su capacidad para renderizar gráficos declarativos, visualmente atractivos y fáciles de interpretar para el usuario final.

## Segunda Iteración

### 1. Optimización de la Lógica Analítica

Se identificó un error en el cálculo del backlog semanal: la existencia de ventas arrastradas de periodos previos al análisis generaba saldos negativos.

- Solución: Se ajustará la función getWeeklyDealsAnalytics() para normalizar el flujo histórico y asegurar que el backlog represente siempre una magnitud física real (mínimo 0).

### 2. Agregar métricas

Quedaron fuera métricas importantes con las cuales se pueden sacar diferentes conocimientos. Así que sería importante estudiarlas bien y generar los cruces necesarios que den conocimiento.

- Métricas:
  - Días entre apertura y cierre.
  - Deals abiertos sin novedades en 60 días.

